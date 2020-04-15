import tripService from '../../../trips/trip.service';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import appEvents from '../../../events/app-event.service';
import { tripEvents } from '../../../events/trip-events.contants';
import SlackNotifications from '../../../slack/SlackPrompts/Notifications';
import TripRequest, { ITripState, TripStatus }  from '../../../../database/models/trip-request';
import { SectionBlock, MarkdownText,
   ActionBlock, ButtonElement, SlackText,
   BlockMessage, Block, BlockTypes } from '../../models/slack-block-models';
import managerTripActions, { managerTripBlocks } from './constants';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import NewSlackHelpers, { sectionDivider } from '../../helpers/slack-helpers';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import { ITripRequest } from '../../../../database/models/interfaces/trip-request.interface';

export interface IManagerCompleteOptions {
  tripId: number;
  isApproval: boolean;
  reason: string;
  managerSlackId: string;
  botToken: string;
  teamId: string;
}

export default class TripHelpers {
  static async notifyManagerIfOpsApproved(tripId: number, channelId: string, botToken: string) {
    try {
      const trip = await tripService.getById(tripId, true) as TripRequest;
      if (trip.homebase.channel === channelId) {
        await SlackNotifications.OpsApprovedNotification(trip, botToken);
      }
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }
  static async getManagerApprovedOrDeclineMessage(tripId: number, status: ITripState,
    channelId: string, actorId: string) {
    const tripinfo = await tripService.getById(tripId, true) as TripRequest;
    const message = TripHelpers.getApprovalOrDeclineMessage(tripinfo, status, channelId, actorId);
    return message;
  }

  static async completeManagerResponse(options: IManagerCompleteOptions) {
    const { managerSlackId, isApproval, tripId, reason, botToken, teamId } = options;
    const manager = await SlackHelpers.findOrCreateUserBySlackId(managerSlackId, teamId);
    if (isApproval) {
      return TripHelpers.approveRequest(tripId, manager.id, reason, botToken);
    }
    return TripHelpers.declineRequest(tripId, manager.id, reason, botToken);
  }

  static async approveRequest(tripId: number, managerId: number, reason: string, botToken: string) {
    const trip = await tripService.update(tripId, {
      approvedById: managerId,
      managerComment: reason,
      tripStatus: 'Approved',
      approvalDate: new Date(Date.now()).toISOString(),
    });
    appEvents.broadcast({
      name: tripEvents.managerApprovedTrip,
      data: {
        botToken,
        data: trip,
      },
    });
  }

  static async declineRequest(tripId: number, managerId: number, reason: string, botToken: string) {
    const trip = await tripService.update(tripId, {
      declinedById: managerId,
      managerComment: reason,
      tripStatus: 'DeclinedByManager',
    });

    appEvents.broadcast({
      name: tripEvents.managerDeclinedTrip,
      data: {
        botToken,
        data: trip,
      },
    });
  }

  static async getApprovalPromptMessage(trip: TripRequest, imResponse: string,
    options: IManagerNotificationOptions) {
    const tripId = trip.id.toString();
    const mainBlock = new SectionBlock().addText(new MarkdownText('*Trip Request*'));
    const fields = SlackNotifications.notificationFields(trip);
    mainBlock.addFields(fields);
    const newTripBlock = new ActionBlock(options.blockId);
    newTripBlock.addElements([
      new ButtonElement(new SlackText('Approve'), tripId, options.approveActionId,
        SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('Decline'), tripId, options.declineActionId,
        SlackActionButtonStyles.danger),
    ]);
    const header = new SectionBlock().addText(new MarkdownText(options.headerText));
    return new BlockMessage([header, sectionDivider, mainBlock,
      sectionDivider, newTripBlock], imResponse, options.headerText);
  }

  static async sendManagerTripRequestNotification(trip: TripRequest, botToken: string,
    type = 'newTrip') {
    try {
      const { department: { head } } = trip;
      const imResponse = await SlackNotifications.getDMChannelId(head.slackId, botToken);
      const text = type === 'newTrip' ? 'booked a' : 'rescheduled this';
      const { requester: { slackId: requesterId }, rider: { slackId: riderId }, id } = trip;
      const headerText = await TripHelpers.getMessage(riderId, requesterId, text);
      const message = await TripHelpers.getApprovalPromptMessage(
        trip, imResponse, {
          headerText,
          blockId: managerTripBlocks.confirmTripRequest,
          approveActionId: managerTripActions.approve,
          declineActionId: managerTripActions.decline,
        });
      return SlackNotifications.sendNotification(message, botToken);
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static async getMessage(riderId: string, requesterId: string, text: string) {
    const smiley = text === 'cancelled this' ? '' : ' :smiley:';
    if (requesterId === riderId) {
      return `Hey, <@${requesterId}> has just ${text} trip.${smiley}`;
    }
    return `Hey, <@${requesterId}> has just ${text} trip for <@${
      riderId}>.${smiley}`;
  }

  static getActorString(trip: TripRequest, status: ITripState, channelId: string, actorId: string) {
    let actor = 'You have';
    if (channelId === trip.homebase.channel || status.lastActionById !== actorId) {
      actor = `<@${status.lastActionById}> has`;
    }
    return actor;
  }

  static async getApprovalOrDeclineMessage(trip: TripRequest, status: ITripState,
    channelId: string, actorId: string) {
    const [header, main, actions , footer] = [
      new SectionBlock(), new SectionBlock(), new Block(BlockTypes.actions), new SectionBlock(),
    ];
    const mention = TripHelpers.getActorString(trip, status, channelId, actorId);
    switch (status.currentState) {
      case TripStatus.approved:
        main.addText(new MarkdownText('*Trip Approved*'));
        footer.addText(new MarkdownText(`:white_check_mark: ${mention} approved this trip`));
        header.addText(new MarkdownText('You have just approved the trip from '
          + `<@${trip.requester.slackId}>`));
        break;
      case TripStatus.declinedByManager:
        main.addText(new MarkdownText('*Trip Declined*'));
        footer.addText(new MarkdownText(`:x: ${mention} declined this trip`));
        header.addText(new MarkdownText(`${mention} have just declined the trip from `
          + `<@${trip.requester.slackId}>`));
        break;
      case TripStatus.declinedByOps:
        main.addText(new MarkdownText('*Trip Declined*'));
        footer.addText(new MarkdownText(`:x: ${mention} declined this trip`));
        header.addText(new MarkdownText(`${mention} just declined the trip from `
            + `<@${trip.requester.slackId}>`));
        break;
      case TripStatus.pendingConfirmation:
        main.addText(new MarkdownText('*Confirm Trip Details*'));
        actions.elements = [
          new ButtonElement(new SlackText('Edit'),
          trip.id.toString(), managerTripActions.editApprovedTrip,
        SlackActionButtonStyles.primary),
          new ButtonElement(new SlackText('Confirm'),
          trip.id.toString(), managerTripActions.confirmApprovedTrip,
        SlackActionButtonStyles.primary),
        ];
        footer.addText(new MarkdownText(':construction: Double check your entries then confirm'));
        header.addText(new MarkdownText('You are about to confirm the trip from '
            + `<@${trip.requester.slackId}>`));
        break;
      case TripStatus.confirmed:
        main.addText(new MarkdownText('*Trip Confirmed*'));
        footer.addText(new MarkdownText(`:white_check_mark: ${mention} confirmed this trip`));
        header.addText(new MarkdownText('You have just confirmed the trip from '
            + `<@${trip.requester.slackId}>`));
        break;
      default:
        main.addText(new MarkdownText('*Trip Request Status*'));
        header.addText(new MarkdownText(`The trip requested by <@${trip.requester.slackId}> `
          + `have been already *${status.currentState.toLowerCase()}* `
          + `by <@${status.lastActionById}>`));
        break;
    }
    const fields = SlackNotifications.notificationFields(trip);
    fields.push(new MarkdownText(`*Trip Status*:\n${trip.tripStatus}`));
    main.addFields(fields);
    const blocks = [header, sectionDivider, main];
    if (footer.text) {
      blocks.push(sectionDivider);
      blocks.push(footer);
    }
    if (actions.elements && actions.elements.length > 0) {
      blocks.push(sectionDivider);
      blocks.push(actions);
    }
    return new BlockMessage(blocks);
  }
  static async getApprovedMessageOfRequester(data:ITripRequest, channel: string) {
    const { approver } = data;
    const messageHeader = `<@${approver.slackId}> has confirmed this trip.`;
    const fields = await SlackNotifications.notificationFields(data);
    const mainBlock = new SectionBlock().addText(new MarkdownText('*Trip Approved*'))
        .addFields(fields);
    const header = new SectionBlock().addText(new MarkdownText(messageHeader));
    const response = new BlockMessage([header, sectionDivider, mainBlock],
        channel, messageHeader);
    return response;
  }
}

export interface IManagerNotificationOptions {
  blockId: string;
  approveActionId: string;
  declineActionId: string;
  headerText: string;
}
