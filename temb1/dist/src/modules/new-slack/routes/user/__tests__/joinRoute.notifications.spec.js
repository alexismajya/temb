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
const joinRoute_helpers_1 = __importDefault(require("../joinRoute.helpers"));
const joinRoute_notifications_1 = __importDefault(require("../joinRoute.notifications"));
const route_mocks_1 = require("../__mocks__/route-mocks");
const user_route_mocks_1 = require("../__mocks__/user-route-mocks");
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const joinRouteRequest_service_1 = require("../../../../joinRouteRequests/joinRouteRequest.service");
const cache_1 = __importDefault(require("../../../../shared/cache"));
const homebase_service_1 = require("../../../../homebases/homebase.service");
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
const JoinRouteNotifications_1 = __importDefault(require("../../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications"));
const Notifications_1 = __importDefault(require("../../../../slack/SlackPrompts/Notifications"));
describe(joinRoute_helpers_1.default, () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(joinRoute_notifications_1.default.sendManagerJoinRequest, () => {
        it('should send a join request notification to the manager ', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(joinRouteRequest_service_1.joinRouteRequestService, 'getJoinRouteRequest')
                .mockReturnValueOnce(route_mocks_1.routeBatch);
            jest.spyOn(joinRoute_helpers_1.default, 'joinRouteBlock').mockReturnValueOnce(user_route_mocks_1.blockMessage.blocks);
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockReturnValueOnce(route_mocks_1.token);
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(route_mocks_1.payload.channel.id);
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
            yield joinRoute_notifications_1.default.sendManagerJoinRequest(route_mocks_1.payload, route_mocks_1.routeData.id);
            expect(joinRouteRequest_service_1.joinRouteRequestService.getJoinRouteRequest).toHaveBeenCalledTimes(1);
            expect(joinRoute_helpers_1.default.joinRouteBlock).toHaveBeenCalledTimes(1);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetails).toHaveBeenCalledTimes(1);
            expect(homebase_service_1.homebaseService.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
            expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
        }));
    });
    describe(joinRoute_notifications_1.default.sendFilledCapacityJoinRequest, () => {
        it('should send a filled capacity join request to the manager', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockReturnValueOnce(route_mocks_1.routeBatch);
            jest.spyOn(cache_1.default, 'fetch').mockReturnValueOnce(user_route_mocks_1.engagementObject);
            jest.spyOn(JoinRouteNotifications_1.default, 'generateJoinRouteFromSubmission')
                .mockReturnValueOnce(route_mocks_1.routeBatch);
            jest.spyOn(joinRoute_helpers_1.default, 'joinRouteBlock').mockReturnValueOnce(user_route_mocks_1.blockMessage.blocks);
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockReturnValueOnce(route_mocks_1.token);
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(route_mocks_1.payload.channel.id);
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
            yield joinRoute_notifications_1.default.sendFilledCapacityJoinRequest(route_mocks_1.routeBatch);
            expect(cache_1.default.fetch).toHaveBeenCalledTimes(2);
            expect(JoinRouteNotifications_1.default.generateJoinRouteFromSubmission)
                .toHaveBeenCalledTimes(1);
            expect(joinRoute_helpers_1.default.joinRouteBlock).toHaveBeenCalledTimes(1);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetails).toHaveBeenCalledTimes(1);
            expect(homebase_service_1.homebaseService.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
            expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=joinRoute.notifications.spec.js.map