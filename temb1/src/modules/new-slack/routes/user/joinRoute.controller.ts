import JoinRouteHelpers from './joinRoute.helpers';
import Cache from '../../../shared/cache';
import JoinRouteNotifications from
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
import { getFellowEngagementDetails } from '../../../slack/helpers/formHelper';
import UserService from '../../../users/user.service';
import NewSlackHelpers from '../../helpers/slack-helpers';
import { joinRouteSchema } from '../schema';
import { IModalResponse } from '../../helpers/modal.router';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';

const getRouteKey = (id: string) => `ROUTE_REQUEST_${id}`;

class JoinRouteController {
  static async joinARoute(payload: any, respond: Function) {
    const { response_url: state, user: { id: slackId },
        actions: [{ value: routeId }], team: { id: teamId } } = payload;
    const user = await UserService.getUserBySlackId(slackId);
    const engagement = await getFellowEngagementDetails(slackId, teamId);
    const restrictMsg = await JoinRouteHelpers.joinRouteHandleRestrictions(
          user, engagement);
    if (restrictMsg) {
      respond(restrictMsg);
    } else {
      await Cache.save(getRouteKey(slackId), 'routeJoined', routeId);
      await JoinRouteHelpers.joinRouteModal(payload, state);
    }
  }

  static async handleSelectManager(payload: any, submission: any, respond: IModalResponse) {
    try {
      const { user: { id: slackId }, team: { id: teamId } } = payload;
      NewSlackHelpers.modalValidator(submission, joinRouteSchema);
      await Cache.save(getRouteKey(slackId), 'submissionData', submission);
      respond.clear();
      const getRouteId = await Cache.fetch(getRouteKey(slackId));
      const result = await Cache.fetch(`userDetails${slackId}`);
      const engagementObject = {
        startDate: result[0],
        endDate: result[1],
        partnerName: result[2],
      };
      const tempJoinRoute = await JoinRouteNotifications.generateJoinRouteFromSubmission(
        submission,  Number(getRouteId.routeJoined), slackId, teamId, engagementObject,
      );
      const message = await JoinRouteHelpers.confirmRouteBlockMessage(tempJoinRoute);
      const url = JSON.parse(payload.view.private_metadata);
      await UpdateSlackMessageHelper.sendMessage(url, message);
    } catch (error) {
      respond.error(error.errors);
    }
  }

  static async confirmJoiningRoute(payload: any, respond: Function) {
    const { user: { id: slackId }, team: { id: teamId } } = payload;
    const routeCached = await Cache.fetch(getRouteKey(slackId));
    const result = await Cache.fetch(`userDetails${slackId}`);
    const engagementObject = {
      startDate: result[0],
      endDate: result[1],
      partnerName: result[2],
    };
    const tempJoinRoute = await JoinRouteNotifications.generateJoinRouteFromSubmission(
        routeCached.submissionData, Number(routeCached.routeJoined), slackId,
        teamId, engagementObject);
    const message = await JoinRouteHelpers.notifyJoiningRouteMessage(payload, tempJoinRoute);
    respond(message);
  }
}

export default JoinRouteController;
