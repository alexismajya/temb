"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@slack/client");
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const WebClientSingleton_1 = __importDefault(require("../../../utils/WebClientSingleton"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const NotificationsResponse_1 = __importDefault(require("./NotificationsResponse"));
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const department_service_1 = require("../../departments/department.service");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const route_request_service_1 = __importDefault(require("../../routes/route-request.service"));
const AttachmentHelper_1 = __importDefault(require("./notifications/AttachmentHelper"));
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const cleanData_1 = __importDefault(require("../../../helpers/cleanData"));
const dateHelpers_1 = require("../helpers/dateHelpers");
const cache_1 = __importDefault(require("../../shared/cache"));
const homebase_service_1 = require("../../homebases/homebase.service");
const slack_block_models_1 = require("../../new-slack/models/slack-block-models");
const slack_helpers_1 = require("../../new-slack/helpers/slack-helpers");
const trips_helper_1 = __importDefault(require("../../new-slack/trips/ops/trips.helper"));
const trip_request_1 = require("../../../database/models/trip-request");
const interactions_1 = __importDefault(require("../../new-slack/trips/manager/interactions"));
const providerMonthlyReport_1 = __importStar(require("../../report/providerMonthlyReport"));
const user_service_1 = __importDefault(require("../../users/user.service"));
const slackErrorMessage = new SlackMessageModels_1.SlackInteractiveMessage('An error occurred while processing your request. '
    + 'Please contact the administrator.', [], undefined, '#b52833');
class SlackNotifications {
    static getDMChannelId(user, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel: { id } } = yield WebClientSingleton_1.default.getWebClient(botToken)
                .im
                .open({
                user
            });
            return id;
        });
    }
    static sendNotifications(channelId, attachments, text, teamBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield WebClientSingleton_1.default.getWebClient(teamBotOauthToken)
                .chat
                .postMessage({
                channel: channelId,
                text,
                attachments: [attachments]
            });
        });
    }
    static getCancelAttachment(newTripRequest, channelId, requester, rider) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = 'cancelled this';
            const mainBlock = new slack_block_models_1.SectionBlock()
                .addText(new slack_block_models_1.MarkdownText('*Trip Request Details*'));
            const fields = yield SlackNotifications.notificationFields(newTripRequest);
            mainBlock.addFields(fields);
            const msg = yield SlackNotifications.getMessage(rider.slackId, requester.slackId, text);
            const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(msg));
            return new slack_block_models_1.BlockMessage([header, slack_helpers_1.sectionDivider, mainBlock], channelId, msg);
        });
    }
    static getMessage(riderId, requesterId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const smiley = text === 'cancelled this' ? '' : ' :smiley:';
            if (requesterId === riderId) {
                return `Hey, <@${requesterId}> has just ${text} trip.${smiley}`;
            }
            return `Hey, <@${requesterId}> has just ${text} trip for <@${riderId}>.${smiley}`;
        });
    }
    static getOpsMessageAttachment(trip, opsChannelId) {
        const { requester: { slackId: requesterSlackId }, rider: { slackId: riderSlackId }, department: { head: { slackId: lineManagerSlackId } } } = trip;
        const mainBlock = new slack_block_models_1.SectionBlock()
            .addText(new slack_block_models_1.MarkdownText('*Trip Request*'));
        const fields = SlackNotifications.notificationFields(trip);
        mainBlock.addFields(fields);
        const msg = requesterSlackId === riderSlackId
            ? `Hey, <@${requesterSlackId}> has just requested a trip. It is awaiting approval from <@${lineManagerSlackId}> :smiley:`
            : `Hey, <@${requesterSlackId}> has just requested a trip for <@${riderSlackId}>. It is awaiting approval from <@${lineManagerSlackId}> :smiley:`;
        const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(msg));
        return new slack_block_models_1.BlockMessage([header, slack_helpers_1.sectionDivider, mainBlock], opsChannelId, msg);
    }
    static sendOperationsTripRequestNotification(trip, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trip.tripType === trip_request_1.TripTypes.regular) {
                    yield interactions_1.default.sendRequesterApprovedNotification(trip, botToken);
                }
                const tripCopy = Object.assign(Object.assign({}, trip), { pickup: trip.origin });
                const message = yield NotificationsResponse_1.default.getOpsTripRequestMessage(tripCopy);
                yield SlackNotifications.sendNotification(message, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static OpsApprovedNotification(trip, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imResponse = yield WebClientSingleton_1.default.getWebClient(botToken)
                    .im
                    .open({
                    user: trip.department.head.slackId
                });
                const response = trips_helper_1.default.getOpsApprovalMessageForManager(trip, imResponse.channel.id);
                SlackNotifications.sendNotification(response, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static sendOpsTripRequestNotification(trip, props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { opsRequestMessage, botToken } = yield SlackNotifications
                    .opsNotificationMessage(props.teamId, trip);
                yield SlackNotifications.sendNotification(opsRequestMessage, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static sendOpsApprovalNotification(trip, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel: opsChannelId } = yield homebase_service_1.homebaseService.getById(trip.homebaseId);
            const delayedTripMessage = yield trips_helper_1.default.getDelayedTripApprovalMessage(trip, opsChannelId);
            return SlackNotifications.sendNotification(delayedTripMessage, botToken);
        });
    }
    static opsNotificationMessage(teamId, trip) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
            const opsRequestMessage = SlackNotifications.getOpsMessageAttachment(trip, trip.homebase.channel, trip.department.head.slackId);
            return { opsRequestMessage, botToken };
        });
    }
    static sendNotification(response, teamBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return WebClientSingleton_1.default.getWebClient(teamBotOauthToken)
                .chat
                .postMessage(response);
        });
    }
    static sendWebhookPushMessage(webhookUrl, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = new client_1.IncomingWebhook(webhookUrl);
            return webhook.send(message);
        });
    }
    static sendRequesterDeclinedNotification(trip, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { requester: { slackId }, rider: { slackId: riderSlackId } } = trip;
                const riderChannel = yield SlackNotifications.getDMChannelId(riderSlackId, botToken);
                const riderMessage = SlackNotifications.getDeclinedNotificationMessage(trip, riderChannel);
                yield SlackNotifications.sendNotification(riderMessage, botToken);
                if (trip.riderId !== trip.requestedById) {
                    const requesterChannel = yield SlackNotifications.getDMChannelId(slackId, botToken);
                    const requesterMessage = SlackNotifications.getDeclinedNotificationMessage(trip, requesterChannel);
                    yield SlackNotifications.sendNotification(requesterMessage, botToken);
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static getDeclinedNotificationMessage(trip, channelId) {
        const fields = SlackNotifications.notificationFields(trip);
        const mainBlock = new slack_block_models_1.SectionBlock()
            .addText(new slack_block_models_1.MarkdownText('*Declined Trip Request*'))
            .addFields(fields);
        const message = `Sorry, <@${trip.decliner.slackId}> has just declined your trip. :disappointed:`;
        const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(message));
        return new slack_block_models_1.BlockMessage([header, slack_helpers_1.sectionDivider, mainBlock], channelId, message);
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
    static sendManagerConfirmOrDeclineNotification(teamId, userId, tripInformation, decline) {
        return __awaiter(this, void 0, void 0, function* () {
            const { headId } = tripInformation.department;
            const headOfDepartment = yield slackHelpers_1.default.findUserByIdOrSlackId(headId);
            const rider = tripInformation.rider.slackId;
            const { slackId } = headOfDepartment;
            const messageBaseOnDecline = SlackNotifications.getMessageBaseOnDeclineOrConfirm(decline);
            const message = `The trip you approved for <@${rider}> trip has been ${messageBaseOnDecline}`;
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            const channelId = yield SlackNotifications.getDMChannelId(slackId, slackBotOauthToken);
            const label = !decline ? '*Confirmed Trip Request*' : '*Declined Trip Request*';
            const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(label));
            const footer = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(message));
            const detailsBlocks = SlackNotifications.getDetailsBlock(tripInformation, userId, decline);
            const blkMsg = new slack_block_models_1.BlockMessage([header,
                slack_helpers_1.sectionDivider, ...detailsBlocks, slack_helpers_1.sectionDivider, footer], channelId, label);
            return SlackNotifications.sendNotification(blkMsg, slackBotOauthToken);
        });
    }
    static getDetailsBlock(tripInformation, userId, decline) {
        const fields = SlackNotifications.generateNotificationFields(decline ? 'Declined' : 'Confirmed', tripInformation, userId);
        return fields;
    }
    static getMessageBaseOnDeclineOrConfirm(decline) {
        if (!decline) {
            return 'confirmed. :smiley:';
        }
        return 'declined :disappointed:';
    }
    static sendUserConfirmOrDeclineNotification(teamId, userId, tripInformation, decline, opsStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requester: { slackId: requester }, rider: { slackId: rider } } = tripInformation;
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            const label = !decline ? '*Confirmed Trip Request*' : '*Declined Trip Request*';
            const confirmedOrDeclined = yield SlackNotifications.getMessageBaseOnDeclineOrConfirm(decline);
            const message = yield SlackNotifications.createUserConfirmOrDeclineMessage(opsStatus, confirmedOrDeclined);
            const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(label));
            const main = SlackNotifications.getDetailsBlock(tripInformation, userId, decline);
            const footer = new slack_block_models_1.SectionBlock().addText(message);
            const blkMessage = (channelId) => new slack_block_models_1.BlockMessage([header, slack_helpers_1.sectionDivider, ...main,
                slack_helpers_1.sectionDivider, footer], channelId, message);
            yield SlackNotifications.sendUserPostOpMessage({
                botToken: slackBotOauthToken,
                slackId: rider,
                blkMessage
            });
            if (requester !== rider) {
                yield SlackNotifications.sendUserPostOpMessage({
                    botToken: slackBotOauthToken,
                    slackId: requester,
                    blkMessage,
                });
            }
        });
    }
    static sendUserPostOpMessage({ botToken, slackId, blkMessage, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelId = yield SlackNotifications.getDMChannelId(slackId, botToken);
            const blkMsg = blkMessage(channelId);
            return SlackNotifications.sendNotification(blkMsg, botToken);
        });
    }
    static createUserConfirmOrDeclineMessage(opsStatus, confirmedOrDeclined, rider) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `has been ${confirmedOrDeclined}${opsStatus ? ', and it is awaiting driver and vehicle assignment' : ''}`;
            if (rider)
                return `The trip you requested for <@${rider}> ${message}`;
            return `Your trip ${message}`;
        });
    }
    static sendRiderlocationConfirmNotification(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, teamID, userID, rider } = payload;
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamID);
            const label = `Travel ${location} Location Confirmation`;
            const attachment = new SlackMessageModels_1.SlackAttachment(label, '', '', '', '', 'default', 'warning');
            const actions = [
                new SlackMessageModels_1.SlackButtonAction('riderLocationBtn', `Submit ${location}`, `${location}_riderLocation`),
                new SlackMessageModels_1.SlackCancelButtonAction('Cancel Travel Request', 'cancel', 'Are you sure you want to cancel this travel request', 'cancel_request')
            ];
            attachment.addFieldsOrActions('actions', actions);
            attachment.addOptionalProps('travel_trip_riderLocationConfirmation', 'fallback', undefined, 'default');
            const channelId = yield SlackNotifications.getDMChannelId(rider, slackBotOauthToken);
            const letterMessage = `You are hereby Requested by <@${userID}> to provide `
                + `your ${location} location`;
            SlackNotifications.sendNotifications(channelId, attachment, letterMessage, slackBotOauthToken);
        });
    }
    static sendOperationsRiderlocationConfirmation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { riderID, teamID, confirmedLocation, waitingRequester, location } = payload;
            try {
                const { botToken: slackBotOauthToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamID);
                const { channel: opsChannelId } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(riderID);
                SlackNotifications.OperationsRiderlocationConfirmationMessage({
                    waitingRequester,
                    riderID,
                    location,
                    confirmedLocation,
                    opsChannelId,
                    slackBotOauthToken
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(slackErrorMessage);
            }
        });
    }
    static OperationsRiderlocationConfirmationMessage(messageData) {
        const { waitingRequester, riderID, location, confirmedLocation, opsChannelId, slackBotOauthToken } = messageData;
        const attachment = new SlackMessageModels_1.SlackAttachment(`Hello <@${waitingRequester}> :smiley:, <@${riderID}>`
            + ` just confirmed the ${location} location`, `The entered ${location} location is ${confirmedLocation}`, '', '', '', 'default', 'warning');
        const letterMessage = `Tembea travel ${location} confirmation`;
        SlackNotifications.sendNotifications(opsChannelId, attachment, letterMessage, slackBotOauthToken);
    }
    static notificationFields(tripInformation) {
        const { origin: { address: pickup }, destination: { address: destination }, rider: { name: passenger, phoneNo: riderPhoneNumber }, createdAt, departureTime, reason, tripNote, noOfPassengers, driver, cab } = tripInformation;
        const userAttachment = SlackNotifications.cabDriverDetailsNotification(cab, driver, departureTime, destination, pickup);
        const result = (!(cab && driver)) ? [
            new slack_block_models_1.MarkdownText(`*Pickup Location*:\n${pickup}`),
            new slack_block_models_1.MarkdownText(`*Destination*:\n${destination}`),
            new slack_block_models_1.MarkdownText(`*Request Date*:\n${dateHelpers_1.getSlackDateString(createdAt)}`),
            new slack_block_models_1.MarkdownText(`*Trip Date*:\n${dateHelpers_1.getSlackDateString(departureTime)}`),
            new slack_block_models_1.MarkdownText(`*Reason*:\n${reason}`),
            new slack_block_models_1.MarkdownText(`*No of Passengers*:\n${noOfPassengers}`),
            new slack_block_models_1.MarkdownText(`*Passenger*:\n${passenger}`),
            new slack_block_models_1.MarkdownText(`*Passenger Phone No.*:\n${riderPhoneNumber || 'N/A'}`),
            new slack_block_models_1.MarkdownText(`*Trip Notes*:\n${tripNote || 'N/A'}`),
        ] : userAttachment;
        return result;
    }
    static cabDriverDetailsNotification(cab, driver, departureTime, destination, pickup) {
        let userAttachment = [];
        if (cab && driver) {
            const { driverName, driverPhoneNo } = driver;
            const { model, regNumber } = cab;
            userAttachment = [
                new slack_block_models_1.MarkdownText(`*Pickup Location*:\n${pickup}`),
                new slack_block_models_1.MarkdownText(`*Destination*:\n${destination}`),
                new slack_block_models_1.MarkdownText(`*Driver Name*:\n${driverName}`),
                new slack_block_models_1.MarkdownText(`*Trip Date*:\n${dateHelpers_1.getSlackDateString(departureTime)}`),
                new slack_block_models_1.MarkdownText(`*Driver Contact*:\n${driverPhoneNo}`),
                new slack_block_models_1.MarkdownText(`*Vehicle Name*:\n${model}`),
                new slack_block_models_1.MarkdownText(`*Vehicle Reg Number*:\n${regNumber}`)
            ];
        }
        return userAttachment;
    }
    static generateNotificationFields(type, tripInformation, userId) {
        const { cab, driver } = tripInformation;
        const reason = tripInformation.operationsComment;
        const mainBlock = new slack_block_models_1.SectionBlock();
        const subBlock = new slack_block_models_1.SectionBlock();
        const notifications = SlackNotifications.notificationFields(tripInformation);
        const decliner = new slack_block_models_1.MarkdownText(`${type} by <@${userId}>`);
        const commentField = new slack_block_models_1.MarkdownText(`*Reason*:\n${reason}`);
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
    static sendOperationsNotificationFields(routeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routeImageUrl, id: routeRequestId, manager } = routeRequest;
            const acceptButton = new SlackMessageModels_1.SlackButtonAction('approve', 'Approve', routeRequestId);
            const declineButton = new SlackMessageModels_1.SlackButtonAction('decline', 'Decline', routeRequestId, 'danger');
            const messageAttachment = new SlackMessageModels_1.SlackAttachment(undefined, undefined, undefined, undefined, routeImageUrl);
            const routeAttachmentFields = AttachmentHelper_1.default.routeAttachmentFields(routeRequest);
            const engagementAttachmentFields = yield AttachmentHelper_1.default.engagementAttachmentFields(routeRequest);
            const attachments = [
                new SlackMessageModels_1.SlackAttachmentField('`Engagement Information`', null, false),
                ...engagementAttachmentFields,
                new SlackMessageModels_1.SlackAttachmentField('`Manager`', `<@${manager.slackId}>`, false),
                new SlackMessageModels_1.SlackAttachmentField('`Route Information`', null, false),
                ...routeAttachmentFields
            ];
            messageAttachment.addFieldsOrActions('actions', [acceptButton, declineButton]);
            messageAttachment.addFieldsOrActions('fields', attachments);
            messageAttachment.addOptionalProps('operations_route_actions');
            return messageAttachment;
        });
    }
    static sendOperationsNewRouteRequest(teamId, routeRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeRequestDetails = yield route_request_service_1.default.getRouteRequest(routeRequestId);
            const { engagement: { fellow: { slackId: fellow } } } = routeRequestDetails;
            const messageAttachment = yield SlackNotifications.sendOperationsNotificationFields(routeRequestDetails);
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
            const { channel: opsChannelId } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(fellow);
            const notification = yield SlackNotifications.sendNotifications(opsChannelId, messageAttachment, `Hey :simple_smile: <@${fellow}> requested a new route`, botToken);
            yield cache_1.default.save(`RouteRequestTimeStamp_${routeRequestId}`, 'timeStamp', notification.ts);
            return notification;
        });
    }
    static sendManagerCancelNotification(data, tripInfo, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { team: { id: teamId } } = data;
                const { id, departmentId } = tripInfo;
                const [head, trip, slackBotOauthToken] = yield Promise.all([
                    department_service_1.departmentService.getHeadByDeptId(departmentId),
                    trip_service_1.default.getById(id, true),
                    teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId)
                ]);
                const imResponse = yield SlackNotifications.getDMChannelId(head.slackId, slackBotOauthToken);
                const message = yield SlackNotifications.getCancelAttachment(trip, imResponse, trip.requester, trip.rider);
                return SlackNotifications.sendNotification(message, slackBotOauthToken);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
                respond({
                    text: 'Error:warning:: Request saved, but I could not send a notification to your manager.'
                });
            }
        });
    }
    static sendOpsCancelNotification(data, trip, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = cleanData_1.default.trim(data);
                const { team: { id: teamId } } = payload;
                const { requester, rider } = trip;
                const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
                const { channel } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(requester.slackId);
                const opsRequestMessage = yield SlackNotifications.getCancelAttachment(trip, channel, requester, rider);
                return SlackNotifications.sendNotification(opsRequestMessage, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                respond(slackErrorMessage);
            }
        });
    }
    static sendOpsPostRatingMessage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamDetails = yield teamDetails_service_1.teamDetailsService.getTeamDetails(payload.team.id);
            const { botToken, opsChannelId } = teamDetails;
            const mainBlock = new slack_block_models_1.SectionBlock()
                .addText(new slack_block_models_1.MarkdownText('*Trip completed*'));
            const fieldsAttachment = yield NotificationsResponse_1.default.getOpsTripBlocksFields(parseInt(payload.actions[0].value, 0));
            mainBlock.addFields(fieldsAttachment);
            const message = 'Hello Ops Team! The trip below has been completed :white_check_mark:';
            const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(message));
            SlackNotifications.sendNotification(new slack_block_models_1.BlockMessage([header, slack_helpers_1.sectionDivider, mainBlock], opsChannelId, message), botToken);
        });
    }
    static sendOpsProvidersTripsReport() {
        return __awaiter(this, void 0, void 0, function* () {
            const teamUrl = process.env.SLACK_TEAM_URL;
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
            const opsChannelReport = yield providerMonthlyReport_1.default.generateData(providerMonthlyReport_1.CommChannel.slack);
            const channelIds = Object.keys(opsChannelReport);
            if (channelIds.length) {
                channelIds.map((channelId) => __awaiter(this, void 0, void 0, function* () {
                    const channelInfo = opsChannelReport[channelId];
                    const fieldsAttachment = yield NotificationsResponse_1.default
                        .getOpsProviderTripsFields(channelInfo.providersData);
                    const message = `*Hello, ${channelInfo.name} Ops*!\n
        Here is a summary of trips taken by providers in ${channelInfo.month}`;
                    const header = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(message));
                    const totalTrips = `*TOTAL TRIPS* ${channelInfo.total}`;
                    const subBlock = new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.MarkdownText(totalTrips));
                    SlackNotifications.sendNotification(new slack_block_models_1.BlockMessage([header, slack_helpers_1.sectionDivider,
                        ...fieldsAttachment, slack_helpers_1.sectionDivider, subBlock], channelId), botToken);
                }));
            }
        });
    }
    static requestFeedbackMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const teamUrl = process.env.SLACK_TEAM_URL;
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
            const feedbackButton = new slack_block_models_1.ButtonElement('Send feedback', 'feedback', 'send_feedback');
            (yield user_service_1.default.getUsersSlackId()).forEach((user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    SlackNotifications.sendNotification(new slack_block_models_1.BlockMessage([
                        new slack_block_models_1.SectionBlock().addText(new slack_block_models_1.SlackText(`Hey there *${user.name}*, please send your weekly feedback`, slack_block_models_1.TextTypes.markdown)),
                        new slack_block_models_1.ActionBlock('send_feedback').addElements([feedbackButton]),
                    ], user.slackId), botToken);
                }
                catch (err) {
                    bugsnagHelper_1.default.log(err);
                }
            }));
        });
    }
}
exports.default = SlackNotifications;
//# sourceMappingURL=Notifications.js.map