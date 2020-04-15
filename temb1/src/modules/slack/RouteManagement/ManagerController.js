import DialogPrompts from '../SlackPrompts/DialogPrompts';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import { SlackInteractiveMessage } from '../SlackModels/SlackMessageModels';
import RouteRequestService from '../../routes/route-request.service';
import InteractivePrompts from '../SlackPrompts/InteractivePrompts';
import { slackEventNames, SlackEvents } from '../events/slackEvents';
import ManagerNotifications from '../SlackPrompts/notifications/ManagerRouteRequest/index';
import { engagementService } from '../../engagements/engagement.service';
import AttachmentHelper from '../SlackPrompts/notifications/ManagerRouteRequest/helper';
import ManagerFormValidator from '../../../helpers/slack/UserInputValidator/managerFormValidator';
import { getAction } from '../helpers/slackHelpers/handler';
import cache from '../../shared/cache';
import RouteHelper from '../../../helpers/RouteHelper';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';

const handlers = {
  initialNotification: async (payload) => {
    const { channel: { id: channelId }, original_message: { ts: timestamp }, actions } = payload;
    const { team: { id: teamId } } = payload;
    const [{ value }] = actions;
    const { data: { routeRequestId } } = JSON.parse(value);
    const {
      slackBotOauthToken, routeRequest
    } = await RouteRequestService.getRouteRequestAndToken(routeRequestId, teamId);

    const attachments = AttachmentHelper.getManagerMessageAttachment(routeRequest);

    const { fellow } = routeRequest.engagement;
    await InteractivePrompts.messageUpdate(
      channelId,
      `Hey, <@${fellow.slackId}> just requested to create a new route. :smiley:`,
      timestamp,
      attachments,
      slackBotOauthToken
    );
  },
  decline: async (payload) => {
    const { actions, channel: { id: channelId }, original_message: { ts: timeStamp } } = payload;
    const [{ value: routeRequestId }] = actions;
    const routeRequest = await RouteRequestService.getRouteRequest(routeRequestId);
    if (!ManagerFormValidator.validateStatus(routeRequest, 'pending')) {
      await ManagerNotifications.handleStatusValidationError(payload, routeRequest);
      return;
    }
    const state = {
      decline: {
        timeStamp,
        channelId,
        routeRequestId
      }
    };
    DialogPrompts.sendReasonDialog(payload,
      'manager_route_declinedRequest',
      JSON.stringify(state), 'Decline', 'Decline', 'declineReason');
  },
  approve: async (payload) => {
    const { actions, channel: { id: channelId }, original_message: { ts: timeStamp } } = payload;
    const [{ value: routeRequestId }] = actions;
    const routeRequest = await RouteRequestService.getRouteRequest(routeRequestId);
    if (!ManagerFormValidator.validateStatus(routeRequest, 'pending')) {
      await ManagerNotifications.handleStatusValidationError(payload, routeRequest);
      return;
    }
    const state = {
      approve: {
        timeStamp,
        channelId,
        routeRequestId
      }
    };
    await DialogPrompts.sendReasonDialog(payload,
      'manager_route_approvedRequestPreview',
      JSON.stringify(state), 'Approve Route Request', 'Approve', 'approvalReason', 'route');
  },
  declinedRequest: async (payload) => {
    const { submission: { declineReason }, team: { id: teamId } } = payload;
    const errors = ManagerFormValidator.validateReasons(declineReason, 'declineReason');
    if (errors.length > 0) {
      return { errors };
    }
    const { decline: { timeStamp, channelId, routeRequestId } } = JSON.parse(payload.state);
    const botToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);

    const updatedRequest = await RouteHelper.updateRouteRequest(routeRequestId,
      { status: 'Declined', managerComment: declineReason });

    SlackEvents.raise(
      slackEventNames.MANAGER_DECLINED_ROUTE_REQUEST,
      {
        routeRequestId: updatedRequest.id,
        botToken
      }
    );
    await ManagerNotifications.completeManagerAction(
      updatedRequest, channelId, timeStamp, botToken
    );
  },
  approvedRequestPreview: async (payload) => {
    const { submission: { approvalReason }, team: { id: teamId } } = payload;
    const { approve } = JSON.parse(payload.state);

    const { timeStamp, channelId, routeRequestId } = approve;
    const {
      slackBotOauthToken, routeRequest
    } = await RouteRequestService.getRouteRequestAndToken(routeRequestId, teamId);
    const previewAttachment = await AttachmentHelper.managerPreviewAttachment(
      routeRequest, { approve, approvalReason }
    );
    await InteractivePrompts.messageUpdate(
      channelId,
      '',
      timeStamp,
      [previewAttachment],
      slackBotOauthToken
    );
  },
  approvedRequestSubmit: async (payload) => {
    const { actions, team: { id: teamId }, user: { id: slackId } } = payload;
    const [{ value: state }] = actions;
    const { approve: { timeStamp, channelId, routeRequestId } } = JSON.parse(state);
    const result = cache.fetch(`userDetails${slackId}`);
    const dateObject = { startDate: result[0], endDate: result[1] };
    const {
      slackBotOauthToken: botToken, routeRequest
    } = await RouteRequestService.getRouteRequestAndToken(routeRequestId, teamId);
    const { engagement } = routeRequest;
    await engagementService.updateEngagement(engagement.id, dateObject);

    const updatedRequest = await RouteHelper.updateRouteRequest(routeRequestId,
      { status: 'Confirmed' });

    SlackEvents.raise(
      slackEventNames.MANAGER_APPROVED_ROUTE_REQUEST,
      { routeRequestId, teamId, botToken }
    );
    await ManagerNotifications.completeManagerAction(
      updatedRequest, channelId, timeStamp, botToken
    );
  },
};

export default class ManagerController {
  static managerRouteController(action) {
    return handlers[action]
      || (() => {
        throw new Error(`Unknown action: manager_route_${action}`);
      });
  }

  static async handleManagerActions(payload, respond) {
    try {
      const action = getAction(payload, 'btnActions');
      return ManagerController.managerRouteController(action)(payload, respond);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Error:bangbang:: I was unable to do that.'));
    }
  }
}
