import { DEFAULT_SIZE as defaultSize } from '../../helpers/constants';
import Response from '../../helpers/responseHelper';
import tripService from './trip.service';
import { teamDetailsService } from '../teamDetails/teamDetails.service';
import UserService from '../users/user.service';
import RouteUseRecordService from '../../services/RouteUseRecordService';
import TripActionsController from '../slack/TripManagement/TripActionsController';
import HttpError from '../../helpers/errorHandler';
import TripHelper from '../../helpers/TripHelper';
import { cabService } from '../cabs/cab.service';
import { driverService } from '../drivers/driver.service';
import { homebaseService } from '../homebases/homebase.service';

class TripsController {
  static async getTrips(req, res) {
    try {
      let { query: { page, size } } = req;
      const { headers: { homebaseid } } = req;
      page = page || 1;
      size = size || defaultSize;
      const query = TripsController.getRequestQuery(req);
      const where = tripService.sequelizeWhereClauseOption(query);
      const pageable = { page, size };
      const {
        totalPages, trips, page: pgNo, totalItems, itemsPerPage
      } = await tripService.getTrips(pageable, where, homebaseid);
      const message = `${pgNo} of ${totalPages} page(s).`;
      const pageData = {
        pageMeta: {
          totalPages,
          page: pgNo,
          totalResults: totalItems,
          pageSize: itemsPerPage
        },
        trips
      };
      return Response.sendResponse(res, 200, true, message, pageData);
    } catch (error) { HttpError.sendErrorResponse(error, res); }
  }

  static getRequestQuery(req) {
    const departureTime = TripHelper.cleanDateQueryParam(req.query, 'departureTime');
    const requestedOn = TripHelper.cleanDateQueryParam(req.query, 'requestedOn');
    return {
      ...req.query,
      requestedOn,
      departureTime
    };
  }

  static appendPropsToPayload(payload, req) {
    const { body: { comment, isAssignProvider }, query: { action } } = req;
    const derivedPayload = { ...payload };
    if (action === 'confirm') {
      derivedPayload.submission = TripsController.getConfirmationSubmission(req.body);
      const state = JSON.parse(derivedPayload.state);
      state.isAssignProvider = isAssignProvider;
      derivedPayload.state = JSON.stringify(state);
    }
    if (action === 'decline') {
      derivedPayload.submission = { opsDeclineComment: comment };
    }
    return derivedPayload;
  }

  /**
   * @description Updates the trip status
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @returns {object} The http response object
   */
  static async updateTrip(req, res) {
    const {
      params: { tripId }, query: { action }, body: { slackUrl }, currentUser
    } = req;
    const payload = await TripsController.getCommonPayloadParam(currentUser, slackUrl, tripId);

    const actionSuccessMessage = action === 'confirm' ? 'trip confirmed' : 'trip declined';
    const derivedPayload = TripsController.appendPropsToPayload(payload, req);
    const result = await TripActionsController.changeTripStatus(derivedPayload);
    const responseMessage = result === 'success' ? actionSuccessMessage : result.text;
    return res.status(200).json({ success: result === 'success', message: responseMessage });
  }

  static async getSlackIdFromReq(user) {
    const { userInfo: { email } } = user;
    const { slackId: userId } = await UserService.getUserByEmail(email);
    return userId;
  }

  static async getCommonPayloadParam(user, slackUrl, tripId) {
    const userId = await TripsController.getSlackIdFromReq(user);
    const { teamId } = await teamDetailsService.getTeamDetailsByTeamUrl(slackUrl);
    const trip = await tripService.getById(tripId);
    const { channel } = await homebaseService.getById(trip.homebaseId);
    const state = JSON.stringify({
      trip: tripId,
      tripId,
      actionTs: +new Date()
    });
    const payload = {
      submission: {},
      user: { id: userId },
      team: { id: teamId },
      channel: { id: channel },
      state
    };
    return payload;
  }

  static getConfirmationSubmission(reqBody) {
    const {
      driverName, driverPhoneNo, regNumber, comment, providerId
    } = reqBody;
    return {
      confirmationComment: comment,
      driverName,
      driverPhoneNo,
      regNumber,
      providerId
    };
  }

  /**
   * @description gets the Travel trips,cost, count and average
   *  rating for specified period by department
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @returns {object} The http response object
   */

  static async getTravelTrips(req, res) {
    const {
      body: {
        startDate, endDate, departmentList,
      }, headers: { homebaseid }
    } = req;
    const travelTrips = await tripService.getCompletedTravelTrips(
      startDate, endDate, departmentList, homebaseid
    );

    const result = travelTrips.map((trip) => {
      const tripObject = trip;
      tripObject.averageRating = parseFloat(trip.averageRating).toFixed(2);
      return tripObject;
    });
    const { finalCost, finalAverageRating, count } = await
    TripHelper.calculateSums(result);

    const data = {
      trips: result, finalCost, finalAverageRating, count
    };
    return Response.sendResponse(res, 200, true, 'Request was successful', data);
  }

  static async getRouteTrips(req, res) {
    const { query: { page = 1, size = 10 }, headers: { homebaseid } } = req;
    try {
      let routeTrips = await RouteUseRecordService.getRouteTripRecords({ page, size }, homebaseid);
      if (!routeTrips.data) {
        return Response.sendResponse(res, 200, true, 'No route trips available yet', []);
      }

      const { pageMeta, data } = routeTrips;
      routeTrips = await RouteUseRecordService.getAdditionalInfo(data);

      if (routeTrips.length === 0) {
        return Response.sendResponse(res, 200, true, 'No route trips available yet', []);
      }

      const result = { pageMeta: { ...pageMeta }, data: routeTrips };

      return Response
        .sendResponse(res, 200, true, 'Route trips retrieved successfully', result);
    } catch (error) {
      HttpError.sendErrorResponse(error, res);
    }
  }

  static async providerConfirm(req, res) {
    try {
      const {
        teamId, providerId, tripId, vehicleRegNo, driverName,
        driverPhoneNo, vehicleModel, color,
      } = req.body;
      const error = await TripHelper.checkExistence(teamId, providerId, tripId);
      if (error) return Response.sendResponse(res, 404, false, { error: `${error}` });
      const driver = await driverService.create(driverName, driverPhoneNo, providerId);
      const { cab } = await cabService.findOrCreateCab(vehicleRegNo, null,
        vehicleModel, providerId, color);
      const payload = {
        driverName: driver.driverName,
        driverPhoneNo: driver.driverPhoneNo,
        vehicleModel: cab.model,
        vehicleRegNo: cab.regNumber,
        vehicleColor: cab.color,
      };
      await tripService.completeCabAndDriverAssignment({
        tripId, updateData: { cabId: cab.id, driverId: driver.id }, teamId
      });
      return Response.sendResponse(res, 201, true, { message: 'Confirmation received', payload });
    } catch (error) {
      return Response.sendResponse(res, 500, false, {
        error: 'Failed to complete trip confirmation, Please try again'
      });
    }
  }
}

export default TripsController;
