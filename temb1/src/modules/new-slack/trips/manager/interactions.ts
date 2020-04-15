import { SlackDialogTextarea, SlackDialog } from '../../../slack/SlackModels/SlackDialogModels';
import DialogPrompts from '../../../slack/SlackPrompts/DialogPrompts';
import managerTripActions from './constants';
import BugsnagHelper from '../../../../helpers/bugsnagHelper';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import { TripStatus } from '../../../../database/models/trip-request';
import ManagerTripHelpers from '../manager/trip.helpers';
import { ITripRequest } from '../../../../database/models/interfaces/trip-request.interface';
import SlackNotifications from '../../../slack/SlackPrompts/Notifications';
import TripHelpers from './trip.helpers';

export interface ManagerTripReasonOptions {
  origin: string;
  tripId: string;
  isApproval: number;
}

export default class Interactions {
  static async sendReasonForm(payload: any, options: ManagerTripReasonOptions,
    callback = managerTripActions.reasonSubmission) {
    const action = options.isApproval ? 'Approval' : 'Decline';
    const dialog = new SlackDialog(callback,
      `Reason for ${action}`, 'Submit', '', JSON.stringify(options));
    const textarea = new SlackDialogTextarea('Reason', 'reason',
      `Enter reason for ${action.toLowerCase()}`);

    dialog.addElements([textarea]);
    await DialogPrompts.sendDialog(dialog, payload);
  }
          /**
   * @description Replaces the trip notification on the ops channel with an approval or decline
   * @param  {boolean} decline
   * @param  {Object} tripRequest
   * @param  {string} channel
   * @param {string} userId
   */
  static async sendOpsDeclineOrApprovalCompletion(
    decline: boolean, tripRequest: any, channel: string, userId: string,
    responseUrl: string) {
    try {
      const status = { ...tripRequest, lastActionById: userId };
      status.currentState = decline ?
      TripStatus.declinedByOps : this.getPendingOrConfirmedStatus(tripRequest);
      const message = await ManagerTripHelpers.getApprovalOrDeclineMessage(tripRequest, status,
        channel, userId);
      await UpdateSlackMessageHelper.sendMessage(responseUrl, message);
    } catch (error) {
      BugsnagHelper.log(error);
    }
  }
  static getPendingOrConfirmedStatus(trip: any) {
    if (trip.tripStatus === TripStatus.pendingConfirmation) {
      return TripStatus.pendingConfirmation;
    }
    return TripStatus.confirmed;
  }
  static async sendRequesterApprovedNotification(data:ITripRequest, botToken: string) {
    try {
      const { requester } = data;
      const channel = await SlackNotifications.getDMChannelId(requester.slackId, botToken);
      const getMessage = await TripHelpers.getApprovedMessageOfRequester(data, channel);
      await SlackNotifications.sendNotification(getMessage, botToken);
    } catch (error) {
      BugsnagHelper.log(error);
    }
  }
}
