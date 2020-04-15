import {
  MarkdownText, TextTypes, Block, BlockMessage, BlockTypes, SectionBlock, SlackText,
} from '../../../../new-slack/models/slack-block-models';
import { getSlackDateString } from '../../../helpers/dateHelpers';
import { ITripRequest } from '../../../../../database/models/interfaces/trip-request.interface';
import WhatsappService from '../../../../../modules/notifications/whatsapp/whatsapp.service';
import schemas from './../../../../../middlewares/ValidationSchemas';

const { phoneNoRegex } = schemas;

export interface IWhatsappMessage {
  body: string;
  to: string;
}
import { IRouteBatch } from '../../../../../database/models/interfaces/route-batch.interface';

export default class DriverNotificationHelper {
  /**
   Returns a trip Attachment to be sent to driver
   * @param {object} trip object
   */
  static tripApprovalAttachment(trip: ITripRequest) {
    const {
      origin, destination, rider: { slackId, phoneNo },
      departureTime, distance, department: { name }, driverSlackId, noOfPassengers,
    } = trip;
    const fields: MarkdownText[] = [
      new MarkdownText(`*Take Off time* \n ${getSlackDateString(departureTime)}`),
      new MarkdownText(`*Passenger* \n  <@${slackId}> `),
      new MarkdownText(`*Department* \n ${name}`),
      new MarkdownText(`*PickUp Location* \n ${origin.address}`),
      new MarkdownText(`*Destination* \n ${destination.address}`),
      new MarkdownText(`*No of Passengers* \n ${noOfPassengers}`),
      new MarkdownText(`*Phone Number*\n ${phoneNo || 'N/A'}`),
      new MarkdownText(`*Distance* ${distance}`)];
    const header = new Block(BlockTypes.section)
      .addText(new MarkdownText('*New Trip Notification*'));
    const body = new SectionBlock()
      .addText(new MarkdownText(`Hey <@${driverSlackId}> You have an upcoming trip :smiley:`))
      .addFields(fields);
    const blocks = [header, body];
    return blocks;
  }

  static async notifyDriverOnWhatsApp(trip: ITripRequest) {
    const {
      origin, destination, rider, driver,
    } = trip;
    // Send notification to the driver on WhatsApp
    if (phoneNoRegex.test(driver.driverPhoneNo)) {
      const message = {
        body: `Hello ${driver.driverName},\n Your trip with *${rider.name}* from *${origin.address}* to *${destination.address}* is in the next 10 minutes. Enjoy!`,
        to: `${driver.driverPhoneNo}`,
      };
      await WhatsappService.send(message);
    }
  }

  static routeApprovalAttachment(routeBatch: IRouteBatch) {
    const {
    takeOff, route, driver,
  } = routeBatch;
    const header = new Block(BlockTypes.section)
    .addText(new MarkdownText('*New Route Notification*'));
    const body = new Block(BlockTypes.section)
    .addText(new MarkdownText(`Hello <@${driver.user.slackId}> you have been assigned to the route *${route.name}* which takes off at *${takeOff}* daily.
    Please liaise with Ops or your Provider for clarity. Thanks `));
    const blocks = [header, body];
    return blocks;
  }
}
