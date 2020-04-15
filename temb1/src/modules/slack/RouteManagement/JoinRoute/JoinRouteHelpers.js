import Utils from '../../../../utils/index';
import { joinRouteRequestService } from '../../../joinRouteRequests/joinRouteRequest.service';
import Cache from '../../../shared/cache';
import { partnerService } from '../../../partners/partner.service';
import { engagementService } from '../../../engagements/engagement.service';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import { SlackAttachmentField, SlackAttachment } from '../../SlackModels/SlackMessageModels';
import AttachmentHelper from '../../SlackPrompts/notifications/AttachmentHelper';
import { routeBatchService } from '../../../routeBatches/routeBatch.service';
import { timeTo12hrs } from '../../helpers/dateHelpers';
import DateDialogHelper from '../../../../helpers/dateHelper';

class JoinRouteHelpers {
  static getName(username) {
    let names = username.split('.');
    names = names.map((name) => Utils.toSentenceCase(name));
    return names.join(' ');
  }

  static async saveJoinRouteRequest(payload, routeBatchId) {
    const { user: { id: slackId }, team: { id: teamId } } = payload;
    const {
      manager: managerSlackId, workHours
    } = await Cache.fetch(`joinRouteRequestSubmission_${slackId}`);
    const [start, end, partnerName] = await Cache.fetch(`userDetails${slackId}`);
    const engagementDates = { startDate: start, endDate: end };
    const { startDate, endDate } = DateDialogHelper.convertIsoString(engagementDates);
    const [partner, fellow, manager, routeBatch] = await Promise.all([
      partnerService.findOrCreatePartner(partnerName),
      SlackHelpers.findOrCreateUserBySlackId(slackId, teamId),
      SlackHelpers.findOrCreateUserBySlackId(managerSlackId),
      routeBatchService.getRouteBatchByPk(routeBatchId)
    ]);

    const engagement = await engagementService.findOrCreateEngagement(
      workHours, fellow, partner, startDate, endDate
    );

    return joinRouteRequestService.createJoinRouteRequest(
      engagement.id, manager.id, routeBatch.id
    );
  }

  static async getJoinRouteRequest({ id, submission, slackId }) {
    let manager;
    let workHours;
    let startDate;
    let endDate;
    let partnerName;
    if (submission) {
      ({
        manager, partnerName, workHours, startDate, endDate
      } = submission);
      await Cache.saveObject(`joinRouteRequestSubmission_${slackId}`, submission);
    } else {
      ({
        manager: { slackId: manager },
        engagement: {
          workHours, startDate, endDate, partner: { name: partnerName }
        }
      } = await joinRouteRequestService.getJoinRouteRequest(id));
    }
    return {
      manager, workHours, startDate, endDate, partnerName
    };
  }

  static async engagementFields(joinRequest) {
    const { manager: { slackId, email, name } } = joinRequest;
    const managerName = Utils.getNameFromEmail(email) || name;
    const managerField = new SlackAttachmentField('Line Manager', `${managerName} (<@${slackId}>)`);
    const fields = await AttachmentHelper.engagementAttachmentFields(joinRequest);
    fields.splice(2, 0, managerField);
    return fields;
  }

  static routeFields(route) {
    const {
      capacity, riders, takeOff,
      route: { name: routeName, destination: { address } }
    } = route;
    const takeOffTime = timeTo12hrs(takeOff);
    return [
      new SlackAttachmentField('Route', routeName, true),
      new SlackAttachmentField('Route capacity', `${riders.length}/${capacity}`, true),
      new SlackAttachmentField('Route Departure Time', takeOffTime, false),
      new SlackAttachmentField('Bus Stop :busstop:', address, false),
    ];
  }

  static async joinRouteAttachments(joinRoute) {
    const { routeBatch, routeBatch: { route: { imageUrl } } } = joinRoute;
    const attachment = new SlackAttachment(undefined, undefined,
      undefined, undefined, imageUrl);
    const fellowFields = await JoinRouteHelpers.engagementFields(joinRoute);
    const routeBatchFields = await JoinRouteHelpers.routeFields(routeBatch);
    const separator = '---------------------';
    const attachments = [
      new SlackAttachmentField(`${separator}${separator}${separator}`, null, false),
      new SlackAttachmentField('*_`Engagement Details`_*', null, false),
      ...fellowFields,
      new SlackAttachmentField(`${separator}${separator}${separator}`, null, false),
      new SlackAttachmentField('*_`Route Information`_*', null, false),
      ...routeBatchFields,
      new SlackAttachmentField(`${separator}${separator}${separator}`, null, false),
    ];
    attachment.addFieldsOrActions('fields', attachments);
    return attachment;
  }
}

export default JoinRouteHelpers;
