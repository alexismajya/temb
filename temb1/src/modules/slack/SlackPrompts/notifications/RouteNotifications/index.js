import SlackNotifications from '../../Notifications';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import BugsnagHelper from '../../../../../helpers/bugsnagHelper';
import UserService from '../../../../users/user.service';
import { routeBatchService } from '../../../../routeBatches/routeBatch.service';
import {
  SlackAttachmentField, SlackAttachment, SlackActionButtonStyles
} from '../../../SlackModels/SlackMessageModels';
import RouteServiceHelper from '../../../../../helpers/RouteServiceHelper';
import ProviderAttachmentHelper from '../ProviderNotifications/helper';
import WhatsappService from '../../../../notifications/whatsapp/whatsapp.service';
import schemas from '../../../../../middlewares/ValidationSchemas';
import {
  MarkdownText, BlockMessage, SlackText, ButtonElement, BlockTypes, SectionBlock, ActionBlock
} from '../../../../new-slack/models/slack-block-models';
import { sectionDivider } from '../../../../new-slack/helpers/slack-helpers';

const prefix = 'route_trip_';
const { phoneNoRegex } = schemas;
export const actions = Object.freeze({
  confirmation: `${prefix}confirm`,
  decline: `${prefix}decline`,
  pending: `${prefix}pending`,
});
export const blocks = Object.freeze({
  tripCompletion: `${prefix}completion`,
});
export default class RouteNotifications {
  static async sendRouteNotificationToRouteRiders(teamUrl, routeInfo) {
    const {
      riders, route: { destination: { address } }, status, deleted
    } = routeInfo;
    const { botToken: teamBotOauthToken } = await teamDetailsService
      .getTeamDetailsByTeamUrl(teamUrl);
    const isDeactivation = (status && status.toLowerCase() === 'inactive') || deleted;
    const updatedDetails = routeInfo && await RouteServiceHelper.serializeRouteBatch(routeInfo);
    const text = isDeactivation
      ? `Sorry, Your route to *${address}* is no longer available :disappointed:`
      : `Your route to *${address}* has been updated.`;

    const message = await SlackNotifications.createDirectMessage(
      '',
      text,
      !isDeactivation && RouteNotifications.generateRouteUpdateAttachement(updatedDetails)
    );
    RouteNotifications.nofityRouteUsers(riders, message, isDeactivation, teamBotOauthToken);
  }

  static generateRouteUpdateAttachement(updatedDetails) {
    const {
      takeOff, name, destination, driverName, driverPhoneNo
    } = updatedDetails;
    const updateMessageAttachment = new SlackAttachment('Updated Route Details');
    updateMessageAttachment.addOptionalProps('', '', '#3c58d7');
    updateMessageAttachment.addFieldsOrActions('fields', [
      new SlackAttachmentField('Take Off Time', takeOff, true),
      new SlackAttachmentField('Route Name', name, true),
      new SlackAttachmentField('Destination', destination, true),
      new SlackAttachmentField('Driver\'s name', driverName, true),
      new SlackAttachmentField('Driver\'s Phone Number', driverPhoneNo, true),
    ]);
    return updateMessageAttachment;
  }

  static async nofityRouteUsers(riders, message, isDeactivation = false, botToken) {
    try {
      riders.forEach(async (rider) => {
        if (isDeactivation) {
          const theRider = await UserService.getUserById(rider.id);
          theRider.routeBatchId = null;
          await theRider.save();
        }
        RouteNotifications.sendNotificationToRider(message, rider.slackId, botToken);
      });
    } catch (err) {
      BugsnagHelper.log(err);
    }
  }

  static async sendNotificationToRider(message, slackId, slackBotOauthToken) {
    const imId = await SlackNotifications.getDMChannelId(slackId, slackBotOauthToken);
    const response = { ...message, channel: imId };
    await SlackNotifications.sendNotification(response, slackBotOauthToken);
  }

  static async sendRouteUseConfirmationNotificationToRider({
    record, rider
  }, botToken) {
    try {
      const channelID = await SlackNotifications.getDMChannelId(rider.slackId, botToken);
      const routeBatch = await routeBatchService.getRouteBatchByPk(record.batch.id, true);
      const fields = RouteNotifications.createDetailsFields(routeBatch, false);

      const message = `Hi! <@${rider.slackId}> Did you take the trip on route ${routeBatch.route.name}?`;
      const header = new SectionBlock().addText(new MarkdownText(message));
      const buttons = [
        new ButtonElement(new SlackText('Yes'), `${record.id}`, actions.confirmation, SlackActionButtonStyles.primary),
        new ButtonElement(new SlackText('Still on trip'), `${record.id}`, actions.pending, SlackActionButtonStyles.primary),
        new ButtonElement(new SlackText('No'), `${record.id}`, actions.decline, SlackActionButtonStyles.danger)
      ];
      const confirmationBlock = new SectionBlock().addText(new MarkdownText('*Trip*'))
        .addFields(fields);
      const buttonsBlock = new ActionBlock(BlockTypes.actions, blocks.tripCompletion)
        .addElements(buttons);

      const notification = new BlockMessage([header, buttonsBlock, sectionDivider, confirmationBlock], channelID, message);
      return SlackNotifications.sendNotification(notification, botToken);
    } catch (error) {
      BugsnagHelper.log(error);
    }
  }

