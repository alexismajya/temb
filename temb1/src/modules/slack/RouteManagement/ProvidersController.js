import ProviderNotifications from '../SlackPrompts/notifications/ProviderNotifications/index';
import { SlackInteractiveMessage, SlackAttachment } from '../SlackModels/SlackMessageModels';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import { routeService } from '../../routes/route.service';
import SlackNotifications from '../SlackPrompts/Notifications';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import ProviderAttachmentHelper from '../SlackPrompts/notifications/ProviderNotifications/helper';
import { driverService } from '../../drivers/driver.service';
import { providerService } from '../../providers/provider.service';
import DriverNotifications from '../SlackPrompts/notifications/DriverNotifications/driver.notifications';
import { homebaseService } from '../../homebases/homebase.service';
import { routeBatchService } from '../../routeBatches/routeBatch.service';
import { cabService } from '../../cabs/cab.service';


class ProvidersController {
  static async saveRoute(updatedRequest, submission, userId) {
    const { busStop, routeImageUrl } = updatedRequest;
    const {
      routeName, routeCapacity, takeOffTime,
    } = submission;
    const data = {
      destinationName: busStop.address,
      imageUrl: routeImageUrl,
      name: routeName,
      capacity: routeCapacity,
      takeOff: takeOffTime,
      status: 'Active',
    };
    const batch = await routeService.createRouteBatch(data);
    await Promise.all([
      routeService.addUserToRoute(batch.id, userId),
    ]);
    return batch;
  }

  /**
   * @method handleProviderRouteApproval
   * @description this method handles further actions after the provider assigns a driver and cab
   * @param {object} payload
   */
  static async handleProviderRouteApproval(payload, respond) {
    try {
      const {
        team: { id: teamId },
        submission: { driver: driverId, cab: cabId },
        state
      } = payload;
      const { capacity } = await cabService.getById(cabId);
      const { tripId: routeBatchId, channel, timeStamp } = JSON.parse(state);
      await routeBatchService.updateRouteBatch(routeBatchId, { driverId, cabId, capacity });
      const routeBatch = await routeBatchService.getRouteBatchByPk(routeBatchId, true);
      const { cabDetails: { providerId }, route: { name: routeName }, riders } = routeBatch;
      const { name } = await providerService.findByPk(providerId);
      const attachment = await ProvidersController.getMessageAttachment(routeBatch);
      const { botToken } = await teamDetailsService.getTeamDetails(teamId);
      const { channel: opsChannelId } = await homebaseService.getHomeBaseBySlackId(payload.user.id);
      if (riders[0]) {
        await ProvidersController.sendUserProviderAssignMessage(
          riders, botToken, routeName, attachment
        );
      }
      await ProvidersController.sendNotifications(
        name, routeName, botToken, opsChannelId, attachment,
        channel, timeStamp, routeBatch,
      );
    } catch (err) {
      respond(new SlackInteractiveMessage(err.message));
    }
  }

  static async sendNotifications(
    providerName, routeName, botToken, opsChannelId, attachment, channel, timeStamp, routeBatch,
  ) {
    const opsNotification = ProvidersController.sendOpsProviderAssignMessage(
      providerName, routeName, botToken, opsChannelId, attachment
    );
    const updateNotification = ProviderNotifications.updateRouteApprovalNotification(
      channel, botToken, timeStamp, attachment
    );
    const driverNotification = DriverNotifications.sendRouteAssignment(routeBatch, botToken);
    return Promise.all([opsNotification, updateNotification, driverNotification]);
  }

  /**
   * @method sendOpsProviderAssignMessage
   * @description sends operations provioder approval message
   * @param {string} providerName
   * @param {string} routeName
   * @param {string} botToken
   * @param {string} opsChannelId
   * @param {object} attachment
   */
  static async sendOpsProviderAssignMessage(
    providerName, routeName, botToken, opsChannelId, attachment
  ) {
    const message = SlackNotifications.createDirectMessage(
      opsChannelId,
      `*${providerName}* has assigned a cab and a driver to route "*${routeName}*". :smiley:`,
      [attachment]
    );
    return SlackNotifications.sendNotification(message, botToken);
  }

