import { getAction } from '../helpers/slackHelpers/handler';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import RouteRequestService from '../../routes/route-request.service';
import DialogPrompts from '../SlackPrompts/DialogPrompts';
import { SlackInteractiveMessage } from '../SlackModels/SlackMessageModels';
import ManagerFormValidator from '../../../helpers/slack/UserInputValidator/managerFormValidator';
import OperationsNotifications from '../SlackPrompts/notifications/OperationsRouteRequest/index';
import CleanData from '../../../helpers/cleanData';
import OperationsHelper from '../helpers/slackHelpers/OperationsHelper';
import SlackNotifications from '../SlackPrompts/Notifications';
import { providerErrorMessage } from '../../../helpers/constants';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import TripHelper from '../../../helpers/TripHelper';
import InteractivePrompts from '../SlackPrompts/InteractivePrompts';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import tripService from '../../trips/trip.service';
import RouteHelper from '../../../helpers/RouteHelper';
import UserService from '../../users/user.service';
import { driverService } from '../../drivers/driver.service';
import { SlackDialogError } from '../SlackModels/SlackDialogModels';
import DriverNotifications from '../SlackPrompts/notifications/DriverNotifications/driver.notifications';
import TripJobs from '../../../services/jobScheduler/jobs/TripJobs';
import { cabService } from '../../cabs/cab.service';

const handlers = {
  decline: async (payload) => {
    const { actions, channel: { id: channelId }, original_message: { ts: timeStamp } } = payload;
    const [{ value: routeRequestId }] = actions;

    const { botToken, routeRequest } = await RouteRequestService
      .getRouteRequestAndToken(routeRequestId, payload.team.id);

    const declined = routeRequest.status === 'Declined';
    const approved = routeRequest.status === 'Approved';

    if (approved || declined) {
      OperationsNotifications.updateOpsStatusNotificationMessage(payload, routeRequest, botToken);
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
      'operations_route_declinedRequest',
      JSON.stringify(state), 'Decline', 'Decline', 'declineReason', 'route');
  },

  declinedRequest: async (data, respond) => {
    try {
      const payload = CleanData.trim(data);
      const {
        submission: { declineReason },
        team: { id: teamId },
        user: { id: opsSlackId },
        state
      } = payload;
      const { decline: { timeStamp, channelId, routeRequestId } } = JSON.parse(state);
      const opsUserInfo = await UserService.getUserBySlackId(opsSlackId);
      const botToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
      const updatedRequest = await RouteHelper.updateRouteRequest(routeRequestId,
        { status: 'Declined', opsComment: declineReason, opsReviewerId: opsUserInfo.id });
      await OperationsNotifications.completeOperationsDeclineAction(
        updatedRequest, botToken, channelId, timeStamp, opsSlackId, false
      );
    } catch (error) {
      bugsnagHelper.log(error);
      respond(
        new SlackInteractiveMessage('Unsuccessful request. Kindly Try again')
      );
    }
  },
  approve: async (data) => {
    const payload = CleanData.trim(data);
    const { actions, channel: { id: channelId }, original_message: { ts: timeStamp } } = payload;
    const [{ value: routeRequestId }] = actions;
    const { slackBotOauthToken, routeRequest, routeRequest: { status } } = await RouteRequestService
      .getRouteRequestAndToken(routeRequestId, payload.team.id);

    const declined = status === 'Declined';
    const approved = status === 'Approved';

    if (approved || declined) {
      await OperationsNotifications.updateOpsStatusNotificationMessage(
        payload, routeRequest, slackBotOauthToken
      );
      return;
    }
    const state = { approve: { timeStamp, channelId, routeRequestId } };
    try {
      await DialogPrompts.sendOperationsNewRouteApprovalDialog(payload, state);
    } catch (error) {
      await SlackNotifications.sendNotification(
        SlackNotifications.createDirectMessage(channelId, providerErrorMessage), slackBotOauthToken
      );
    }
  },
  approvedRequest: async (data, respond) => {
    try {
      const payload = CleanData.trim(data);
      const errors = ManagerFormValidator.approveRequestFormValidation(payload);
      if (errors.length > 0) { return { errors }; }
      const {
        team: { id: teamId }, user: { id: opsSlackId }, submission, state
      } = payload;

      const { id: opsUserId } = await UserService.getUserBySlackId(opsSlackId);
      const { approve: { channelId, timeStamp, routeRequestId } } = JSON.parse(state);

      const { botToken } = await teamDetailsService.getTeamDetails(teamId);
      const updatedRequest = await RouteHelper.updateRouteRequest(routeRequestId, {
        opsReviewerId: opsUserId, opsComment: submission.opsComment, status: 'Approved',
      });

      const result = await RouteHelper.createNewRouteBatchFromSlack(submission, routeRequestId, botToken);
      await OperationsHelper.completeRouteApproval(updatedRequest, result, {
        channelId, opsSlackId, timeStamp, submission, botToken
      });
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Unsuccessful request. Kindly Try again'));
    }
  }
};

