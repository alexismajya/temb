"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seeAvailableRoute_controller_1 = __importDefault(require("../routes/user/seeAvailableRoute.controller"));
const actions_1 = __importDefault(require("../routes/actions"));
const blocks_1 = __importDefault(require("../routes/blocks"));
const SlackInteractions_1 = __importDefault(require("../../slack/SlackInteractions"));
const joinRoute_controller_1 = __importDefault(require("../routes/user/joinRoute.controller"));
const routeLocation_controller_1 = __importDefault(require("../routes/user/routeLocation.controller"));
const RouteInputHandler_1 = __importDefault(require("../../slack/RouteManagement/RouteInputHandler"));
const constants_1 = __importDefault(require("./manager/constants"));
const tripRoutesExtensions = [
    {
        route: {
            actionId: actions_1.default.showAvailableRoutes,
            blockId: blocks_1.default.availableRoutes,
        },
        handler: seeAvailableRoute_controller_1.default.seeAvailableRoutes,
    },
    {
        route: { actionId: actions_1.default.back, blockId: blocks_1.default.navBlock },
        handler: SlackInteractions_1.default.launch,
    },
    {
        route: {
            actionId: new RegExp(`^${actions_1.default.userJoinRoute}_\\d+$`, 'g'),
            blockId: new RegExp(`^${blocks_1.default.joinRouteBlock}_\\d+$`, 'g'),
        },
        handler: joinRoute_controller_1.default.joinARoute,
    },
    {
        route: { actionId: actions_1.default.confirmJoining, blockId: blocks_1.default.confirmRoute },
        handler: joinRoute_controller_1.default.confirmJoiningRoute,
    },
    {
        route: { actionId: actions_1.default.searchPopup, blockId: blocks_1.default.searchRouteBlock },
        handler: seeAvailableRoute_controller_1.default.searchRoute,
    },
    {
        route: {
            actionId: new RegExp(`^${actions_1.default.page}_\\d+$`, 'g'),
            blockId: blocks_1.default.pagination,
        },
        handler: seeAvailableRoute_controller_1.default.seeAvailableRoutes,
    },
    {
        route: { actionId: actions_1.default.skipPage, blockId: blocks_1.default.pagination },
        handler: seeAvailableRoute_controller_1.default.skipPage,
    },
    {
        route: { blockId: blocks_1.default.confirmLocation },
        handler: routeLocation_controller_1.default.confirmLocation,
    },
    {
        route: { actionId: actions_1.default.confirmLocation,
            blockId: blocks_1.default.confirmHomeLocation },
        handler: RouteInputHandler_1.default.handleBusStopRoute,
    },
    {
        route: { actionId: constants_1.default.confirmApprovedTrip },
        handler: SlackInteractions_1.default.handleTripActions,
    },
];
exports.default = tripRoutesExtensions;
//# sourceMappingURL=trip-router.extensions.js.map