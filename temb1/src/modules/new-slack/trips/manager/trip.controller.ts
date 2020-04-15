import Interactions from './interactions';
import managerTripActions from './constants';
import TripHelpers from './trip.helpers';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import { TripStatus } from '../../../../database/models/trip-request';
import NewSlackHelpers from '../../helpers/slack-helpers';
import { BlockMessage, Block } from '../../models/slack-block-models';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';

export default class TripController {
  static async approve(payload: any) {
    const { channel: { id: channelId }, actions: [{ value, action_id }] } = payload;
    const isApproval = action_id === managerTripActions.approve ? 1 : 0;
    const tripInfo = await NewSlackHelpers.getTripState(value);
    if (tripInfo.currentState !== TripStatus.pending) {
      const message = await TripHelpers.getManagerApprovedOrDeclineMessage(value,
        tripInfo, channelId, payload.user.id);
      return UpdateSlackMessageHelper.newUpdateMessage(payload.response_url, message);
    }
    const response_url = payload.response_url;
    await Interactions.sendReasonForm(payload,
       { isApproval, origin: response_url, tripId: value });
  }

  static async completeApproveOrDecline(payload: any) {
    try {
      const { isApproval, tripId: requestId, origin } = JSON.parse(payload.state);
      const tripId = Number(requestId);
      const { submission: { reason }, channel: { id: channelId } } = payload;
      const { botToken } = await teamDetailsService.getTeamDetails(payload.team.id);
      const tripInfo = await NewSlackHelpers.getTripState(tripId);
      let message: BlockMessage<Block>;
      if (tripInfo.currentState !== TripStatus.pending) {
        message = await TripHelpers.getManagerApprovedOrDeclineMessage(tripId, tripInfo,
          channelId, payload.user.id);
        return UpdateSlackMessageHelper.newUpdateMessage(origin, message);
      }

      await TripHelpers.completeManagerResponse({ tripId, botToken, isApproval, reason,
        managerSlackId: payload.user.id, teamId: payload.team.id },
      );
      const updated = { ...tripInfo, lastActionById: payload.user.id };
      updated.currentState = isApproval ? TripStatus.approved : TripStatus.declinedByManager;
      message = await TripHelpers.getManagerApprovedOrDeclineMessage(tripId, updated,
        channelId, payload.user.id);
      await UpdateSlackMessageHelper.newUpdateMessage(origin, message);
      TripHelpers.notifyManagerIfOpsApproved(tripId, channelId, botToken);
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }
}
