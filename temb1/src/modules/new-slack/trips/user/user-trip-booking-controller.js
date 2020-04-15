import { Block, BlockMessage } from '../../models/slack-block-models';
import UserTripHelpers from './user-trip-helpers';
import {
  SlackInteractiveMessage
} from '../../../slack/SlackModels/SlackMessageModels';
import TripHelpers from './trip.helpers';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import { getTripKey } from '../../../../helpers/slack/ScheduleTripInputHandlers';
import Cache from '../../../shared/cache';
import Interactions from './interactions';
import NewSlackHelpers from '../../helpers/slack-helpers';
import userTripActions from './actions';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import InteractivePromptSlackHelper from '../../../slack/helpers/slackHelpers/InteractivePromptSlackHelper';
import UserService from '../../../users/user.service';
import ScheduleTripHelpers from './schedule-trip.helpers';
import ItineraryController from './itinerary.controller';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import { getTripPickupSchema } from '../schemas';
import TravelHelpers from '../travel/travel.helpers';
import { departmentService } from '../../../departments/department.service';
import { homebaseService } from '../../../homebases/homebase.service';

export default class UserTripBookingController {
  static startTripBooking(payload, respond) {
    const message = UserTripHelpers.createStartMessage();
    respond(message);
  }

  static async forMe(payload, respond) {
    const forMe = payload.actions[0].action_id === userTripActions.forMe;
    await Cache.save(getTripKey(payload.user.id), 'forMe', forMe);
    if (forMe) {
      const state = { origin: payload.response_url };
      await Interactions.sendTripReasonForm(payload, state);
    } else {
      const message = UserTripHelpers.getRiderSelectMessage();
      respond(message);
    }
  }

  static async saveRider(payload, optional = '') {
    const rider = payload.actions === undefined ? optional : payload.actions[0].selected_user;
    await SlackHelpers.findOrCreateUserBySlackId(rider, payload.team.id);
    await Cache.save(getTripKey(payload.user.id), 'rider', rider);
    const state = { origin: payload.response_url };
    if (payload.actions) {
      await Interactions.sendTripReasonForm(payload, state);
    }
  }

  static async handleReasonSubmit(payload) {
    if (payload.submission) {
      const result = await UserTripHelpers.setReason(
        payload.user.id,
        payload.submission
      );
      if (result && result.errors) return result;
    }
    await Interactions.sendAddPassengers(payload.state);
  }

  static async saveExtraPassengers(payload, respond) {
    let noOfPassengers = payload.actions[0].value
      ? payload.actions[0].value
      : payload.actions[0].selected_option.value;
    noOfPassengers = +noOfPassengers + 1;
    await Cache.save(getTripKey(payload.user.id), 'passengers', noOfPassengers);
    const message = await UserTripHelpers.getDepartmentListMessage(payload);
    respond(message);
  }

  static async saveDepartment(payload) {
    const { value, text } = payload.actions[0];
    const user = await UserService.getUserBySlackId(payload.user.id);
    await Cache.saveObject(getTripKey(payload.user.id), {
      homeBaseName: user.homebase.name,
      departmentId: value,
      department: text.text
    });
    return Interactions.sendPickupModal(user.homebase.name, payload);
  }

  static async sendDestinations(payload) {
    const state = { origin: payload.response_url };
    const isEdit = payload.actions[0].action_id === userTripActions.sendDestEdit;
    const {
      homeBaseName, destination, othersDestination
    } = await Cache.fetch(getTripKey(payload.user.id));
    const fields = await NewSlackHelpers.getDestinationFields(
      homeBaseName, destination, othersDestination, isEdit
    );
    await Interactions.sendDetailsForm(payload, state, {
      title: 'Destination Details',
      submitLabel: 'Submit',
      callbackId: userTripActions.destDialog,
      fields
    });
  }

  static async saveDestination(payload) {
    try {
      await UserTripHelpers.handleDestinationDetails(
        payload.user,
        payload.submission
      );
      await Interactions.sendPostDestinationMessage(payload);
    } catch (err) {
      return err;
    }
  }

