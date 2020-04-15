import { IncomingWebhook } from '@slack/client';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import WebClientSingleton from '../../../utils/WebClientSingleton';
import {
  SlackAttachment,
  SlackAttachmentField,
  SlackButtonAction,
  SlackInteractiveMessage,
  SlackCancelButtonAction,
} from '../SlackModels/SlackMessageModels';
import NotificationsResponse from './NotificationsResponse';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import { departmentService } from '../../departments/department.service';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import RouteRequestService from '../../routes/route-request.service';
import AttachmentHelper from './notifications/AttachmentHelper';
import tripService from '../../trips/trip.service';
import CleanData from '../../../helpers/cleanData';
import { getSlackDateString } from '../helpers/dateHelpers';
import Cache from '../../shared/cache';
import { homebaseService } from '../../homebases/homebase.service';
import {
  BlockMessage, MarkdownText, SectionBlock, ActionBlock, ButtonElement, SlackText, TextTypes
} from '../../new-slack/models/slack-block-models';
import { sectionDivider } from '../../new-slack/helpers/slack-helpers';
import OpsTripHelpers from '../../new-slack/trips/ops/trips.helper';
import { TripTypes } from '../../../database/models/trip-request';
import Interactions from '../../new-slack/trips/manager/interactions';
import providerMonthlyReport, { CommChannel } from '../../report/providerMonthlyReport';
import userService from '../../users/user.service';

const slackErrorMessage = new SlackInteractiveMessage(
  'An error occurred while processing your request. '
  + 'Please contact the administrator.', [], undefined, '#b52833'
);

class SlackNotifications {
  static async getDMChannelId(user, botToken) {
    const { channel: { id } } = await WebClientSingleton.getWebClient(botToken)
      .im
      .open({
        user
      });
    return id;
  }

  static async sendNotifications(channelId, attachments, text, teamBotOauthToken) {
    await WebClientSingleton.getWebClient(teamBotOauthToken)
      .chat
      .postMessage({
        channel: channelId,
        text,
        attachments: [attachments]
      });
  }

  static async getCancelAttachment(newTripRequest, channelId, requester, rider) {
    const text = 'cancelled this';
    const mainBlock = new SectionBlock()
      .addText(new MarkdownText('*Trip Request Details*'));
    const fields = await SlackNotifications.notificationFields(newTripRequest);
    mainBlock.addFields(fields);

    const msg = await SlackNotifications.getMessage(rider.slackId, requester.slackId, text);
    const header = new SectionBlock().addText(new MarkdownText(msg));
    return new BlockMessage([header, sectionDivider, mainBlock], channelId, msg);
  }

  static async getMessage(riderId, requesterId, text) {
    const smiley = text === 'cancelled this' ? '' : ' :smiley:';
    if (requesterId === riderId) {
      return `Hey, <@${requesterId}> has just ${text} trip.${smiley}`;
    }
    return `Hey, <@${requesterId}> has just ${text} trip for <@${
      riderId}>.${smiley}`;
  }

  static getOpsMessageAttachment(trip, opsChannelId) {
    const {
      requester: { slackId: requesterSlackId },
      rider: { slackId: riderSlackId },
      department: { head: { slackId: lineManagerSlackId } }
    } = trip;
    const mainBlock = new SectionBlock()
      .addText(new MarkdownText('*Trip Request*'));
    const fields = SlackNotifications.notificationFields(trip);
    mainBlock.addFields(fields);
    const msg = requesterSlackId === riderSlackId
      ? `Hey, <@${requesterSlackId}> has just requested a trip. It is awaiting approval from <@${lineManagerSlackId}> :smiley:`
      : `Hey, <@${requesterSlackId}> has just requested a trip for <@${
        riderSlackId}>. It is awaiting approval from <@${lineManagerSlackId}> :smiley:`;
    const header = new SectionBlock().addText(new MarkdownText(msg));
    return new BlockMessage([header, sectionDivider, mainBlock], opsChannelId, msg);
  }

