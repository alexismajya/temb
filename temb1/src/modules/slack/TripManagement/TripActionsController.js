import tripService from '../../trips/trip.service';
import SendNotifications from '../SlackPrompts/Notifications';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import UserInputValidator from '../../../helpers/slack/UserInputValidator';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import ProviderNotifications from '../SlackPrompts/notifications/ProviderNotifications';
import TripHelper from '../../../helpers/TripHelper';
import { TripStatus } from '../../../database/models/trip-request';
import Interactions from '../../new-slack/trips/manager/interactions';
import managerTripActions from '../../new-slack/trips/manager/constants';


class TripActionsController {
  static getErrorMessage() {
    return { text: 'Dang, something went wrong there.' };
  }

  static runCabValidation(payload) {
    if (payload.submission.confirmationComment) {
      const errors = [];
      const err = UserInputValidator.validateCabDetails(payload);
      errors.push(...err);
      return errors;
    }
  }

  /**
   * @method getTripNotificationDetails
   * @param {object} opsDetails
   * @return {object} Returns details that are useful for
   * notifying the Ops team head
   */
  static async getTripNotificationDetails(opsDetails) {
    const { user: { id: userId }, team: { id: teamId } } = opsDetails;
    const [ops, slackBotOauthToken] = await Promise.all([
      SlackHelpers.findOrCreateUserBySlackId(userId, teamId),
      teamDetailsService.getTeamDetailsBotOauthToken(teamId)
    ]);
    return { ops, slackBotOauthToken };
  }

  static async changeTripStatus(payload) {
    try {
      const { user: { id: userId }, team: { id: teamId }, actions } = payload;
      const [ops, teamDetails] = await Promise.all([
        SlackHelpers.findOrCreateUserBySlackId(userId, teamId),
        teamDetailsService.getTeamDetails(teamId)
      ]);
      const { id: opsUserId } = ops;
      if (actions && actions.length >= 1) { // checks if its block actions available
        const [{ action_id: actionId }] = actions; // handling confirmation action
        if (actionId === managerTripActions.confirmApprovedTrip) {
          return TripActionsController.changeTripStatusToConfirmed(
            opsUserId, payload, teamDetails
          );
        }
      }
      if (payload.submission.confirmationComment) {
        return TripActionsController.changeTripStatusToPendingConfirmation(
          opsUserId, payload, teamDetails
        );
      } if (payload.submission.opsDeclineComment) {
        return TripActionsController.changeTripStatusToDeclined(
          opsUserId, payload, teamDetails
        );
      }
    } catch (error) {
      bugsnagHelper.log(error);
      return TripActionsController.getErrorMessage();
    }
  }

  static async changeTripStatusToPendingConfirmation(opsUserId, payload) {
    const {
      submission: { confirmationComment, providerId }, channel,
      state: payloadState
    } = payload;
    const { tripId, timeStamp, responseUrl } = JSON.parse(payloadState);
    const approvalDate = TripHelper.convertApprovalDateFormat(timeStamp);
    const trip = await tripService.updateRequest(tripId, {
      tripStatus: TripStatus.pendingConfirmation,
      operationsComment: confirmationComment,
      confirmedById: opsUserId,
      providerId,
      approvalDate
    });
    await Interactions.sendOpsDeclineOrApprovalCompletion(false, trip, channel,
      payload.user.id, responseUrl);
  }

  static async changeTripStatusToConfirmed(opsUserId, payload, teamDetails) {
    const {
      channel, response_url: responseUrl, message, actions
    } = payload;
    const [{ value: tripId }] = actions;
    const { ts: timeStamp } = message;
    const approvalDate = TripHelper.convertApprovalDateFormat(timeStamp, true);
    const trip = await tripService.updateRequest(tripId, {
      tripStatus: TripStatus.confirmed,
      confirmedById: opsUserId,
      approvalDate
    });
    const data = { ...payload, submission: { providerId: trip.provider.id } };
    this.notifyAll(data, trip, teamDetails);
    await Interactions.sendOpsDeclineOrApprovalCompletion(false, trip, channel,
      payload.user.id, responseUrl);
  }

  /**
   * Handles the process of notifying the assigned provider and Ops
   *
   * @static
   * @param {Object} payload - The request payload
   * @param {Object} trip - The trip details
   * @param {string} slackBotOauthToken -  Slackbot auth token
   * @memberof TripActionsController
   */
  static async notifyAll(payload, trip, teamDetails) {
    try {
      const {
        submission: { providerId },
        team: { id: teamId },
        user: { id: userId },
      } = payload;
      await Promise.all([
        ProviderNotifications.sendTripNotification(providerId,
          teamDetails, trip),
        SendNotifications.sendManagerConfirmOrDeclineNotification(teamId, userId, trip, false),
        SendNotifications.sendUserConfirmOrDeclineNotification(teamId, userId, trip, false, true)
      ]);
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }

  static async completeTripRequest(payload) {
    try {
      const {
        submission: {
          cab: cabId,
          driver: driverId
        },
        team: { id: teamId },
        state: payloadState,
      } = payload;
      const {
        tripId,
        timeStamp,
        channel,
      } = JSON.parse(payloadState);
      const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
      const trip = tripService.completeCabAndDriverAssignment({
        tripId, updateData: { cabId, driverId }, teamId: payload.team.id
      });
      await ProviderNotifications.UpdateProviderNotification(channel, slackBotOauthToken, trip,
        timeStamp);
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }

  static async sendAllNotifications(teamId, userId, trip, channel,
    isDecline = false, responseUrl) {
    await Promise.all([
      SendNotifications.sendUserConfirmOrDeclineNotification(teamId, userId, trip,
        isDecline),
      SendNotifications.sendManagerConfirmOrDeclineNotification(teamId, userId, trip,
        isDecline),
      Interactions.sendOpsDeclineOrApprovalCompletion(isDecline, trip,
        channel, userId, responseUrl)
    ]);
  }

  static async changeTripStatusToDeclined(opsUserId, payload) {
    const {
      submission: { opsDeclineComment },
      team: { id: teamId },
      user: { id: userId },
      channel: { id: channelId },
      state: payloadState
    } = payload;
    const { trip: stateTrip, responseUrl } = JSON.parse(payloadState);
    const tripId = Number(stateTrip);

    const trip = await tripService.updateRequest(tripId, {
      tripStatus: TripStatus.declinedByOps,
      operationsComment: opsDeclineComment,
      declinedById: opsUserId
    });
    await TripActionsController.sendAllNotifications(teamId, userId, trip,
      channelId, true, responseUrl);
    return 'success';
  }
}

export default TripActionsController;