  /**
      * Sends notification to the manager
      * when a fellow request for a new route have been approved.
      * @return {Promise<*>}
      * @param routeRequest
      * @param slackBotOauthToken
      * @param submission
      */
  static async sendRouteApproveMessageToManager(
    routeRequest, slackBotOauthToken, requestData
  ) {
    try {
      const channelID = await SlackNotifications.getDMChannelId(
        routeRequest.manager.slackId, slackBotOauthToken
      );
      const message = await ProviderAttachmentHelper.getManagerApproveAttachment(
        routeRequest, channelID, true, requestData
      );
      return SlackNotifications.sendNotification(message, slackBotOauthToken);
    } catch (error) {
      BugsnagHelper.log(error);
    }
  }

  /**
        * This function sends a notification to the fellow
        * when the providers team approves the route request
        * @return {Promise<*>}
        * @param routeRequest
        * @param slackBotOauthToken
        * @param submission
        * @param teamUrl
        */
  static async sendRouteApproveMessageToFellow(
    routeRequest, slackBotOauthToken, requestData
  ) {
    try {
      const { fellow } = routeRequest.engagement;
      const channelID = await SlackNotifications.getDMChannelId(
        fellow.slackId, slackBotOauthToken
      );
      const message = await ProviderAttachmentHelper.getFellowApproveAttachment(
        routeRequest, channelID, requestData
      );
      return SlackNotifications.sendNotification(message, slackBotOauthToken);
    } catch (error) {
      BugsnagHelper.log(error);
    }
  }

  static async getReminderMessage(channelID, { rider, batch: routeBatch }) {
    const reminderBlock = new SectionBlock().addText(new MarkdownText('*Trip Reminder*'));
    const routeInfoFields = RouteNotifications.createDetailsFields(routeBatch);
    reminderBlock.addFields(routeInfoFields);
    const message = `Hey, <@${rider.slackId}>, you have an upcoming trip on route ${routeBatch.route.name}`;
    const header = new SectionBlock().addText(new MarkdownText(message));

    return new BlockMessage([header, sectionDivider, reminderBlock], channelID, message);
  }

  static async sendRouteTripReminder({ rider, batch }, slackBotOauthToken) {
    try {
      const channelID = await SlackNotifications.getDMChannelId(
        rider.slackId, slackBotOauthToken
      );

      const message = await RouteNotifications.getReminderMessage(channelID,
        { rider, batch });

      return SlackNotifications.sendNotification(message, slackBotOauthToken);
    } catch (error) {
      BugsnagHelper.log(error);
    }
  }

  static async sendWhatsappRouteTripReminder(driver, batch) {
    let message;
    if (phoneNoRegex.test(driver.driverPhoneNo)) {
      message = RouteNotifications.getRouteTripReminderMessage(driver, batch);
      await WhatsappService.send(message);
    }
  }

  static createDetailsFields(routeBatch, reminder = true) {
    return [
      new MarkdownText(`*Batch*\n${routeBatch.batch}`),
      new MarkdownText(reminder ? `*Takes Off At*\n${routeBatch.takeOff}` : `*Took Off At*\n${routeBatch.takeOff}`),
      new MarkdownText(`*Cab Reg No*\n${routeBatch.cabDetails.regNumber}`),
      new MarkdownText(`*Driver Name*\n${routeBatch.driver.driverName}`),
      new MarkdownText(`*Driver Phone Number*\n${routeBatch.driver.driverPhoneNo}`)
    ];
  }

  static async sendUserLeavesRouteMessage(channelID, payload, slackId, routeInformation) {
    const { routeName, riders } = routeInformation;
    const { team: { id: teamId } } = payload;
    const users = riders.length;

    const text = `Hello, <@${slackId}> has dropped off \`${routeName}\` route.
The route now has \`${users}\` user${users > 1 ? 's' : ''}`;

    const botAuthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    await SlackNotifications.sendNotifications(channelID, null, text, botAuthToken);
  }

  static getRouteTripReminderMessage(driver, routeBatch, reminder = true) {
    const reminderVerb = reminder ? 'Takes Off At' : 'Took Off At';
    return {
      to: driver.driverPhoneNo,
      body: `Hello *${driver.driverName}*,`
      + ` You have an upcoming trip on route *${routeBatch.route.name}*\n\n`
      + `*Batch*: ${routeBatch.batch}\n`
      + `*${reminderVerb}*: ${routeBatch.takeOff}\n`
      + `*Cab Reg No*: ${routeBatch.cabDetails.regNumber}\n\n`
      + 'We wish you a safe trip.',
    };
  }
}
