"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SlackPaginationHelper_1 = __importDefault(require("../../../helpers/slack/SlackPaginationHelper"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const helper_1 = __importDefault(require("../SlackPrompts/notifications/ProviderNotifications/helper"));
const navButtons_1 = __importDefault(require("../../../helpers/slack/navButtons"));
const searchButton_1 = __importDefault(require("../../../helpers/slack/searchButton"));
class RoutesHelpers {
    static toAvailableRoutesAttachment(allAvailableRoutes, currentPage, totalPages, isSearch = false) {
        const attachments = [];
        if (allAvailableRoutes.length) {
            allAvailableRoutes.forEach((route) => {
                attachments.push(this.createRouteAttachment(route));
            });
        }
        else {
            attachments.push(new SlackMessageModels_1.SlackInteractiveMessage('Sorry, route not available at the moment :disappointed:'));
        }
        if (totalPages > 1) {
            attachments.push(SlackPaginationHelper_1.default.createPaginationAttachment('tembea_route', 'view_available_routes', currentPage, totalPages));
        }
        const navButtonsAttachment = navButtons_1.default('back_to_launch', 'back_to_routes_launch');
        const searchButtonAttachment = searchButton_1.default('tembea_route', 'view_available_routes');
        const allRoutesButtonAttachment = isSearch && new SlackMessageModels_1.SlackButtonAction('See Available Routes', 'See All Available Routes', 'view_available_routes', '#FFCCAA');
        searchButtonAttachment.addFieldsOrActions('actions', [allRoutesButtonAttachment]);
        attachments.push(searchButtonAttachment);
        return new SlackMessageModels_1.SlackInteractiveMessage('*All Available Routes:slightly_smiling_face:*', [...attachments, navButtonsAttachment]);
    }
    static createLeaveRouteButton() {
        return new SlackMessageModels_1.SlackCancelButtonAction('Leave Route', 'leave_route', 'Are you sure you want to leave this route', 'leave_route');
    }
    static toCurrentRouteAttachment(route) {
        const attachments = new SlackMessageModels_1.SlackAttachment();
        const leaveRouteButton = route ? RoutesHelpers.createLeaveRouteButton(route.id) : null;
        const navButtonsAttachment = navButtons_1.default('back_to_launch', 'back_to_routes_launch', leaveRouteButton);
        if (!route) {
            return new SlackMessageModels_1.SlackInteractiveMessage('You are not currently on any route :disappointed:', [navButtonsAttachment]);
        }
        [
            helper_1.default.providerRouteFields(route),
            helper_1.default.cabFields(route.cabDetails),
            helper_1.default.driverFields(route.driver)
        ].map((field) => attachments.addFieldsOrActions('fields', field));
        return new SlackMessageModels_1.SlackInteractiveMessage('*My Current Route :slightly_smiling_face:*', [attachments, navButtonsAttachment]);
    }
    static createRouteAttachment(routesInfo) {
        const { id: routeId, takeOff: departureTime, regNumber, batch, capacity, name: routeName, inUse: passenger } = routesInfo;
        const attachment = new SlackMessageModels_1.SlackAttachment();
        const route = `Route: ${routeName}`;
        const takeOffTime = `Departure Time:  ${departureTime}`;
        const availablePassenger = `Available Passengers: ${passenger} `;
        const cabCapacity = `Cab Capacity: ${capacity !== null ? capacity : 'any'} `;
        const routeDriverName = `Cab Registration Number: ${regNumber !== undefined ? regNumber : 'any'} `;
        const cabBatch = `Batch: ${batch} `;
        attachment.addFieldsOrActions('fields', [new SlackMessageModels_1.SlackAttachmentField(route, takeOffTime)]);
        attachment.addFieldsOrActions('fields', [new SlackMessageModels_1.SlackAttachmentField(cabBatch, routeDriverName)]);
        attachment.addFieldsOrActions('fields', [new SlackMessageModels_1.SlackAttachmentField(availablePassenger, cabCapacity)]);
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('joinRoute', 'Join Route', routeId)
        ]);
        attachment.addOptionalProps('join_route_actions');
        return attachment;
    }
}
exports.default = RoutesHelpers;
//# sourceMappingURL=routesHelper.js.map