  /**
   * @method sendUserProviderAssignMessage
   * @description sends users that joined the route a
   * message after the provider assigns a driver and a cab
   * @param {array} riders users on the route
   * @param {srting} botToken
   * @param {string} routeName
   * @param {object} attachment
   */
  static async sendUserProviderAssignMessage(riders, botToken, routeName, attachment) {
    const userNotifications = riders.map(async (rider) => {
      const { slackId } = rider;
      const directMessageId = await SlackNotifications.getDMChannelId(
        slackId, botToken
      );
      const message = SlackNotifications.createDirectMessage(
        directMessageId,
        `A driver and cab has been assigned to your route "*${routeName}*". :smiley:`,
        [attachment]
      );
      return SlackNotifications.sendNotification(message, botToken);
    });
    await Promise.all(userNotifications);
  }

  static async getMessageAttachment(route) {
    const { driver, cabDetails } = route;
    const routeFields = await ProviderAttachmentHelper.providerRouteFields(route);
    const driverFields = await ProviderAttachmentHelper.driverFields(driver);
    const cabFields = await ProviderAttachmentHelper.cabFields(cabDetails);

    const attachment = new SlackAttachment('Route Creation Complete');
    attachment.addOptionalProps('assignment_notification', 'fallback', '#3AAF85', 'default');
    attachment.addFieldsOrActions('fields', routeFields);
    attachment.addFieldsOrActions('fields', driverFields);
    attachment.addFieldsOrActions('fields', cabFields);

    return attachment;
  }

  static async providerReassignDriver(payload) {
    try {
      const {
        team: { id: teamId },
        channel: { id: channelId },
        original_message: { ts: timestamp }
      } = payload;
      const driverId = payload.actions[0].selected_options[0].value;
      const routeBatchId = payload.actions[0].name;
      await routeBatchService.updateRouteBatch(routeBatchId, { driverId });
      const route = await routeBatchService.getRouteBatchByPk(routeBatchId, true);
      const { riders } = route;
      const driver = await driverService.getDriverById(driverId);
      const botToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
      await ProviderNotifications.updateProviderReasignDriverMessage(
        channelId, botToken, timestamp, route, driver
      );
      const sendNotifications = riders.map((user) => ProvidersController.sendUserRouteUpdateMessage(
        user, route, driver, botToken
      ));
      await Promise.all(sendNotifications);
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static async sendUserRouteUpdateMessage(user, route, driver, botToken) {
    const { slackId } = user;
    const directMessageId = await SlackNotifications.getDMChannelId(
      slackId, botToken
    );
    const attachment = new SlackAttachment();
    attachment.addOptionalProps('', '', '#3c58d7');
    const routeFields = await ProviderAttachmentHelper.providerRouteFields(route);
    const driverFields = await ProviderAttachmentHelper.driverFields(driver);
    attachment.addFieldsOrActions('fields', routeFields);
    attachment.addFieldsOrActions('fields', driverFields);
    const message = SlackNotifications.createDirectMessage(directMessageId,
      'A new driver has been assigned to your route. :smiley:', [attachment]);
    return SlackNotifications.sendNotification(message, botToken);
  }


  static async handleCabReAssigmentNotification(payload, respond) {
    const {
      team: { id: teamId },
      channel: { id: channelId },
      original_message: { ts: timestamp },
    } = payload;
    try {
      const cabId = payload.actions[0].selected_options[0].value;
      const cab = await cabService.getById(cabId);
      const routeBatchId = payload.actions[0].name;
      await routeBatchService.updateRouteBatch(routeBatchId, { cabId: cab.id });
      const route = await routeBatchService.getRouteBatchByPk(routeBatchId, true);
      const { riders: users } = route;
      const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
      await ProviderNotifications.updateProviderReAssignCabMessage(channelId, slackBotOauthToken,
        timestamp, route, cab);
      await users.forEach((user) => ProvidersController.sendUserUpdatedRouteMessage(user, route,
        cab, slackBotOauthToken));
    } catch (error) {
      bugsnagHelper.log(error);
      respond(
        new SlackInteractiveMessage('Unsuccessful request. Kindly Try again')
      );
    }
  }

  static async sendUserUpdatedRouteMessage(user, route, cab, slackBotOauthToken) {
    const channelId = await SlackNotifications.getDMChannelId(user.slackId, slackBotOauthToken);
    const attachment = new SlackAttachment();
    const routeFields = await ProviderAttachmentHelper.providerRouteFields(route);
    const cabFields = await ProviderAttachmentHelper.cabFields(cab);
    attachment.addFieldsOrActions('fields', routeFields);
    attachment.addFieldsOrActions('fields', cabFields);
    const message = SlackNotifications.createDirectMessage(channelId,
      '*A new cab has been assigned to your route* :smiley:', [attachment]);
    return SlackNotifications.sendNotification(message, slackBotOauthToken);
  }
}

export default ProvidersController;
