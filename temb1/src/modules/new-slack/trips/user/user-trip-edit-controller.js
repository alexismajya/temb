import UserTripHelpers from './user-trip-helpers';
import Interactions from './interactions';
import UserTripBookingController from './user-trip-booking-controller';
import Cache from '../../../shared/cache';
import { getTripKey } from '../../../../helpers/slack/ScheduleTripInputHandlers';

export default class UserTripEditController {
  static async saveEditedDestination(payload, submission, respond) {
    try {
      await UserTripHelpers.handleDestinationDetails(
        payload.user,
        submission
      );
      await Interactions.sendPostDestinationMessage(payload, submission);
    } catch (err) {
      const errors = err.errors || { destination: 'An unexpected error occured' };
      return respond.error(errors);
    }
  }

  static async editRequest(payload) {
    const tripDetails = await Cache.fetch(getTripKey(payload.user.id));
    const { team: { id }, trigger_id: triggerId, response_url: responseUrl } = payload;
    const [allDepartments, homebaseName] = await UserTripBookingController.fetchDepartments(
      payload.user.id, id
    );
    await Interactions.sendEditRequestModal(
      tripDetails, id, triggerId, responseUrl, allDepartments, homebaseName
    );
  }

  static async saveEditRequestDetails(payload, submission, respond, context) {
    const {
      rider, reason, passengers: chosenPassengers, department, date, time,
      pickup, othersPickup,
    } = submission;
    const { user } = payload;
    
    await UserTripBookingController.saveRider(payload, rider);
    const forMe = user.id === rider;
    const passengers = parseInt(chosenPassengers, 10) + 1;
    const [allDepartments] = await UserTripBookingController.fetchDepartments(
      payload.user.id, payload.team.id
    );
    const [{ value: departmentId }] = allDepartments.filter((e) => e.text === department);
    const toCache = {
      forMe, reason, passengers, department, departmentId
    };
    await Cache.saveObject(getTripKey(payload.user.id), toCache);

    const isEdit = true;
    await UserTripBookingController.savePickupDetails(payload, {
      date, time, pickup, othersPickup,
    }, respond, context, isEdit);
  }
}
