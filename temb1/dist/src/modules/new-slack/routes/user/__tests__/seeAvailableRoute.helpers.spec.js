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
const seeAvailableRoute_helpers_1 = __importDefault(require("../seeAvailableRoute.helpers"));
const slack_block_models_1 = require("../../../models/slack-block-models");
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const user_route_mocks_1 = require("../__mocks__/user-route-mocks");
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
const route_mocks_1 = require("../__mocks__/route-mocks");
describe(seeAvailableRoute_helpers_1.default, () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(seeAvailableRoute_helpers_1.default.getAvailableRoutesBlockMessage, () => {
        it('should return available routes block message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(seeAvailableRoute_helpers_1.default, 'routeBlock').mockReturnValueOnce(user_route_mocks_1.blockMessage.blocks);
            yield seeAvailableRoute_helpers_1.default.getAvailableRoutesBlockMessage(route_mocks_1.routesMock);
            expect(seeAvailableRoute_helpers_1.default.routeBlock).toHaveBeenCalledWith(route_mocks_1.routeData);
        }));
        it('should return sorry message if routes are not found', () => {
            seeAvailableRoute_helpers_1.default.getAvailableRoutesBlockMessage(route_mocks_1.notFoundRoutes);
            expect(new slack_block_models_1.SlackText('Sorry, route not available at the moment :disappointed:'))
                .toBeDefined();
        });
    });
    describe(seeAvailableRoute_helpers_1.default.routeBlock, () => {
        it('should return a route block message', () => {
            const message = seeAvailableRoute_helpers_1.default.routeBlock(route_mocks_1.routeData);
            expect(message).toBeDefined();
        });
    });
    describe(seeAvailableRoute_helpers_1.default.popModalForSeachRoute, () => {
        it('should return a pop modal to search a route', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockReturnValueOnce(route_mocks_1.token);
            yield seeAvailableRoute_helpers_1.default.popModalForSeachRoute(route_mocks_1.payload, route_mocks_1.state);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toBeCalledWith(route_mocks_1.payload.team.id);
        }));
    });
    describe(seeAvailableRoute_helpers_1.default.popModalForSkipPage, () => {
        it('should return a pop modal to skip a page', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockReturnValueOnce(route_mocks_1.token);
            yield seeAvailableRoute_helpers_1.default.popModalForSkipPage(route_mocks_1.payload, route_mocks_1.state);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toBeCalledWith(route_mocks_1.payload.team.id);
        }));
    });
});
//# sourceMappingURL=seeAvailableRoute.helpers.spec.js.map