import JoinRouteHelpers from './joinRoute.helpers';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import { joinRouteRequestService } from '../../../joinRouteRequests/joinRouteRequest.service';
import Cache from '../../../shared/cache';
import { homebaseService } from '../../../homebases/homebase.service';
import { BlockMessage, MarkdownText, Block } from '../../models/slack-block-models';
import SlackNotifications from '../../../slack/SlackPrompts/Notifications';
import SlackJoinRouteNotifications from
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';

class JoinRouteNotifications {

  static async sendManagerJoinRequest(payload: any, joinRequestId: number) {
    const { user: { id: slackId }, team: { id: teamId } } = payload;
    const joinRoute = await joinRouteRequestService.getJoinRouteRequest(joinRequestId);
    const blockMessage = await JoinRouteHelpers.joinRouteBlock(joinRoute);
    const { botToken } = await teamDetailsService.getTeamDetails(teamId);
    const { channel: opsChannelId } = await homebaseService.getHomeBaseBySlackId(slackId);
    const text = `Hey :simple_smile: <@${slackId}> has joined a route`;
    const headerText = new MarkdownText(`*${text}*`);
    const heading = new Block().addText(headerText);
    const message = new BlockMessage([heading, ...blockMessage], opsChannelId, text);
    await SlackNotifications.sendNotification(message, botToken);
  }

  static async sendFilledCapacityJoinRequest(data: any) {
    const { routeId, teamId, requesterSlackId } = data;
    const { ...joinRouteRequestSubmission
    } = await Cache.fetch(`joinRouteRequestSubmission_${requesterSlackId}`);
    const result = await Cache.fetch(`userDetails${requesterSlackId}`);
    const dateObject = {
      startDate: result[0],
      endDate: result[1],
      partnerName: result[2],
    };
    const tempJoinRoute = await SlackJoinRouteNotifications.generateJoinRouteFromSubmission(
      joinRouteRequestSubmission, routeId, requesterSlackId, teamId, dateObject,
    );
    const blockMessage = await JoinRouteHelpers.joinRouteBlock(tempJoinRoute);
    const text = `Hey, <@${requesterSlackId}> tried to join a route that's already filled up.`;
    const { botToken } = await teamDetailsService.getTeamDetails(teamId);
    const { channel } = await homebaseService.getHomeBaseBySlackId(requesterSlackId);
    const headerText = new MarkdownText(`*${text}*`);
    const heading = new Block().addText(headerText);
    const message = new BlockMessage([heading, ...blockMessage], channel, text);
    await SlackNotifications.sendNotification(message, botToken);
  }
}

export default JoinRouteNotifications;