class OperationsHandler {
  static operationsRouteController(action) {
    const errorHandler = (() => {
      throw new Error(`Unknown action: operations_route_${action}`);
    });
    return handlers[action] || errorHandler;
  }

  static async handleOperationsActions(data, respond) {
    try {
      const payload = CleanData.trim(data);
      const action = getAction(payload, 'actions');
      const actionHandler = OperationsHandler.operationsRouteController(action);
      return actionHandler(payload, respond);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Error:bangbang:: I was unable to do that.'));
    }
  }
  /**
   * Complete the assignment of cab and driver to a trip request
   * Update transaction state in cache and db
   * create a trip scheduler
   * Send notifications to requester, rider, ops channel and manager
   *`
   * @param {object} data request object from slack
   * @param respond
   */

  static async completeOpsAssignCabDriver(data) {
    try {
      const {
        submission: {
          driver: driverId, cab: cabId, confirmationComment
        }, team: { id: teamId }, user: { id: userId }, state, channel
      } = data;
      const cab = await cabService.getById(cabId);
      const driver = await driverService.getDriverById(driverId);

      const errors = await OperationsHandler.validateOpsAssignCabnDriverDialog(cab, driver);
      if (errors) return { errors };
      const { tripId, timeStamp: ts } = JSON.parse(state);
      const { id: opsUserId } = await SlackHelpers.findOrCreateUserBySlackId(userId, teamId);
      const timeStamp = TripHelper.convertApprovalDateFormat(ts);
      const updateTripStatusPayload = OperationsHelper
        .getUpdateTripStatusPayload(tripId, confirmationComment, opsUserId, timeStamp, cabId,
          driverId, cab.providerId);
      const trip = await tripService.update(tripId, updateTripStatusPayload, {
        returning: true,
        include: tripService.defaultInclude,
      });
      const { rider: { slackId: riderSlackId }, requester: { slackId: requesterSlackId } } = trip;
      const botToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
      OperationsHandler.sendAssignCabDriverNotifications(teamId, trip, cab, driver,
        requesterSlackId, riderSlackId, channel, ts);
      DriverNotifications.checkAndNotifyDriver(driverId, teamId, trip);
      TripJobs.scheduleTakeOffReminder({ botToken, data: trip });
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static async validateOpsAssignCabnDriverDialog(cab, driver) {
    const error = 'cab and driver must belong to the same provider';
    if (driver.providerId !== cab.providerId) {
      return [
        new SlackDialogError('cab', error),
        new SlackDialogError('driver', error)
      ];
    }
  }

  static async sendAssignCabDriverNotifications(teamId, trip, cab, driver, requesterSlackId,
    riderSlackId, channel, ts) {
    try {
      const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
      const tripInformation = { ...trip, cab, driver };
      const driverDetails = `,${driver.driverName},${driver.driverPhoneNo}`;
      const message = 'Thank you for completing this trip request';
      const tripDetailsAttachment = OperationsHelper.getTripDetailsAttachment(tripInformation,
        driverDetails);
      await InteractivePrompts.messageUpdate(channel.id, message, ts, [tripDetailsAttachment],
        slackBotOauthToken);
      await OperationsHelper.sendCompleteOpAssignCabMsg(teamId, {
        requesterSlackId,
        riderSlackId
      }, tripInformation);
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }
}

export { handlers, OperationsHandler };
