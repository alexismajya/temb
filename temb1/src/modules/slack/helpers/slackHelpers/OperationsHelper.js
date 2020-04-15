import RouteRequestService from '../../../routes/route-request.service';
import { cabService } from '../../../cabs/cab.service';
import OperationsNotifications from '../../SlackPrompts/notifications/OperationsRouteRequest/index';
import SlackNotifications from '../../SlackPrompts/Notifications';
import { SlackAttachment, SlackAttachmentField } from '../../SlackModels/SlackMessageModels';
import ProviderAttachmentHelper from '../../SlackPrompts/notifications/ProviderNotifications/helper';
import ProviderNotifications from '../../SlackPrompts/notifications/ProviderNotifications';
import RouteNotifications from '../../SlackPrompts/notifications/RouteNotifications';
import UserService from '../../../users/user.service';

class OperationsHelper {
  static async completeRouteApproval(updatedRequest, result, {
    channelId,
    opsSlackId,
    timeStamp,
    submission,
    botToken
  }) {
    // update user route batch
    const { engagement: { fellow: { id: userId } } } = updatedRequest;
    const updateUserInfo = UserService.updateUser(userId, { routeBatchId: result.batch.id });

    // send cab and driver request to provider
    const providerNotification = ProviderNotifications.sendRouteApprovalNotification(
      result.batch, submission.providerId, botToken
    );

    // send completion message to ops
    const opsNotification = OperationsNotifications.completeOperationsApprovedAction(
      updatedRequest, channelId, timeStamp, opsSlackId, botToken, submission
    );

    // send completion message to manager
    const managerNotification = RouteNotifications.sendRouteApproveMessageToManager(
      updatedRequest, botToken, submission
    );

    // send completion message to user
    const userNotification = RouteNotifications.sendRouteApproveMessageToFellow(
      updatedRequest, botToken, submission
    );
    return Promise.all(
      [providerNotification, opsNotification, managerNotification, userNotification, updateUserInfo]
    );
  }

  static async getCabSubmissionDetails(data, submission) {
    let regNumber;
    let routeCapacity;
    if (data.callback_id === 'operations_reason_dialog_route') {
      const {
        driverName, driverPhoneNo, regNumber: rgNum, capacity, model
      } = submission;
      await cabService.findOrCreateCab(driverName, driverPhoneNo, rgNum, capacity, model);
      regNumber = rgNum;
      routeCapacity = capacity;
    } else {
      const [, , regNo] = submission.cab.split(',');
      regNumber = regNo;
      routeCapacity = await RouteRequestService.getCabCapacity(regNumber);
    }
    return {
      regNumber,
      routeCapacity
    };
  }

  static async sendCompleteOpAssignCabMsg(teamId, ids, tripInformation) {
    const { requesterSlackId, riderSlackId } = ids;
    await SlackNotifications.sendManagerConfirmOrDeclineNotification(teamId, requesterSlackId,
      tripInformation, false);
    await SlackNotifications.sendUserConfirmOrDeclineNotification(teamId, riderSlackId,
      tripInformation, false);
  }

  static getTripDetailsAttachment(tripInformation, driverDetails) {
    const approve = [
      new SlackAttachmentField('', `:white_check_mark: <@${tripInformation.confirmer.slackId}>`
      + 'approved this *request*')
    ];
    const tripDetailsAttachment = new SlackAttachment('Trip request complete');
    tripDetailsAttachment.addOptionalProps('', '', '#3c58d7');
    tripDetailsAttachment.addFieldsOrActions('fields',
      ProviderAttachmentHelper.providerFields(tripInformation, driverDetails));
    tripDetailsAttachment.addFieldsOrActions('fields', approve);
    return tripDetailsAttachment;
  }

  static getUpdateTripStatusPayload(
    tripId,
    confirmationComment,
    opsUserId,
    timeStamp,
    cabId,
    driverId,
    providerId
  ) {
    return {
      tripStatus: 'Confirmed',
      tripId,
      operationsComment: confirmationComment,
      confirmedById: opsUserId,
      approvalDate: timeStamp,
      cabId,
      driverId,
      providerId
    };
  }
}

export default OperationsHelper;
