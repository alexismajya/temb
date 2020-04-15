import HttpError from '../../helpers/errorHandler';
import BugSnagHelper from '../../helpers/bugsnagHelper';
import { DEFAULT_SIZE as defaultSize } from '../../helpers/constants';
import Response from '../../helpers/responseHelper';
import { routeService } from './route.service';
import { routeBatchService } from '../routeBatches/routeBatch.service';
import { routeStatistics } from './route-statistics.service';
import SequelizePaginationHelper from '../../helpers/sequelizePaginationHelper';
import { RoutesHelper } from '../../helpers/googleMaps/googleMapsHelpers';
import GoogleMapsPlaceDetails from '../../services/googleMaps/GoogleMapsPlaceDetails';
import Cache from '../shared/cache';
import { slackEventNames } from '../slack/events/slackEvents';
import { SlackInteractiveMessage } from '../slack/SlackModels/SlackMessageModels';
import { addressService } from '../addresses/address.service';
import RouteRequestService from './route-request.service';
import UserService from '../users/user.service';
import RouteHelper from '../../helpers/RouteHelper';
import RouteNotifications from '../slack/SlackPrompts/notifications/RouteNotifications';
import { teamDetailsService } from '../teamDetails/teamDetails.service';
import slackEvents from '../slack/events';
import ApiVersionHelper from '../../helpers/apiVersionHelper';
import { homebaseService } from '../homebases/homebase.service';

