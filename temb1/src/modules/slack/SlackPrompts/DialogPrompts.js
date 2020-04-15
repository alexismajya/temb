/* eslint-disable class-methods-use-this */
import {
  SlackDialogModel,
  SlackDialog,
  SlackDialogText,
  SlackDialogTextarea,
  SlackDialogSelectElementWithOptions,
  SlackDialogElementWithDataSource,
} from '../SlackModels/SlackDialogModels';
import createDialogForm from '../../../helpers/slack/createDialogForm';
import sendDialogTryCatch from '../../../helpers/sendDialogTryCatch';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import { SlackInteractiveMessage } from '../SlackModels/SlackMessageModels';
import { cabService } from '../../cabs/cab.service';
import { driverService } from '../../drivers/driver.service';
import CabsHelper from '../helpers/slackHelpers/CabsHelper';
import { providerService } from '../../providers/provider.service';
import tripService from '../../trips/trip.service';
import ProvidersHelper from '../helpers/slackHelpers/ProvidersHelper';
import ProviderHelper from '../../../helpers/providerHelper';
import UserService from '../../users/user.service';
import { homebaseService } from '../../homebases/homebase.service';

export const getPayloadKey = (userId) => `PAYLOAD_DETAILS${userId}`;

class DialogPrompts {
  static async sendTripDetailsForm(payload, formElementsFunction, callbackId, dialogTitle) {
    const { team: { id: teamId } } = payload;
    const dialogForm = await createDialogForm(payload, formElementsFunction, callbackId, dialogTitle);
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    await sendDialogTryCatch(dialogForm, slackBotOauthToken);
  }