  static async confirmLocation(payload) {
    const location = payload.actions[0].selected_option.text.text;
    const type = payload.actions[0].action_id === userTripActions.selectPickupLocation
      ? 'pickup'
      : 'destination';
    const message = await UserTripHelpers.handleLocationVerfication(
      payload.user,
      location,
      type
    );
    const response = payload.response_url;
    await UpdateSlackMessageHelper.newUpdateMessage(response, message);
  }

  static async confirmTripRequest(payload, respond) {
    try {
      const { user: { id: userId }, team: { id: teamId } } = payload;
      const tripDetails = await Cache.fetch(getTripKey(userId));
      const trip = await ScheduleTripHelpers.createTripRequest(tripDetails, {
        userId,
        teamId
      });
      await Cache.delete(getTripKey(userId));
      const riderSlackId = `${
        tripDetails.forMe ? tripDetails.id : tripDetails.rider
      }`;
      InteractivePromptSlackHelper.sendCompletionResponse(
        respond,
        trip.id,
        riderSlackId
      );
    } catch (error) {
      bugsnagHelper.log(error);
      respond(
        new BlockMessage([
          new Block().addText('Unsuccessful request. Kindly Try again')
        ])
      );
    }
  }

  static async paymentRequest(payload) {
    if (payload.submission) {
      const result = await UserTripHelpers.savePayment(payload);
      if (result && result.errors) return result;
    }
    const message = new BlockMessage([
      new Block().addText('Thank you for using Tembea')
    ]);
    await UpdateSlackMessageHelper.updateMessage(payload.state, message);
  }

  static async back(payload, respond) {
    const {
      user: { id: slackId }, actions: [{ value: action }]
    } = payload;
    switch (action) {
      case 'back_to_travel_launch':
        respond(await TravelHelpers.getStartMessage(payload.user.id));
        break;
      case 'back_to_launch':
        respond(await TripHelpers.getWelcomeMessage(slackId));
        break;
      case 'back_to_itinerary_trips':
        return ItineraryController.start(payload, respond);
      case userTripActions.forMe:
        return UserTripBookingController.startTripBooking(payload, respond);
      case userTripActions.forSomeone:
        return UserTripBookingController.handleReasonSubmit(payload, respond);
      case userTripActions.addExtraPassengers:
        respond(UserTripHelpers.getAddPassengersMessage());
        break;
      case userTripActions.getDepartment:
        respond(await UserTripHelpers.getDepartmentListMessage(payload));
        break;
      default:
        respond(new SlackInteractiveMessage('Thank you for using Tembea'));
        break;
    }
  }

  static async updateState(state, data = { text: 'Noted' }) {
    await UpdateSlackMessageHelper.updateMessage(state, data);
  }

  static cancel(payload, respond) {
    const message = new BlockMessage([
      new Block().addText('Thank you for using Tembea')
    ]);
    respond(message);
  }

  static async savePickupDetails(payload, submission, respond, context, isEdit = false) {
    try {
      const userInfo = await NewSlackHelpers.getUserInfo(payload.user.id, context.botToken);
      const pickUpSchema = getTripPickupSchema(userInfo.tz);
      const pickupDetails = NewSlackHelpers.modalValidator(submission, pickUpSchema);
      respond.clear();
      await UserTripHelpers.handlePickUpDetails(payload.user, pickupDetails);
      await Interactions.sendPostPickUpMessage(payload, pickupDetails, isEdit);
    } catch (err) {
      const errors = err.errors || { date: 'An unexpected error occured' };
      return respond.error(errors);
    }
  }

  static async fetchDepartments(userId, teamId) {
    const slackHomebase = await homebaseService.getHomeBaseBySlackId(
      userId
    );
    const { name: homebaseName } = slackHomebase;
    const departmentsList = await departmentService.getDepartmentsForSlack(
      teamId, slackHomebase.id
    );
    const allDepartments = departmentsList.map(
      ({ label, value }) => ({ text: label, value })
    );
    return [allDepartments, homebaseName];
  }
}
