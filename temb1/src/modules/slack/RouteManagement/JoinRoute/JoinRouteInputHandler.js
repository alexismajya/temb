import {
  SlackInteractiveMessage, SlackFailureResponse
} from '../../SlackModels/SlackMessageModels';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import SlackEvents from '../../events/index';
import { slackEventNames } from '../../events/slackEvents';
import JoinRouteDialogPrompts from './JoinRouteDialogPrompts';
import JoinRouteNotifications from './JoinRouteNotifications';
import JoinRouteHelpers from './JoinRouteHelpers';
import FormValidators from './JoinRouteFormValidators';
import JoinRouteInteractions from './JoinRouteInteractions';
import RouteServiceHelper from '../../../../helpers/RouteServiceHelper';
import { routeService } from '../../../routes/route.service';
import { getFellowEngagementDetails } from '../../helpers/formHelper';
import UserService from '../../../users/user.service';
import { joinRouteRequestService } from '../../../joinRouteRequests/joinRouteRequest.service';
import { engagementService } from '../../../engagements/engagement.service';
import SlackInteractionsHelpers from '../../helpers/slackHelpers/SlackInteractionsHelpers';
import CleanData from '../../../../helpers/cleanData';
import { handleActions } from '../../helpers/slackHelpers/handler';
import { routeBatchService } from '../../../routeBatches/routeBatch.service';

class JoinRouteInputHandlers {
  static async joinRoute(payload, respond) {
    try {
      const { actions: [{ value: routeId }], user: { id: userId } } = payload;
      const [engagement, routeBatch] = await Promise.all([
        getFellowEngagementDetails(userId, payload.team.id),
        routeBatchService.getRouteBatchByPk(routeId, true)]);
      const user = await UserService.getUserBySlackId(userId);

      if (!JoinRouteInputHandlers.joinRouteHandleRestrictions(
        user, routeBatch, engagement, respond
      )) {
        return;
      }
      if (RouteServiceHelper.canJoinRoute(routeBatch)) {
        const state = JSON.stringify({ routeId, capacityFilled: false });
        await JoinRouteDialogPrompts.sendFellowDetailsForm(payload, state, engagement);
        respond(new SlackInteractiveMessage('Noted'));
      } else {
        const notice = JoinRouteInteractions.fullRouteCapacityNotice(routeBatch.id);
        respond(notice);
      }
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
    }
  }

  static joinRouteHandleRestrictions(user, route, engagement, respond) {
    if (!engagement) {
      respond(new SlackInteractiveMessage(
        `Sorry! It appears you are not on any engagement at the moment.
        If you believe this is incorrect, contact Tembea Support.`
      ));
      return false;
    }

    if (user.routeBatchId) {
      respond(new SlackInteractiveMessage('You are already on a route. Cannot join another'));
      return false;
    }
    return true;
  }

  static async continueJoinRoute(payload, respond) {
    const {
      actions: [{ value: routeId }]
    } = payload;
    const engagement = await getFellowEngagementDetails(payload.user.id, payload.team.id);
    if (!engagement) {
      respond(new SlackInteractiveMessage(
        `Sorry! It appears you are not on any engagement at the moment.
        If you believe this is incorrect, contact Tembea Support.`
      ));
      return;
    }
    const state = JSON.stringify({ routeId, capacityFilled: true });
    await JoinRouteDialogPrompts.sendFellowDetailsForm(payload, state, engagement);
    respond(new SlackInteractiveMessage('Noted'));
  }

  static async fellowDetails(payload, respond) {
    try {
      const errors = await FormValidators.validateFellowDetailsForm(payload);
      if (errors.length > 0) {
        return { errors };
      }
      const preview = await JoinRouteNotifications.sendFellowDetailsPreview(
        payload
      );
      respond(preview);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(
        new SlackInteractiveMessage('Unsuccessful request. Kindly Try again')
      );
    }
  }

  static async submitJoinRoute(payload, respond) {
    try {
      const {
        actions: [{ value }],
        user: { id },
        team: { id: teamId }
      } = payload;
      const { routeId, capacityFilled } = JSON.parse(value);
      let more = '';
      let eventArgs;
      if (capacityFilled) {
        more = ' Someone from the Ops team will reach out to you shortly.';
        eventArgs = [
          slackEventNames.OPS_FILLED_CAPACITY_ROUTE_REQUEST,
          { routeId, teamId, requesterSlackId: id }
        ];
      } else {
        const {
          id: joinId, dataValues: { engagementId }
        } = await JoinRouteHelpers.saveJoinRouteRequest(
          payload,
          routeId
        );
        await joinRouteRequestService.updateJoinRouteRequest(joinId, { status: 'Confirmed' });
        const user = await UserService.getUserBySlackId(id);
        const engagement = await getFellowEngagementDetails(id, teamId);
        const { startDate, endDate } = engagement;
        await engagementService.updateEngagement(engagementId, { startDate, endDate });
        await routeService.addUserToRoute(routeId, user.id);
        eventArgs = [
          slackEventNames.MANAGER_RECEIVE_JOIN_ROUTE,
          payload,
          joinId
        ];
      }
      respond(
        new SlackInteractiveMessage(`Hey <@${id}> :smiley:, request has been received.${more}`)
      );
      SlackEvents.raise(...eventArgs);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(SlackFailureResponse);
    }
  }

  static async showAvailableRoutes(payload, respond) {
    await JoinRouteInteractions.sendAvailableRoutesMessage(payload, respond);
  }

  static async backButton(payload, respond) {
    const {
      actions: [{ value }]
    } = payload;
    if (value === 'back') {
      return JoinRouteInteractions.sendAvailableRoutesMessage(payload, respond);
    }
    respond(SlackInteractionsHelpers.goodByeMessage());
  }

  static async handleJoinRouteActions(data, respond) {
    try {
      const payload = CleanData.trim(data);
      return handleActions(payload, respond, JoinRouteInputHandlers);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(
        new SlackInteractiveMessage('Unsuccessful request. Kindly Try again')
      );
    }
  }
}

export default JoinRouteInputHandlers;
