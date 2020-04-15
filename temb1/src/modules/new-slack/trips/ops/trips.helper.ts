import { TripRequest } from '../../../../database';
import ManagerTripHelpers from '../manager/trip.helpers';
import managerActions, { managerTripBlocks } from '../manager/constants';
import SlackNotifications from '../../../slack/SlackPrompts/Notifications';
import { SectionBlock, MarkdownText, BlockMessage } from '../../models/slack-block-models';

export default class TripHelpers {
  static async getDelayedTripApprovalMessage(trip: TripRequest) {
    const { requester, department, homebase } = trip;
    const channel = homebase.channel;
    const message = await ManagerTripHelpers.getApprovalPromptMessage(trip, channel, {
      headerText: `Hello Ops, <@${requester.slackId}> has requested the trip attached below, but `
        + `<@${department.head.slackId}> has delayed to respond to the request `
        + ':slightly_frowning_face:.\n Please respond to it:pray:',
      blockId: managerTripBlocks.confirmTripRequest,
      approveActionId: managerActions.approve,
      declineActionId: managerActions.decline,
    });
    return message;
  }

  static getOpsApprovalMessageForManager(data: TripRequest, channelId: string) {
    const { origin, destination } = data;
    const text = `The request from *${origin.address}* to *${destination.address}* `
      + `has been approved by <@${data.approver.slackId}> `
      + 'from Ops because you delayed to approve it.\nThe request is now ready for confirmation.';

    const head = new SectionBlock().addText(new MarkdownText('Ops approved'));
    const fields = SlackNotifications.notificationFields(data);
    const main = new SectionBlock().addText(new MarkdownText(text))
      .addFields(fields);

    return new BlockMessage([head, main], channelId);
  }
}
