import { SlackInteractiveMessage } from '../../SlackModels/SlackMessageModels';
import CleanData from '../../../../helpers/cleanData';
import InteractivePrompts from '../../SlackPrompts/InteractivePrompts';
import DialogPrompts, { dialogPrompts } from '../../SlackPrompts/DialogPrompts';
import ViewTripHelper from './ViewTripHelper';
import CancelTripController from '../../TripManagement/CancelTripController';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import tripService from '../../../trips/trip.service';
import OpsTripActions from '../../TripManagement/OpsTripActions';
import UserTripBookingController from '../../../new-slack/trips/user/user-trip-booking-controller';
import OpsDialogPrompts from '../../SlackPrompts/OpsDialogPrompts';
import ItineraryController from '../../../new-slack/trips/user/itinerary.controller';
import RescheduleHelper from '../../../new-slack/trips/user/reschedule.helper';
import SlackNotifications from '../../SlackPrompts/Notifications';
import { providerErrorMessage } from '../../../../helpers/constants';
import managerTripActions from '../../../new-slack/trips/manager/constants';
import { feedbackService } from '../../../feedback/feedback.service';
import userService from '../../../users/user.service';
import feedbackHelper from './feedbackHelper';

class SlackInteractionsHelpers {
  static async welcomeMessage(payload, respond) {
    const { actions: [{ value: action }] } = payload;

    switch (action) {
      case 'book_new_trip':
        await UserTripBookingController.startTripBooking(payload, respond);
        break;
      case 'view_trips_itinerary':
        await ItineraryController.start(payload, respond);
        break;
      case 'change_location':
        await InteractivePrompts.changeLocation(payload, respond);
        break;
      default:
        respond(new SlackInteractiveMessage('Thank you for using Tembea'));
        break;
    }
  }

  static goodByeMessage() {
    return new SlackInteractiveMessage('Thank you for using Tembea. See you again.');
  }

  static isCancelMessage(data) {
    const payload = CleanData.trim(data);
    return (payload.type === 'interactive_message' && payload.actions[0].value === 'cancel');
  }

  static sendCommentDialog(data, respond) {
    const payload = CleanData.trim(data);
    const action = payload.actions[0].name;
    switch (action) {
      case ('confirmTrip'):
        DialogPrompts.sendOperationsApprovalDialog(payload, respond);
        break;
      case ('declineRequest'):
        DialogPrompts.sendOperationsDeclineDialog(payload);
        break;
      default:
        break;
    }
  }

  static async handleItineraryActions(data, respond) {
    const payload = CleanData.trim(data);
    const { name, value } = payload.actions[0];
    let message;
    switch (name) {
      case 'view':
        message = await ViewTripHelper.displayTripRequest(value, payload.user.id);
        break;
      case 'reschedule':
        message = await RescheduleHelper.sendTripRescheduleModal(payload, value);
        break;
      case 'cancel_trip':
        message = await CancelTripController.cancelTrip(value, payload);
        break;
      default:
        message = SlackInteractionsHelpers.goodByeMessage();
    }
    if (message) respond(message);
  }

  static async handleFeedbackAction(payload, respond) {
    return dialogPrompts.sendFeedbackDialog(payload, undefined, respond);
  }

  static async handleGetFeedbackAction(payload) {
    const {
      channel: { id: channelId },
      team: { id: teamId },
      user: { id: userId },
      submission,
    } = payload;
    const user = await userService.getUserBySlackId(userId);
    const result = await feedbackService.createFeedback({
      userId: user.id,
      feedback: submission.feedback
    });
    if (result) {
      feedbackHelper.sendFeedbackSuccessmessage(teamId, channelId,
        JSON.parse(payload.state).actionTs);
    }
  }

  static async handleOpsAction(payload) {
    let options;
    const {
      actions: [{ selected_options: selectedOptions, value: values }],
      channel: { id: channelId },
      team: { id: teamId },
      user: { id: userId },
    } = payload;

    const { original_message: ogMessage, message } = payload;
    const timeStamp = ogMessage ? ogMessage.ts : message.ts;
    const action = payload.actions[0].name || payload.actions[0].action_id;
    if (action === 'declineRequest') {
      return DialogPrompts.sendOperationsDeclineDialog(payload);
    }
    if (selectedOptions) {
      options = selectedOptions[0].value.split('_');
    } else {
      options = values.split('_');
    }
    if (action === managerTripActions.editApprovedTrip) {
      options = ['', payload.actions[0].value];
    }

    const [value, tripId] = options;
    await SlackInteractionsHelpers.handleOpsSelectAction(value, tripId, teamId, channelId, userId,
      timeStamp, payload);
  }

  static async startProviderActions(data, respond) {
    const payload = CleanData.trim(data);
    const action = payload.state || payload.actions[0].value;
    switch (action.split('_')[0]) {
      case 'accept':
        await DialogPrompts.sendSelectCabDialog(payload);
        break;
      default:
        respond(SlackInteractionsHelpers.goodByeMessage());
        break;
    }
  }

  static async handleOpsSelectAction(value, tripId, teamId, channelId, userId, timeStamp,
    payload) {
    const isOpsAssignCab = value === 'assignCab';
    const trip = await tripService.getById(tripId, true);
    const tripIsCancelled = trip.tripStatus === 'Cancelled';
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    if (tripIsCancelled) {
      return OpsTripActions.sendUserCancellation(
        channelId, slackBotOauthToken, trip, userId, timeStamp
      );
    }
    if (isOpsAssignCab) {
      return OpsDialogPrompts.selectDriverAndCab(payload, tripId);
    }
    const correctedData = { ...payload, actions: [{ ...payload.actions[0], value: trip.id }] };
    return SlackInteractionsHelpers.handleSelectProviderAction(correctedData);
  }

  /**
   * Action handler for input selectors on provider dialog
   *
   * @static
   * @param {Object} data - The request payload
   * @memberof SlackInteractions
   */
  static async handleSelectProviderAction(data) {
    try {
      if (SlackInteractionsHelpers.isConfirmTripOrAssignCabAndProvider(data)) {
        return DialogPrompts.sendSelectProviderDialog(data);
      }
      if (SlackInteractionsHelpers.isDecline(data)) {
        await DialogPrompts.sendOperationsDeclineDialog(data);
      }
    } catch (error) {
      const {
        channel: { id: channel },
        team: { id: teamId }
      } = data;
      const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
      await SlackNotifications.sendNotification(
        SlackNotifications.createDirectMessage(channel, providerErrorMessage), slackBotOauthToken
      );
    }
  }

  static isConfirmTripOrAssignCabAndProvider(data) {
    return data.actions && (data.actions[0].name === 'confirmTrip'
      || data.actions[0].name === 'assign-cab-or-provider'
      || data.actions[0].action_id === managerTripActions.editApprovedTrip);
  }

  static isDecline(data) {
    return data.actions && data.actions[0].name === 'declineRequest';
  }
}

export default SlackInteractionsHelpers;
