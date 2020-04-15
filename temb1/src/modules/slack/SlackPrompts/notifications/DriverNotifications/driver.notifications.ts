import Notifications from '../../Notifications';
import driverNotificationsHelper from './driver.notifications.helper';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import DriverService from '../../../../drivers/driver.service';
import { ITripRequest } from '../../../../../database/models/interfaces/trip-request.interface';
import { IDriver } from '.../../../database/models/interfaces/driver.interface';
import whatsappService from '../../../../../modules/notifications/whatsapp/whatsapp.service';
import { IRouteBatch } from '../../../../../database/models/interfaces/route-batch.interface';
import schemas from './../../../../../middlewares/ValidationSchemas';
import { BlockMessage } from '../../../../new-slack/models/slack-block-models';
import BugsnagHelper from '../../../../../helpers/bugsnagHelper';

const { phoneNoRegex } = schemas;

export default class DriverNotifications {
  /**
   * Sends Driver notification for trip Assigned
   * @param {string} teamId to get team bot token
   * @param {object} trip requested approved
   * @param {string} driverSlackId of the driver assigned
   */
  static async sendDriverTripApproveOnSlack(
    teamId: string, trip: ITripRequest, driverSlackId: string,
  ) {
    const tripData = { ...trip, driverSlackId };
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    const blocks = driverNotificationsHelper.tripApprovalAttachment(tripData);
    const imResponse = await Notifications.getDMChannelId(driverSlackId, slackBotOauthToken);
    const message = new BlockMessage(blocks, imResponse, 'You have been assigned a trip');
    return Notifications.sendNotification(message, slackBotOauthToken);
  }

  /**
   Check if the driver has a slack Id and a notification is send to them
   * @param {object} id id of specified driver
   * @param {String} teamId to get team bot token
   * @param {object} trip
   */
  static async checkAndNotifyDriver(id: number, teamId: string, trip: ITripRequest) {
    try {
      const driver = await DriverService.findOneDriver({ where: { id } })  as IDriver;
      if (driver.userId) {
        await DriverNotifications.sendDriverTripApproveOnSlack(teamId, trip, driver.user.slackId);
        return;
      }
      if (phoneNoRegex.test(driver.driverPhoneNo)) {
        await whatsappService.send(
          DriverNotifications.getTripAssignmentWhatsappMessage(driver, trip),
        );
      }
    } catch (err) {
      BugsnagHelper.log(err);
    }
  }

  static getTripAssignmentWhatsappMessage(driver: IDriver, trip: ITripRequest) {
    return {
      to: driver.driverPhoneNo,
      body: `Hey ${driver.driverName},\n
        You have been assigned the trip with the following details\n
        *Pickup Location*: ${trip.origin.address}\n
        *Destination*: ${trip.destination.address}\n
        *Pickup Time*: ${trip.departureTime}\n
        *Passenger Name*: ${trip.rider.name}\n
        *Passenger Phone No*: ${trip.rider.phoneNo}\n\n
        We wish you a safe trip.`,
    };
  }

   /**
   * Sends Driver notification for trip Assigned
   * @param {string} teamId to get team bot token
   * @param {object} Route requested approved
   * @param {string} driverSlackId of the driver assigned
   */
  static async sendRouteAssignment(routeBatch: IRouteBatch, botToken: string) {
    if (routeBatch.driver.userId) {
      const blocks = driverNotificationsHelper.routeApprovalAttachment(routeBatch);
      const imResponse = await Notifications.getDMChannelId(
        routeBatch.driver.user.slackId, botToken);
      const message = new BlockMessage(blocks, imResponse, 'New Route Assigned');
      await Notifications.sendNotification(message, botToken);
    } else {
      const { driver } = routeBatch;
      const waMessage = DriverNotifications.getRouteAssignmentWhatsappMessage(routeBatch);
      await whatsappService.send(waMessage);
    }
  }

  static getRouteAssignmentWhatsappMessage(routeBatch: IRouteBatch) {
    const { driver, route } = routeBatch;
    const checkPhoneNo = phoneNoRegex.test(driver.driverPhoneNo);
    if (checkPhoneNo) {
      return {
        to: driver.driverPhoneNo,
        body: `Hello *${driver.driverName}*, `
            + `you have been assigned to the route *${route.name}* `
            + `which takes off at *${routeBatch.takeOff}* daily. Please liaise with Ops or your Provider for clarity.
            Thanks `,
      };
    }
  }
}