  static async sendTripReasonForm(payload) {
    const dialog = new SlackDialog('schedule_trip_reason',
      'Reason for booking trip', 'Submit', '', JSON.stringify(payload));
    const textarea = new SlackDialogTextarea('Reason', 'reason',
      'Enter reason for booking the trip');

    dialog.addElements([textarea]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendReasonDialog(
    payload, callbackId, state, dialogName, submitButtonText, submissionName, type = 'trip'
  ) {
    const tripOrRoute = type === 'trip' ? 'trip' : 'route';
    const dialog = new SlackDialog(callbackId || payload.callbackId,
      dialogName, submitButtonText, false, state);

    const commentElement = new SlackDialogTextarea('Reason',
      submissionName,
      `Why do you want to ${submitButtonText} this ${tripOrRoute}?`);
    dialog.addElements([commentElement]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  async sendFeedbackDialog(payload, callback_id = 'get_feedback') {
    const { value } = payload.actions[0];
    const state = {
      user: value,
      actionTs: payload.message.ts
    };
    const dialog = new SlackDialog(callback_id,
      'Weekly feedback', 'Submit', false, JSON.stringify(state));
    dialog.addElements([
      new SlackDialogTextarea('Feedback : ', 'feedback', 'Type your feedback here')
    ]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendOperationsDeclineDialog(payload, callback_id = 'operations_reason_dialog_trips') {
    const actionTs = payload.message_ts;
    const { value } = payload.actions[0];
    const state = {
      trip: value,
      actionTs
    };
    const dialog = new SlackDialog(callback_id,
      'Reason for declining', 'Submit', false, JSON.stringify(state));
    dialog.addElements([
      new SlackDialogTextarea('Justification', 'opsDeclineComment')
    ]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendSelectCabDialog(payload) {
    const {
      actions: [{ value: tripId }], message_ts: timeStamp,
      channel: { id: channel }, user: { id: userId },
    } = payload;
    const { callback_id: callback } = payload;
    const { id } = await UserService.getUserBySlackId(userId);
    const provider = await providerService.findProviderByUserId(id);
    const where = { providerId: provider.id };
    const { data: cabs } = await cabService.getCabs(undefined, where);
    const cabData = CabsHelper.toCabLabelValuePairs(cabs);
    const drivers = await driverService.findAll({ where });
    const driverData = CabsHelper.toCabDriverValuePairs(drivers, true);
    const state = { tripId, timeStamp, channel };
    const callbackId = callback === 'provider_actions_route'
      ? 'providers_approval_route' : 'providers_approval_trip';
    const dialog = new SlackDialog(callbackId,
      'Complete The Request', 'Submit', false, JSON.stringify(state));
    dialog.addElements([
      new SlackDialogSelectElementWithOptions('Select A Driver',
        'driver', [...driverData]),
      new SlackDialogSelectElementWithOptions('Select A Vehicle',
        'cab', [...cabData])
    ]);
    return DialogPrompts.sendDialog(dialog, payload);
  }

  /**
   * Displays a select input field of list of providers
   *
   * @static
   * @param {Object} payload - Response object
   * @returns {void}
   * @memberof DialogPrompts
   */
  static async sendSelectProviderDialog(payload) {
    const {
      actions: [{ value: tripId }],
      message_ts: timeStamp,
      channel: { id: channel },
      user: { id }
    } = payload;
    const currentTrip = await tripService.getById(tripId);
    const { providerId, operationsComment } = currentTrip;
    const homebase = await homebaseService.getHomeBaseBySlackId(id);
    const providers = await providerService.getViableProviders(homebase.id);
    const providerData = ProviderHelper.generateProvidersLabel(providers);

    const state = {
      tripId, timeStamp, channel, isAssignProvider: true, responseUrl: payload.response_url,
    };
    const dialog = new SlackDialog('confirm_ops_approval',
      'Confirm Trip Request', 'Submit', false, JSON.stringify(state));
    dialog.addElements([
      new SlackDialogSelectElementWithOptions('Select A Provider', 'provider', [...providerData],
        providerId),
      new SlackDialogTextarea(
        'Justification', 'confirmationComment', 'Reason why', 'Enter reason for approving trip',
        operationsComment,
      )
    ]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendOperationsApprovalDialog(payload, respond) {
    const { value } = payload.actions[0];
    const { confirmationComment } = JSON.parse(value);
    let nextCallback; let
      title;
    const callbackId = 'operations_reason_dialog';
    if (payload.callback_id === 'operations_approval_route') {
      nextCallback = `${callbackId}_route`;
      title = 'Confirm Route Request';
    } else {
      nextCallback = `${callbackId}_trips`;
      title = 'Confirm Trip Request';
    }
    let dialog = new SlackDialog(nextCallback,
      title, 'Submit', false, value);
    dialog = DialogPrompts.addCabElementsToDialog(dialog, confirmationComment);
    respond(
      new SlackInteractiveMessage('Noted ...')
    );
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static addCabElementsToDialog(dialog, confirmationComment) {
    dialog.addElements([
      new SlackDialogText('Driver\'s name', 'driverName', 'Enter driver\'s name'),
      new SlackDialogText('Driver\'s contact', 'driverPhoneNo', 'Enter driver\'s contact'),
      new SlackDialogText(
        'Cab Registration number',
        'regNumber',
        'Enter the Cab\'s registration number'
      ),
      new SlackDialogText('Cab Model', 'model', 'Enter the Cab\'s model name'),
      new SlackDialogText('Cab Capacity', 'capacity', 'Enter the Cab\'s capacity'),
      new SlackDialogTextarea(
        'Justification',
        'confirmationComment',
        'Reason why',
        'Enter reason for approval',
        confirmationComment
      ),
    ]);
    return dialog;
  }

  static async sendOperationsNewRouteApprovalDialog(payload, state) {
    const dialog = new SlackDialog('operations_route_approvedRequest',
      'Approve Route Request', 'Submit', false, JSON.stringify(state));
    dialog.addElements([
      new SlackDialogText('Route\'s name', 'routeName', 'Enter route\'s name'),
      new SlackDialogText('Route\'s take-off time', 'takeOffTime', 'Enter take-off time',
        false, 'The time should be in the format (HH:mm), eg. 01:30')
    ]);
    const homebase = await homebaseService.getHomeBaseBySlackId(payload.user.id);
    const providers = await providerService.getViableProviders(homebase.id);
    const providersData = ProvidersHelper.toProviderLabelPairValues(providers);
    dialog.addElements([
      new SlackDialogSelectElementWithOptions('Select A Provider',
        'providerId', providersData),
      new SlackDialogTextarea(
        'Justification',
        'confirmationComment',
        'Reason why',
        'Enter reason for approval',
      ),
    ]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendBusStopForm(payload, busStageList) {
    const { value } = payload.actions[0];
    const state = {
      tripId: value,
      timeStamp: payload.message_ts,
      channel: payload.channel.id,
      response_url: payload.response_url
    };

    const dialog = new SlackDialog('new_route_handleBusStopSelected',
      'Drop off', 'Submit', false, JSON.stringify(state));

    const select = new SlackDialogSelectElementWithOptions(
      'Landmarks', 'selectBusStop', busStageList
    );
    select.optional = true;
    if (busStageList.length > 0) { dialog.addElements([select]); }

    dialog.addElements([
      new SlackDialogText('Landmark not listed?',
        'otherBusStop', 'Google Plus Code', true,
        'The location should be in the format (QVMX+8X Nairobi, Kenya)'),
    ]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendLocationForm(payload, location = 'home') {
    const dialog = new SlackDialog(`new_route_${location}`,
      'Create New Route', 'Submit', true);
    const locationText = location.charAt(0).toUpperCase() + location.slice(1);
    const hint = 'e.g Westlands, Nairobi';
    dialog.addElements([
      new SlackDialogText(`Enter ${locationText} Address: `,
        'location', `Type in your ${location} address`, false, hint)
    ]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendSkipPage(payload, value, callbackId) {
    const dialog = new SlackDialog(callbackId,
      'Page to skip to', 'Submit', false, value);
    const textarea = new SlackDialogText('Page Number', 'pageNumber',
      'Page to skip to');

    dialog.addElements([textarea]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendSearchPage(payload, value, callbackId) {
    const { message_ts: messageTs, response_url: origin } = payload;
    const state = JSON.stringify({ action: value, origin, messageTs });
    const dialog = new SlackDialog(callbackId,
      'Search', 'Submit', false, state);

    const hint = 'e.g Emmerich Road';
    const textarea = new SlackDialogText('Search', 'search',
      'Enter the route name to search', false, hint);

    dialog.addElements([textarea]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendNewRouteForm(payload) {
    const state = { response_url: payload.response_url };
    const selectManager = new SlackDialogElementWithDataSource('Select Manager', 'manager');
    const workingHours = new SlackDialogText(
      'Working Hours', 'workingHours',
      'Enter Working Hours', false, 'Hint: (From - To) hh:mm - hh:mm. e.g 20:30 - 02:30'
    );

    const dialog = new SlackDialog(
      'new_route_handlePreviewPartnerInfo', 'Engagement Information', 'Submit', true,
      JSON.stringify(state)
    );
    dialog.addElements([selectManager, workingHours]);
    const dialogForm = new SlackDialogModel(payload.trigger_id, dialog);
    const { team: { id: teamId } } = payload;
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    await sendDialogTryCatch(dialogForm, slackBotOauthToken);
  }

  static async sendLocationCoordinatesForm(payload) {
    const dialog = new SlackDialog(
      'new_route_suggestions', 'Home address plus code', 'Submit', true
    );
    const hint = 'e.g QVMX+8X Nairobi, Kenya';
    dialog.addElements([
      new SlackDialogText(
        'Address plus code:', 'coordinates',
        'Type in your home address google plus code', false, hint
      )
    ]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendLocationDialogToUser(state) {
    const dialog = new SlackDialog(
      'schedule_trip_resubmitLocation', 'Location Details', 'Submit', true,
      state
    );
    const { value } = state.actions[0];
    const hint = 'Andela Nairobi, Kenya';
    const pickupOrDestination = value === 'no_Pick up' ? 'Pickup' : 'Destination';
    dialog.addElements([
      new SlackDialogText(
        `${pickupOrDestination} Location: `, `${pickupOrDestination}_location`,
        `Enter your ${pickupOrDestination} details`, false, hint
      )
    ]);
    await DialogPrompts.sendDialog(dialog, state);
  }

  static async sendEngagementInfoDialogToManager(payload, callback, state, defaultValues = {}) {
    const dialog = new SlackDialog(callback,
      'Fellow\'s Engagement', 'Submit', true, state);
    const sdName = 'startDate';
    const edName = 'endDate';
    const hint = 'hint: dd/mm/yyyy. example: 31/01/2019';
    const sdPlaceholder = 'Start Date';
    const edPlaceholder = 'End Date';
    const startDate = new SlackDialogText(
      `Engagement ${sdPlaceholder}`, sdName, sdPlaceholder, false, hint, defaultValues[sdName]
    );
    const endDate = new SlackDialogText(
      `Engagement ${edPlaceholder}`, edName, edPlaceholder, false, hint, defaultValues[edName]
    );
    dialog.addElements([startDate, endDate]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendDialog(dialog, payload) {
    const dialogForm = new SlackDialogModel(payload.trigger_id, dialog);
    const { team: { id: teamId } } = payload;
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    await sendDialogTryCatch(dialogForm, slackBotOauthToken);
  }

  static async sendTripNotesDialogForm(payload, formElementsFunction, callbackId, dialogTitle, note) {
    const { team: { id: teamId } } = payload;
    const dialogForm = createDialogForm(payload, formElementsFunction, callbackId, dialogTitle, note);
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    await sendDialogTryCatch(dialogForm, slackBotOauthToken);
  }

  static async sendOperationsApproveDelayedTripDialog(payload, state) {
    await DialogPrompts.sendReasonDialog(payload,
      'approve_trip', state, 'Approve Trip Request?', 'Approve', 'approveReason');
  }
}

export const dialogPrompts = new DialogPrompts();
export default DialogPrompts;