class RoutesController {
  /**
   * @description Read the routes batch records
   * @param  {object} req The http request object
    * @param  {object} res The http response object
   * @returns {object} The http response object
   */
  static async getRoutes(req, res) {
    try {
      let {
        page, size, sort, name
      } = req.query;
      page = page || 1;
      size = size || defaultSize;
      name = name || null;
      const { query: { status }, currentUser: { userInfo } } = req;
      const { homebaseId } = await UserService.getUserByEmail(userInfo.email);
      
      sort = SequelizePaginationHelper.deserializeSort(sort || 'name,asc,id,asc');

      const pageable = { page, size, sort };
      const where = { name, status };
     
      const result = ApiVersionHelper.getApiVersion(req) === 'v1'
        ? await routeBatchService.getRoutes(pageable, where, homebaseId)
        : await routeBatchService.getRoutes(pageable, where, homebaseId, true);
      const message = `${result.pageNo} of ${result.totalPages} page(s).`;
      return Response.sendResponse(res, 200, true, message, result);
    } catch (error) {
      BugSnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  static async createRoute(req, res) {
    let message; let batch; let routeName;
    const { query: { action, batchId }, body } = req;
    try {
      const { botToken } = await teamDetailsService.getTeamDetailsByTeamUrl(body.teamUrl);
      if (action === 'duplicate' && batchId) {
        ({ batch, routeName } = await RouteHelper.duplicateRouteBatch(batchId, botToken));
        message = `Successfully duplicated ${routeName} route`;
      } else if (!batchId) {
        const result = await RouteHelper.createNewRouteWithBatch(body, botToken);
        ({ batch } = result);
        const { provider } = body;
        slackEvents.raise(
          slackEventNames.SEND_PROVIDER_CREATED_ROUTE_REQUEST, batch, provider.id, botToken
        );
        message = 'Route created successfully';
      }
      return Response.sendResponse(res, 200, true, message, batch);
    } catch (error) {
      BugSnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  static async saveDestination(destinationCoordinates) {
    const [lat, long] = destinationCoordinates.split(',');
    const address = await addressService.findAddressByCoordinates(long, lat);

    if (address) {
      return address;
    }
    const place = await RoutesHelper.getPlaceInfo('coordinates', destinationCoordinates);

    if (!place) { HttpError.throwErrorIfNull(null, 'Invalid Coordinates', 400); }

    const {
      geometry: { location: { lat: latitude, lng: longitude } }
    } = place;

    const placeDetails = await GoogleMapsPlaceDetails.getPlaceDetails(place.place_id);
    const newAddress = `${placeDetails.result.name}, ${placeDetails.result.formatted_address}`;
    return addressService.createNewAddress(longitude, latitude, newAddress);
  }

  /**
   * returns all route requests
   * @param req
   * @param res
   * @returns {Promise<*>}
   * @typedef RouteRequest
   * @type {Object}
   * @property {number} id: route ID
   * @property {string} distance: distance of the route
   * @property {string} opsComment: Comment made by operations
   * @property {string} managerComment: Comment made by a manager
   * @property {string} busStopDistance: distance of the busStop from home
   * @property {string} routeImageUrl: image URL for the map
   * @property {string} status: status of the route
   * @property {Engagement: {Object}} engagement: engagement details of fellow
   * @property {User: {Object}} manager: manager details
   * @property {Location: {Object}} busStop: bus stop location
   * @property {Location: {Object}} home: home location
   */
  static async getAll(req, res) {
    try {
      const { currentUser: { userInfo } } = req;
      const { homebaseId } = await UserService.getUserByEmail(userInfo.email);
      const routes = await RouteRequestService.getAllConfirmedRouteRequests(homebaseId);
      return res.status(200).json({ routes });
    } catch (e) {
      return res.status(500).json({ message: 'An error has occurred', success: false });
    }
  }

  /**
   * @description returns a given route's details
   * @param req
   * @param res
   * @returns {object} The http response object
   */
  static async getOne(req, res) {
    try {
      const route = await routeService.getRouteById(req.params.id, false);
      if (!route) throw new Error('route not found');
      return res.status(200).json({
        message: 'Success',
        route
      });
    } catch (error) {
      BugSnagHelper.log(error);
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
  }

  /**
   * @description update the routes batch records
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @returns {object} The http response object
   */
  static async updateRouteBatch(req, res) {
    try {
      const {
        body,
        params: { routeId: id }
      } = req;
      const result = await routeBatchService.updateRouteBatch(+id, body);
      const routeBatch = await routeBatchService.getRouteBatchByPk(result.id, true);
      const slackTeamUrl = body.teamUrl.trim();
      slackEvents.raise(slackEventNames.NOTIFY_ROUTE_RIDERS, slackTeamUrl, routeBatch);
      const message = 'Route batch successfully updated';
      return Response.sendResponse(res, 200, true, message, routeBatch);
    } catch (error) {
      BugSnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  /**
   * @description This method changes the status of a route request
   * @param  {Object} req The HTTP request object
   * @param  {Object} res The HTTP response object
   */
  static async updateRouteRequestStatus(req, res) {
    try {
      const {
        params: { requestId }, body, currentUser: { userInfo: { email } }
      } = req;
      const routeRequest = await RouteRequestService.getRouteRequestByPk(requestId);
      RoutesController.checkCurrentApprovalStatus(routeRequest, res);
      const opsReviewer = await UserService.getUserByEmail(email);

      const updatedRequest = await RouteHelper.updateRouteRequest(routeRequest.id, {
        status: body.newOpsStatus === 'approve' ? 'Approved' : 'Declined',
        opsComment: body.comment,
        opsReviewerId: opsReviewer.id
      });

      const submission = RoutesController.getSubmissionDetails(body, routeRequest);

      await RoutesController.completeRouteApproval(updatedRequest, submission, body.teamUrl,
        opsReviewer.slackId);
      return Response.sendResponse(res, 201, true, 'This route request has been updated');
    } catch (error) {
      BugSnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  static checkCurrentApprovalStatus(routeRequest, res) {
    if (!routeRequest) {
      return Response.sendResponse(res, 404,
        false, 'Route request not found.');
    }
    const checkStatus = RouteHelper.validateRouteStatus(routeRequest);
    if (checkStatus !== true) { return Response.sendResponse(res, 409, false, checkStatus); }
  }

  static getSubmissionDetails(body, updatedRequest) {
    return {
      routeName: body.routeName,
      destination: updatedRequest.busStop,
      takeOffTime: body.takeOff,
      teamUrl: body.teamUrl,
      routeCapacity: null,
      providerId: 1,
      imageUrl: updatedRequest.routeImageUrl
    };
  }

  static async completeRouteApproval(updatedRequest, submission, teamUrl, opsSlackId) {
    const { botToken } = await teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
    const { channel: opsChannelId } = await homebaseService.getHomeBaseBySlackId(opsSlackId);
    const { timeStamp } = await Cache.fetch(`RouteRequestTimeStamp_${updatedRequest.id}`);
    const additionalData = {
      channelId: opsChannelId,
      opsSlackId,
      timeStamp,
      submission,
      botToken
    };
    if (updatedRequest.status === 'Approved') {
      const batch = await RouteHelper.createNewRouteWithBatch(submission);
      slackEvents.raise(
        slackEventNames.COMPLETE_ROUTE_APPROVAL, updatedRequest, batch, additionalData
      );
      return;
    }
    slackEvents.raise(
      slackEventNames.OPERATIONS_DECLINE_ROUTE_REQUEST, updatedRequest, botToken,
      opsChannelId, timeStamp, opsSlackId, true
    );
  }

  /**
   * @description This method deletes a routeBatch
   * @param  {Object} req The HTTP request object
   * @param  {Object} res The HTTP response object
   * @returns {object} The http response object
   */
  static async deleteRouteBatch(req, res) {
    let message;
    try {
      const {
        params: { routeBatchId },
        body: { teamUrl }
      } = req;
      const slackTeamUrl = teamUrl.trim();
      const routeBatch = await routeBatchService.getRouteBatchByPk(routeBatchId, true);
      if (!routeBatch) {
        message = 'route batch not found';
        HttpError.throwErrorIfNull(routeBatch, message);
      }
      const result = await routeBatchService.deleteRouteBatch(routeBatchId);
      if (result > 0) {
        routeBatch.deleted = true;
        await slackEvents.raise(slackEventNames.NOTIFY_ROUTE_RIDERS, slackTeamUrl, routeBatch);
        message = 'route batch deleted successfully';
        return Response.sendResponse(res, 200, true, message);
      }
    } catch (error) {
      BugSnagHelper.log(error);
      return HttpError.sendErrorResponse(error, res);
    }
  }

  static async deleteFellowFromRoute(req, res) {
    try {
      const { params: { userId }, body: { teamUrl } } = req;
      let message = "user doesn't belong to this route";
      const { routeBatchId, slackId } = await UserService.getUserById(userId);
      if (routeBatchId && slackId) {
        await UserService.updateUser(userId, { routeBatchId: null });
        const { botToken: teamBotOauthToken } = await teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
        const { routeId } = await routeBatchService.getRouteBatchByPk(routeBatchId, false);
        const { name } = await routeService.getRouteById(routeId, false);
        const text = '*:information_source: Reach out to Ops department for any questions*';
        const slackMessage = new SlackInteractiveMessage(
          `*Hey <@${slackId}>, You've been removed from \`${name}\` route.* \n ${text}.`
        );
        await RouteNotifications.sendNotificationToRider(slackMessage, slackId, teamBotOauthToken);
        message = 'engineer successfully removed from the route';
      }
      return Response.sendResponse(res, 200, true, message);
    } catch (error) {
      BugSnagHelper.log(error);
      return HttpError.sendErrorResponse(error, res);
    }
  }

  static async getRouteStatistics(req, res) {
    const { query: { from, to }, headers: { homebaseid } } = req;
    try {
      const result = await routeStatistics.getTopAndLeastFrequentRiders(from, to, homebaseid);
      return Response.sendResponse(res, 200, true, 'data retrieved successfully', result);
    } catch (error) {
      BugSnagHelper.log(error);
      return HttpError.sendErrorResponse(error, res);
    }
  }
}
export default RoutesController;
