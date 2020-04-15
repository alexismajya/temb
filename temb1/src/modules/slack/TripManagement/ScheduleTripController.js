import UserInputValidator from '../../../helpers/slack/UserInputValidator';
import Validators from '../../../helpers/slack/UserInputValidator/Validators';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import { addressService } from '../../addresses/address.service';
import TripDetailsService from '../../trips/trip-detail.service';
import tripService from '../../trips/trip.service';
import { homebaseService } from '../../homebases/homebase.service';

class ScheduleTripController {
  static validateTravelContactDetailsForm(payload) {
    const errors = [];
    errors.push(...UserInputValidator.validateTravelContactDetails(payload));
    return errors;
  }

  static async validateTravelDetailsForm(payload, tripType, status = 'standard') {
    const { submission } = payload;
    const travelDateTime = submission.flightDateTime || submission.embassyVisitDateTime;
    const dateFieldName = tripType === 'embassy' ? 'embassyVisitDateTime' : 'flightDateTime';
    const allowedHours = tripType === 'embassy' ? 3 : 4;
    return ScheduleTripController.passedStatus(submission, payload, status,
      travelDateTime, dateFieldName, allowedHours);
  }

  static async passedStatus(submission, payload, status,
    travelDateTime, dateFieldName, allowedHours) {
    const errors = [];
    if (status === 'pickup' || status === 'destination') {
      errors.push(...await UserInputValidator.validatePickupDestinationEntry(payload, status,
        dateFieldName, travelDateTime, allowedHours));
    } else {
      errors.push(...UserInputValidator.validateTravelFormSubmission(submission));
      errors.push(...await UserInputValidator.validateDateAndTimeEntry(payload,
        dateFieldName));
      errors.push(...UserInputValidator.validateLocationEntries(payload));
      errors.push(...Validators.checkDateTimeIsHoursAfterNow(allowedHours,
        travelDateTime, dateFieldName));
      errors.push(...Validators.validateDialogSubmission(payload));
    }
    return errors;
  }

  static async validateTripDetailsForm(payload, typeOfDialogBox) {
    const errors = [];
    try {
      errors.push(...Validators.validateDialogSubmission(payload));
      if (typeOfDialogBox === 'pickup') {
        errors.push(...UserInputValidator
          .validatePickupDestinationLocationEntries(payload, typeOfDialogBox));
        errors.push(...await UserInputValidator.validateDateAndTimeEntry(payload));
      } else if (typeOfDialogBox === 'destination') {
        errors.push(...UserInputValidator
          .validatePickupDestinationLocationEntries(payload, typeOfDialogBox));
      }
      return errors;
    } catch (error) {
      bugsnagHelper.log(error);
      throw error;
    }
  }

  static async getIdFromLocationInfo(lat, lng, place, othersPlace) {
    let result;
    const unknownPlace = place === 'Others';
    const address = unknownPlace ? othersPlace : place;
    if (lat && lng) {
      result = await addressService.findOrCreateAddress(address, { longitude: lng, latitude: lat });
      return result;
    }
    result = await addressService.findOrCreateAddress(address);
    return result;
  }

  static async getLocationIds(tripRequestDetails) {
    const {
      destination, pickup, othersPickup, othersDestination, pickupLat, pickupLong,
      destinationCoords, destinationLat, destinationLong, pickupId
    } = tripRequestDetails;
    if (pickupId && destinationCoords) {
      return { originId: pickupId, destinationId: destinationCoords.id };
    }
    const { id: originId } = await ScheduleTripController
      .getIdFromLocationInfo(pickupLat, pickupLong, pickup, othersPickup);
    const { id: destinationId } = await ScheduleTripController
      .getIdFromLocationInfo(destinationLat, destinationLong, destination, othersDestination);
    return { originId, destinationId };
  }

  static async createRequestObject(tripRequestDetails, requester) {
    try {
      const {
        reason, dateTime, departmentId, destination, pickup, tripNote,
        othersPickup, othersDestination, passengers, tripType, distance
      } = tripRequestDetails;
      const { originId, destinationId } = await ScheduleTripController
        .getLocationIds(tripRequestDetails);
      const homebase = await homebaseService.getHomeBaseBySlackId(requester.slackId);
      const pickupName = `${pickup === 'Others' ? othersPickup : pickup}`;
      const destinationName = `${destination === 'Others' ? othersDestination : destination}`;
      return {
        riderId: requester.id,
        name: `From ${pickupName} to ${destinationName} on ${dateTime}`,
        reason,
        departmentId,
        tripStatus: 'Pending',
        departureTime: dateTime,
        requestedById: requester.id,
        originId,
        destinationId,
        noOfPassengers: passengers,
        tripType,
        tripNote,
        distance,
        homebaseId: homebase.id
      };
    } catch (error) { bugsnagHelper.log(error); throw error; }
  }

  static async createRequest(payload, tripRequestDetails) {
    try {
      const { user: { id: slackUserId }, team: { id: teamId } } = payload;
      const requester = await SlackHelpers.findOrCreateUserBySlackId(slackUserId, teamId);
      const request = await ScheduleTripController
        .createRequestObject(tripRequestDetails, requester);

      if (tripRequestDetails.forMe === false) {
        const { rider } = tripRequestDetails;
        const passenger = await SlackHelpers.findOrCreateUserBySlackId(rider, teamId);
        request.riderId = passenger.id;
      }
      return request;
    } catch (error) {
      bugsnagHelper.log(error);
      throw error;
    }
  }

  static async createTravelTripRequest(payload, tripDetails) {
    try {
      const tripRequest = await ScheduleTripController.createRequest(payload, tripDetails);
      const { id } = await ScheduleTripController.createTripDetail(tripDetails);
      const tripData = { ...tripRequest, tripDetailId: id };
      const trip = await tripService.createRequest(tripData);
      return tripService.getById(trip.id, true);
    } catch (error) {
      bugsnagHelper.log(error);
      throw error;
    }
  }

  static async createTripDetail(tripInfo) {
    try {
      const { riderPhoneNo, travelTeamPhoneNo, flightNumber } = tripInfo;
      const tripDetail = await TripDetailsService.createDetails(
        riderPhoneNo,
        travelTeamPhoneNo,
        flightNumber
      );

      return tripDetail;
    } catch (error) {
      bugsnagHelper.log(error);
      throw error;
    }
  }
}

export default ScheduleTripController;
