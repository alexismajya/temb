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
Object.defineProperty(exports, "__esModule", { value: true });
const slack_block_models_1 = require("../../../../new-slack/models/slack-block-models");
const dateHelpers_1 = require("../../../helpers/dateHelpers");
const whatsapp_service_1 = __importDefault(require("../../../../../modules/notifications/whatsapp/whatsapp.service"));
const ValidationSchemas_1 = __importDefault(require("./../../../../../middlewares/ValidationSchemas"));
const { phoneNoRegex } = ValidationSchemas_1.default;
class DriverNotificationHelper {
    static tripApprovalAttachment(trip) {
        const { origin, destination, rider: { slackId, phoneNo }, departureTime, distance, department: { name }, driverSlackId, noOfPassengers, } = trip;
        const fields = [
            new slack_block_models_1.MarkdownText(`*Take Off time* \n ${dateHelpers_1.getSlackDateString(departureTime)}`),
            new slack_block_models_1.MarkdownText(`*Passenger* \n  <@${slackId}> `),
            new slack_block_models_1.MarkdownText(`*Department* \n ${name}`),
            new slack_block_models_1.MarkdownText(`*PickUp Location* \n ${origin.address}`),
            new slack_block_models_1.MarkdownText(`*Destination* \n ${destination.address}`),
            new slack_block_models_1.MarkdownText(`*No of Passengers* \n ${noOfPassengers}`),
            new slack_block_models_1.MarkdownText(`*Phone Number*\n ${phoneNo || 'N/A'}`),
            new slack_block_models_1.MarkdownText(`*Distance* ${distance}`)
        ];
        const header = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.section)
            .addText(new slack_block_models_1.MarkdownText('*New Trip Notification*'));
        const body = new slack_block_models_1.SectionBlock()
            .addText(new slack_block_models_1.MarkdownText(`Hey <@${driverSlackId}> You have an upcoming trip :smiley:`))
            .addFields(fields);
        const blocks = [header, body];
        return blocks;
    }
    static notifyDriverOnWhatsApp(trip) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin, destination, rider, driver, } = trip;
            if (phoneNoRegex.test(driver.driverPhoneNo)) {
                const message = {
                    body: `Hello ${driver.driverName},\n Your trip with *${rider.name}* from *${origin.address}* to *${destination.address}* is in the next 10 minutes. Enjoy!`,
                    to: `${driver.driverPhoneNo}`,
                };
                yield whatsapp_service_1.default.send(message);
            }
        });
    }
    static routeApprovalAttachment(routeBatch) {
        const { takeOff, route, driver, } = routeBatch;
        const header = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.section)
            .addText(new slack_block_models_1.MarkdownText('*New Route Notification*'));
        const body = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.section)
            .addText(new slack_block_models_1.MarkdownText(`Hello <@${driver.user.slackId}> you have been assigned to the route *${route.name}* which takes off at *${takeOff}* daily.
    Please liaise with Ops or your Provider for clarity. Thanks `));
        const blocks = [header, body];
        return blocks;
    }
}
exports.default = DriverNotificationHelper;
//# sourceMappingURL=driver.notifications.helper.js.map