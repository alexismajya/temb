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
const joinRoute_controller_1 = __importDefault(require("../joinRoute.controller"));
const joinRoute_helpers_1 = __importDefault(require("../joinRoute.helpers"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
const JoinRouteNotifications_1 = __importDefault(require("../../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications"));
const formHelper = __importStar(require("../../../../slack/helpers/formHelper"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const slack_helpers_1 = __importDefault(require("../../../helpers/slack-helpers"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../../helpers/slack/updatePastMessageHelper"));
const user_route_mocks_1 = require("../__mocks__/user-route-mocks");
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
describe(joinRoute_controller_1.default, () => {
    const { actionRespond, modalRespond, } = user_route_mocks_1.dependencyMocks;
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(joinRoute_controller_1.default.joinARoute, () => {
        it('should not join a route when there is a restriction', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockReturnValueOnce(user_route_mocks_1.payload);
            jest.spyOn(formHelper, 'getFellowEngagementDetails').mockReturnValueOnce(user_route_mocks_1.payload);
            jest.spyOn(joinRoute_helpers_1.default, 'joinRouteHandleRestrictions')
                .mockReturnValueOnce(user_route_mocks_1.payload);
            yield joinRoute_controller_1.default.joinARoute(user_route_mocks_1.payload, actionRespond);
            expect(user_service_1.default.getUserBySlackId).toHaveBeenCalledTimes(1);
            expect(formHelper.getFellowEngagementDetails).toHaveBeenCalledTimes(1);
            expect(joinRoute_helpers_1.default.joinRouteHandleRestrictions).toHaveBeenCalledTimes(1);
        }));
        it('should open a modal when there is no restriction to join a route', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockReturnValueOnce(null);
            jest.spyOn(formHelper, 'getFellowEngagementDetails').mockReturnValueOnce(null);
            jest.spyOn(joinRoute_helpers_1.default, 'joinRouteHandleRestrictions').mockReturnValueOnce(null);
            jest.spyOn(joinRoute_helpers_1.default, 'joinRouteModal').mockReturnValueOnce(null);
            jest.spyOn(cache_1.default, 'save').mockReturnValueOnce(null);
            yield joinRoute_controller_1.default.joinARoute(user_route_mocks_1.payload, actionRespond);
            expect(user_service_1.default.getUserBySlackId).toHaveBeenCalledTimes(1);
            expect(formHelper.getFellowEngagementDetails).toHaveBeenCalledTimes(1);
            expect(joinRoute_helpers_1.default.joinRouteHandleRestrictions).toHaveBeenCalledTimes(1);
            expect(cache_1.default.save).toHaveBeenCalledTimes(1);
        }));
    });
    describe(joinRoute_controller_1.default.handleSelectManager, () => {
        it('should handle select manager', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slack_helpers_1.default, 'modalValidator').mockReturnValueOnce(user_route_mocks_1.payload);
            jest.spyOn(cache_1.default, 'save').mockReturnValueOnce(user_route_mocks_1.engagementObject);
            jest.spyOn(cache_1.default, 'fetch').mockReturnValueOnce(user_route_mocks_1.engagementObject);
            jest.spyOn(cache_1.default, 'fetch').mockReturnValueOnce(user_route_mocks_1.engagementObject);
            jest.spyOn(JoinRouteNotifications_1.default, 'generateJoinRouteFromSubmission')
                .mockReturnValueOnce(user_route_mocks_1.payload);
            jest.spyOn(joinRoute_helpers_1.default, 'confirmRouteBlockMessage').mockReturnValueOnce(user_route_mocks_1.payload);
            jest.spyOn(updatePastMessageHelper_1.default, 'sendMessage').mockReturnValueOnce(user_route_mocks_1.payload);
            yield joinRoute_controller_1.default.handleSelectManager(user_route_mocks_1.payload, {}, modalRespond);
            expect(slack_helpers_1.default.modalValidator).toHaveBeenCalledTimes(1);
            expect(cache_1.default.save).toHaveBeenCalledTimes(1);
            expect(cache_1.default.fetch).toHaveBeenCalledTimes(2);
            expect(cache_1.default.fetch).toHaveBeenCalledWith('ROUTE_REQUEST_UP0RTRL02');
            expect(cache_1.default.fetch).toHaveBeenCalledWith('userDetailsUP0RTRL02');
            expect(JoinRouteNotifications_1.default.generateJoinRouteFromSubmission).toHaveBeenCalledTimes(1);
            expect(joinRoute_helpers_1.default.confirmRouteBlockMessage).toHaveBeenCalledTimes(1);
            expect(updatePastMessageHelper_1.default.sendMessage).toHaveBeenCalledTimes(1);
        }));
        it('should respond with an error when it fetches once from cache', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slack_helpers_1.default, 'modalValidator').mockReturnValueOnce(user_route_mocks_1.payload);
            jest.spyOn(cache_1.default, 'save').mockReturnValueOnce(user_route_mocks_1.engagementObject);
            jest.spyOn(cache_1.default, 'fetch').mockReturnValueOnce(user_route_mocks_1.engagementObject);
            yield joinRoute_controller_1.default.handleSelectManager(user_route_mocks_1.payload, {}, modalRespond);
            expect(slack_helpers_1.default.modalValidator).toHaveBeenCalledTimes(1);
            expect(cache_1.default.save).toHaveBeenCalledTimes(1);
        }));
    });
    describe(joinRoute_controller_1.default.confirmJoiningRoute, () => {
        it('should enable a user to confirm to join a route', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockReturnValueOnce(user_route_mocks_1.engagementObject);
            jest.spyOn(cache_1.default, 'fetch').mockReturnValueOnce(user_route_mocks_1.engagementObject);
            jest.spyOn(JoinRouteNotifications_1.default, 'generateJoinRouteFromSubmission')
                .mockReturnValueOnce(user_route_mocks_1.payload);
            jest.spyOn(joinRoute_helpers_1.default, 'notifyJoiningRouteMessage')
                .mockReturnValueOnce(user_route_mocks_1.payload);
            yield joinRoute_controller_1.default.confirmJoiningRoute(user_route_mocks_1.payload, actionRespond);
            expect(cache_1.default.fetch).toHaveBeenCalledTimes(2);
            expect(cache_1.default.fetch).toHaveBeenCalledWith('ROUTE_REQUEST_UP0RTRL02');
            expect(cache_1.default.fetch).toHaveBeenCalledWith('userDetailsUP0RTRL02');
            expect(JoinRouteNotifications_1.default.generateJoinRouteFromSubmission).toHaveBeenCalledTimes(1);
            expect(joinRoute_helpers_1.default.notifyJoiningRouteMessage).toHaveBeenCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=joinRoute.controller.spec.js.map