import {
  SlackDialog, SlackDialogTextarea, SlackDialogText
} from '../../../slack/SlackModels/SlackDialogModels';
import userTripActions from './actions';
import UserTripHelpers from './user-trip-helpers';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import DialogPrompts from '../../../slack/SlackPrompts/DialogPrompts';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import NewSlackHelpers from '../../helpers/slack-helpers';
import EditTripHelpers from '../../helpers/slack-edit-trip-helpers';
import { SlackViews } from '../../extensions/SlackViews';

export default class Interactions {
  static async sendTripReasonForm(payload, state) {
    const dialog = new SlackDialog(userTripActions.reasonDialog,
      'Reason for booking trip', 'Submit', '', JSON.stringify(state));
    const textarea = new SlackDialogTextarea('Reason', 'reason',
      'Enter reason for booking the trip');

    dialog.addElements([textarea]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendDetailsForm(payload, state, {
    title, submitLabel, callbackId, fields
  }) {
    const dialog = new SlackDialog(callbackId,
      title, submitLabel, '', JSON.stringify(state));
    dialog.addElements(fields);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendPostPickUpMessage(payload, submission, isEdit) {
    const data = JSON.parse(payload.view.private_metadata);
    const message = await UserTripHelpers.getPostPickupMessage(payload, submission, isEdit);
    await UpdateSlackMessageHelper.newUpdateMessage(data.origin, message);
  }

  static async sendPostDestinationMessage(payload, submission) {
    const message = await UserTripHelpers.getPostDestinationMessage(payload, submission);
    await Interactions.sendMessage(payload, message);
  }

  static async sendMessage(payload, message) {
    const { origin } = JSON.parse(payload.state || payload.view.private_metadata);
    await UpdateSlackMessageHelper.newUpdateMessage(origin, message);
  }

  static async sendAddPassengers(state) {
    const message = UserTripHelpers.getAddPassengersMessage();
    const { origin } = JSON.parse(state);
    await UpdateSlackMessageHelper.newUpdateMessage(origin, message);
  }

  static async sendPriceForm(payload, state) {
    const priceDialog = new SlackDialog(userTripActions.payment,
      'The price of the trip', 'Submit', '', JSON.stringify(state));
    priceDialog.addElements([new SlackDialogText('Price', 'price',
      'Enter total amount of the trip in Ksh.')]);
    await DialogPrompts.sendDialog(priceDialog, payload);
  }

  static async sendPickupModal(homebaseName, payload) {
    const state = { origin: payload.response_url };
    const modal = await NewSlackHelpers.getPickupModal(homebaseName, state);
    const token = await teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
    return SlackViews.open({
      botToken: token,
      modal,
      triggerId: payload.trigger_id,
    });
  }

  static async sendEditRequestModal(
    tripDetails, teamId, triggerId, responseUrl, allDepartments, homebaseName
  ) {
    const modal = await EditTripHelpers.getEditRequestModal(
      tripDetails, responseUrl, allDepartments, homebaseName
    );

    const token = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    return SlackViews.open({
      botToken: token,
      modal,
      triggerId,
    });
  }
}