  static async sendOperationsTripRequestNotification(trip, botToken) {
    try {
      if (trip.tripType === TripTypes.regular) {
        await Interactions.sendRequesterApprovedNotification(trip, botToken);
      }
      const tripCopy = { ...trip, pickup: trip.origin };
      const message = await NotificationsResponse.getOpsTripRequestMessage(tripCopy);
      await SlackNotifications.sendNotification(message, botToken);
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  // This function is used to send a notification to a manager when Ops approved
  static async OpsApprovedNotification(trip, botToken) {
    try {
      const imResponse = await WebClientSingleton.getWebClient(botToken)
        .im
        .open({
          user: trip.department.head.slackId
        });
      const response = OpsTripHelpers.getOpsApprovalMessageForManager(trip, imResponse.channel.id);
      SlackNotifications.sendNotification(response, botToken);
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }


  static async sendOpsTripRequestNotification(trip, props) {
    try {
      const { opsRequestMessage, botToken } = await SlackNotifications
        .opsNotificationMessage(props.teamId, trip);
      await SlackNotifications.sendNotification(opsRequestMessage, botToken);
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static async sendOpsApprovalNotification(trip, botToken) {
    const { channel: opsChannelId } = await homebaseService.getById(trip.homebaseId);
    const delayedTripMessage = await OpsTripHelpers.getDelayedTripApprovalMessage(trip,
      opsChannelId);
    return SlackNotifications.sendNotification(delayedTripMessage, botToken);
  }

  static async opsNotificationMessage(teamId, trip) {
    const { botToken } = await teamDetailsService.getTeamDetails(teamId);
    const opsRequestMessage = SlackNotifications.getOpsMessageAttachment(
      trip, trip.homebase.channel, trip.department.head.slackId
    );
    return { opsRequestMessage, botToken };
  }

  static async sendNotification(response, teamBotOauthToken) {
    return WebClientSingleton.getWebClient(teamBotOauthToken)
      .chat
      .postMessage(response);
  }

  static async sendWebhookPushMessage(webhookUrl, message) {
    const webhook = new IncomingWebhook(webhookUrl);
    return webhook.send(message);
  }

  static async sendRequesterDeclinedNotification(trip, botToken) {
    try {
      const { requester: { slackId }, rider: { slackId: riderSlackId } } = trip;
      const riderChannel = await SlackNotifications.getDMChannelId(riderSlackId, botToken);
      const riderMessage = SlackNotifications.getDeclinedNotificationMessage(trip, riderChannel);
      await SlackNotifications.sendNotification(riderMessage, botToken);
      if (trip.riderId !== trip.requestedById) {
        const requesterChannel = await SlackNotifications.getDMChannelId(slackId, botToken);
        const requesterMessage = SlackNotifications.getDeclinedNotificationMessage(trip, requesterChannel);
        await SlackNotifications.sendNotification(requesterMessage, botToken);
      }
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static getDeclinedNotificationMessage(trip, channelId) {
    const fields = SlackNotifications.notificationFields(trip);
    const mainBlock = new SectionBlock()
      .addText(new MarkdownText('*Declined Trip Request*'))
      .addFields(fields);
    const message = `Sorry, <@${trip.decliner.slackId}> has just declined your trip. :disappointed:`;
    const header = new SectionBlock().addText(new MarkdownText(message));
    return new BlockMessage([header, sectionDivider, mainBlock], channelId, message);
  }

  static createDirectMessage(channelId, text, payload) {
    let attachments = [payload];
    if (payload instanceof Array) {
      attachments = payload;
    }
    return {
      channel: channelId,
      text,
      attachments
    };
  }

  static async sendManagerConfirmOrDeclineNotification(
    teamId, userId, tripInformation, decline
  ) {
    const { headId } = tripInformation.department;
    const headOfDepartment = await SlackHelpers.findUserByIdOrSlackId(headId);
    const rider = tripInformation.rider.slackId;
    const { slackId } = headOfDepartment;
    const messageBaseOnDecline = SlackNotifications.getMessageBaseOnDeclineOrConfirm(decline);
    const message = `The trip you approved for <@${rider}> trip has been ${messageBaseOnDecline}`;
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    const channelId = await SlackNotifications.getDMChannelId(slackId, slackBotOauthToken);
    const label = !decline ? '*Confirmed Trip Request*' : '*Declined Trip Request*';
    const header = new SectionBlock().addText(new MarkdownText(label));
    const footer = new SectionBlock().addText(new MarkdownText(message));
    const detailsBlocks = SlackNotifications.getDetailsBlock(tripInformation, userId, decline);
    const blkMsg = new BlockMessage([header,
      sectionDivider, ...detailsBlocks, sectionDivider, footer], channelId, label);
    return SlackNotifications.sendNotification(blkMsg, slackBotOauthToken);
  }

  static getDetailsBlock(tripInformation, userId, decline) {
    const fields = SlackNotifications.generateNotificationFields(decline ? 'Declined' : 'Confirmed',
      tripInformation, userId);
    return fields;
  }

  static getMessageBaseOnDeclineOrConfirm(decline) {
    if (!decline) {
      return 'confirmed. :smiley:';
    }
    return 'declined :disappointed:';
  }

  static async sendUserConfirmOrDeclineNotification(
    teamId, userId, tripInformation, decline, opsStatus
  ) {
    const { requester: { slackId: requester }, rider: { slackId: rider } } = tripInformation;
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    const label = !decline ? '*Confirmed Trip Request*' : '*Declined Trip Request*';
    const confirmedOrDeclined = await SlackNotifications.getMessageBaseOnDeclineOrConfirm(decline);
    const message = await SlackNotifications.createUserConfirmOrDeclineMessage(opsStatus,
      confirmedOrDeclined);
    const header = new SectionBlock().addText(new MarkdownText(label));
    const main = SlackNotifications.getDetailsBlock(tripInformation, userId, decline);
    const footer = new SectionBlock().addText(message);

    const blkMessage = (channelId) => new BlockMessage([header, sectionDivider, ...main,
      sectionDivider, footer], channelId, message);

    await SlackNotifications.sendUserPostOpMessage({
      botToken: slackBotOauthToken,
      slackId: rider,
      blkMessage
    });

    if (requester !== rider) {
      await SlackNotifications.sendUserPostOpMessage({
        botToken: slackBotOauthToken,
        slackId: requester,
        blkMessage,
      });
    }
  }

  static async sendUserPostOpMessage({
    botToken, slackId, blkMessage,
  }) {
    const channelId = await SlackNotifications.getDMChannelId(slackId, botToken);
    const blkMsg = blkMessage(channelId);
    return SlackNotifications.sendNotification(blkMsg, botToken);
  }

  static async createUserConfirmOrDeclineMessage(opsStatus, confirmedOrDeclined, rider) {
    const message = `has been ${confirmedOrDeclined}${opsStatus ? ', and it is awaiting driver and vehicle assignment' : ''}`;
    if (rider) return `The trip you requested for <@${rider}> ${message}`;
    return `Your trip ${message}`;
  }

  static async sendRiderlocationConfirmNotification(payload) {
    const {
      location, teamID, userID, rider
    } = payload;
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamID);
    const label = `Travel ${location} Location Confirmation`;
    const attachment = new SlackAttachment(label, '', '', '', '', 'default', 'warning');
    const actions = [
      new SlackButtonAction('riderLocationBtn', `Submit ${location}`, `${location}_riderLocation`),
      new SlackCancelButtonAction(
        'Cancel Travel Request',
        'cancel',
        'Are you sure you want to cancel this travel request',
        'cancel_request'
      )
    ];
    attachment.addFieldsOrActions('actions', actions);
    attachment.addOptionalProps('travel_trip_riderLocationConfirmation',
      'fallback', undefined, 'default');
    const channelId = await SlackNotifications.getDMChannelId(rider, slackBotOauthToken);
    const letterMessage = `You are hereby Requested by <@${userID}> to provide `
      + `your ${location} location`;
    SlackNotifications.sendNotifications(channelId, attachment, letterMessage, slackBotOauthToken);
  }

  static async sendOperationsRiderlocationConfirmation(payload, respond) {
    const {
      riderID, teamID, confirmedLocation, waitingRequester, location
    } = payload;
    try {
      const { botToken: slackBotOauthToken } = await teamDetailsService.getTeamDetails(teamID);
      const { channel: opsChannelId } = await homebaseService.getHomeBaseBySlackId(riderID);
      SlackNotifications.OperationsRiderlocationConfirmationMessage({
        waitingRequester,
        riderID,
        location,
        confirmedLocation,
        opsChannelId,
        slackBotOauthToken
      });
    } catch (error) {
      bugsnagHelper.log(error);
      respond(slackErrorMessage);
    }
  }

  static OperationsRiderlocationConfirmationMessage(messageData) {
    const {
      waitingRequester, riderID, location, confirmedLocation, opsChannelId, slackBotOauthToken
    } = messageData;
    const attachment = new SlackAttachment(
      `Hello <@${waitingRequester}> :smiley:, <@${riderID}>`
      + ` just confirmed the ${location} location`,
      `The entered ${location} location is ${confirmedLocation}`,
      '', '', '', 'default', 'warning'
    );
    const letterMessage = `Tembea travel ${location} confirmation`;
    SlackNotifications.sendNotifications(opsChannelId,
      attachment, letterMessage, slackBotOauthToken);
  }

  static notificationFields(tripInformation) {
    const {
      origin: { address: pickup },
      destination: { address: destination },
      rider: { name: passenger, phoneNo: riderPhoneNumber },
      createdAt,
      departureTime,
      reason,
      tripNote,
      noOfPassengers,
      driver,
      cab
    } = tripInformation;

    const userAttachment = SlackNotifications.cabDriverDetailsNotification(cab, driver,
      departureTime, destination, pickup);
    const result = (!(cab && driver)) ? [
      new MarkdownText(`*Pickup Location*:\n${pickup}`),
      new MarkdownText(`*Destination*:\n${destination}`),
      new MarkdownText(`*Request Date*:\n${getSlackDateString(createdAt)}`),
      new MarkdownText(`*Trip Date*:\n${getSlackDateString(departureTime)}`),
      new MarkdownText(`*Reason*:\n${reason}`),
      new MarkdownText(`*No of Passengers*:\n${noOfPassengers}`),
      new MarkdownText(`*Passenger*:\n${passenger}`),
      new MarkdownText(`*Passenger Phone No.*:\n${riderPhoneNumber || 'N/A'}`),
      new MarkdownText(`*Trip Notes*:\n${tripNote || 'N/A'}`),
    ] : userAttachment;
    return result;
  }

  /**
   *
   * @description contains the message attachement that is sent to the rider after a successfully trip request.
   * @static
   * @param {object} cab - The cab information
   * @param {object} driver - The driver's information
   * @param {*} departureTime - The trip's departure trip.
   * @param {*} destination - The trip destination
   * @param {} pickup
   * @returns userAttachement
   * @memberof SlackNotifications
   */
  static cabDriverDetailsNotification(cab, driver, departureTime, destination, pickup) {
    let userAttachment = [];
    if (cab && driver) {
      const { driverName, driverPhoneNo } = driver;
      const { model, regNumber } = cab;
      userAttachment = [
        new MarkdownText(`*Pickup Location*:\n${pickup}`),
        new MarkdownText(`*Destination*:\n${destination}`),
        new MarkdownText(`*Driver Name*:\n${driverName}`),
        new MarkdownText(`*Trip Date*:\n${getSlackDateString(departureTime)}`),
        new MarkdownText(`*Driver Contact*:\n${driverPhoneNo}`),
        new MarkdownText(`*Vehicle Name*:\n${model}`),
        new MarkdownText(`*Vehicle Reg Number*:\n${regNumber}`)
      ];
    }
    return userAttachment;
  }

  /**
   * Generate slack trip notification fields based on the type
   *
   * @static
   * @param {string} type - The type of notification
   * @param {Object} tripInformation - An object containing the trip information
   * @param {string} userId - The user's unique slack identifier
   * @returns {Array} - A list of slack attachments
   * @memberof SlackNotifications
   */
  static generateNotificationFields(type, tripInformation, userId) {
    const { cab, driver } = tripInformation;
    const reason = tripInformation.operationsComment;
    const mainBlock = new SectionBlock();
    const subBlock = new SectionBlock();
    const notifications = SlackNotifications.notificationFields(tripInformation);
    const decliner = new MarkdownText(`${type} by <@${userId}>`);
    const commentField = new MarkdownText(`*Reason*:\n${reason}`);
    const result = [];

    if (!cab && !driver) {
      notifications.unshift(decliner);
      notifications.push(commentField);
    }

    mainBlock.addFields(notifications.slice(0, 8));
    result.push(mainBlock);

    if (notifications.length > 8) {
      subBlock.addFields(notifications.slice(8, notifications.length));
      result.push(subBlock);
    }

    return result;
  }

  static async sendOperationsNotificationFields(routeRequest) {
    const { routeImageUrl, id: routeRequestId, manager } = routeRequest;
    const acceptButton = new SlackButtonAction('approve', 'Approve', routeRequestId);
    const declineButton = new SlackButtonAction('decline', 'Decline', routeRequestId,
      'danger');
    const messageAttachment = new SlackAttachment(undefined, undefined, undefined,
      undefined, routeImageUrl);
    const routeAttachmentFields = AttachmentHelper.routeAttachmentFields(
      routeRequest
    );
    const engagementAttachmentFields = await AttachmentHelper.engagementAttachmentFields(
      routeRequest
    );
    const attachments = [
      new SlackAttachmentField('`Engagement Information`', null, false),
      ...engagementAttachmentFields,
      new SlackAttachmentField('`Manager`', `<@${manager.slackId}>`, false),
      new SlackAttachmentField('`Route Information`', null, false),
      ...routeAttachmentFields
    ];
    messageAttachment.addFieldsOrActions('actions', [acceptButton, declineButton]);
    messageAttachment.addFieldsOrActions('fields', attachments);
    messageAttachment.addOptionalProps('operations_route_actions');
    return messageAttachment;
  }

  static async sendOperationsNewRouteRequest(teamId, routeRequestId) {
    const routeRequestDetails = await RouteRequestService.getRouteRequest(
      routeRequestId
    );
    const {
      engagement: {
        fellow: { slackId: fellow }
      }
    } = routeRequestDetails;
    const messageAttachment = await SlackNotifications.sendOperationsNotificationFields(
      routeRequestDetails
    );
    const { botToken } = await teamDetailsService.getTeamDetails(teamId);
    const { channel: opsChannelId } = await homebaseService.getHomeBaseBySlackId(fellow);

    const notification = await SlackNotifications.sendNotifications(
      opsChannelId,
      messageAttachment,
      `Hey :simple_smile: <@${fellow}> requested a new route`,
      botToken
    );
    await Cache.save(`RouteRequestTimeStamp_${routeRequestId}`, 'timeStamp', notification.ts);

    return notification;
  }

  static async sendManagerCancelNotification(data, tripInfo, respond) {
    try {
      const { team: { id: teamId } } = data;
      const { id, departmentId } = tripInfo;
      const [head, trip, slackBotOauthToken] = await Promise.all([
        departmentService.getHeadByDeptId(departmentId),
        tripService.getById(id, true),
        teamDetailsService.getTeamDetailsBotOauthToken(teamId)
      ]);
      const imResponse = await SlackNotifications.getDMChannelId(head.slackId, slackBotOauthToken);
      const message = await SlackNotifications.getCancelAttachment(
        trip, imResponse, trip.requester, trip.rider
      );
      return SlackNotifications.sendNotification(message, slackBotOauthToken);
    } catch (err) {
      bugsnagHelper.log(err);
      respond({
        text: 'Error:warning:: Request saved, but I could not send a notification to your manager.'
      });
    }
  }

  static async sendOpsCancelNotification(data, trip, respond) {
    try {
      const payload = CleanData.trim(data);
      const { team: { id: teamId } } = payload;
      const { requester, rider } = trip;
      const { botToken } = await teamDetailsService.getTeamDetails(teamId);
      const { channel } = await homebaseService.getHomeBaseBySlackId(requester.slackId);
      const opsRequestMessage = await SlackNotifications.getCancelAttachment(
        trip, channel, requester, rider
      );
      return SlackNotifications.sendNotification(opsRequestMessage, botToken);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(slackErrorMessage);
    }
  }

  static async sendOpsPostRatingMessage(payload) {
    const teamDetails = await teamDetailsService.getTeamDetails(payload.team.id);
    const { botToken, opsChannelId } = teamDetails;
    const mainBlock = new SectionBlock()
      .addText(new MarkdownText('*Trip completed*'));
    const fieldsAttachment = await NotificationsResponse.getOpsTripBlocksFields(parseInt(
      payload.actions[0].value, 0
    ));
    mainBlock.addFields(fieldsAttachment);
    const message = 'Hello Ops Team! The trip below has been completed :white_check_mark:';
    const header = new SectionBlock().addText(new MarkdownText(message));
    SlackNotifications.sendNotification(
      new BlockMessage([header, sectionDivider, mainBlock], opsChannelId, message),
      botToken
    );
  }

  static async sendOpsProvidersTripsReport() {
    const teamUrl = process.env.SLACK_TEAM_URL;
    const { botToken } = await teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
    const opsChannelReport = await providerMonthlyReport.generateData(CommChannel.slack);
    const channelIds = Object.keys(opsChannelReport);
    if (channelIds.length) {
      channelIds.map(async (channelId) => {
        const channelInfo = opsChannelReport[channelId];
        const fieldsAttachment = await NotificationsResponse
          .getOpsProviderTripsFields(channelInfo.providersData);
        const message = `*Hello, ${channelInfo.name} Ops*!\n
        Here is a summary of trips taken by providers in ${channelInfo.month}`;
        const header = new SectionBlock().addText(new MarkdownText(message));
        const totalTrips = `*TOTAL TRIPS* ${channelInfo.total}`;
        const subBlock = new SectionBlock().addText(new MarkdownText(totalTrips));
        SlackNotifications.sendNotification(
          new BlockMessage([header, sectionDivider,
            ...fieldsAttachment, sectionDivider, subBlock], channelId),
          botToken
        );
      });
    }
  }
  
  static async requestFeedbackMessage() {
    const teamUrl = process.env.SLACK_TEAM_URL;
    const { botToken } = await teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
    const feedbackButton = new ButtonElement('Send feedback', 'feedback', 'send_feedback');

    (await userService.getUsersSlackId()).forEach(async (user) => {
      try {
        SlackNotifications.sendNotification(new BlockMessage([
          new SectionBlock().addText(new SlackText(`Hey there *${user.name}*, please send your weekly feedback`,
            TextTypes.markdown)),
          new ActionBlock('send_feedback').addElements([feedbackButton]),
        ], user.slackId), botToken);
      } catch (err) {
        bugsnagHelper.log(err);
      }
    });
  }
}

export default SlackNotifications;
