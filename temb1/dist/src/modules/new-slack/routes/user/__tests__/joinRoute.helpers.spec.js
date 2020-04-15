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
const joinRoute_helpers_1 = __importDefault(require("../joinRoute.helpers"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const user_route_mocks_1 = require("../__mocks__/user-route-mocks");
const route_mocks_1 = require("../__mocks__/route-mocks");
const slack_block_models_1 = require("../../../models/slack-block-models");
const cache_1 = __importDefault(require("../../../../shared/cache"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const joinRouteRequest_service_1 = require("../../../../joinRouteRequests/joinRouteRequest.service");
const formHelper = __importStar(require("../../../../slack/helpers/formHelper"));
const route_service_1 = require("../../../../routes/route.service");
const engagement_service_1 = require("../../../../engagements/engagement.service");
const dateHelper_1 = __importDefault(require("../../../../../helpers/dateHelper"));
const partner_service_1 = require("../../../../partners/partner.service");
const slackHelpers_1 = __importDefault(require("../../../../../helpers/slack/slackHelpers"));
const routeBatch_service_1 = require("../../../../routeBatches/routeBatch.service");
describe(joinRoute_helpers_1.default, () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(joinRoute_helpers_1.default.joinRouteModal, () => {
        it('should join the route modal', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockReturnValueOnce(route_mocks_1.token);
            yield joinRoute_helpers_1.default.joinRouteModal(route_mocks_1.payload, route_mocks_1.state);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalledWith(route_mocks_1.payload.team.id);
        }));
    });
    describe(joinRoute_helpers_1.default.confirmRouteBlockMessage, () => {
        it('should confirm route block message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(joinRoute_helpers_1.default, 'joinRouteBlock').mockReturnValueOnce(user_route_mocks_1.blockMessage.blocks);
            yield joinRoute_helpers_1.default.confirmRouteBlockMessage(route_mocks_1.routeData);
            expect(joinRoute_helpers_1.default.joinRouteBlock).toHaveBeenCalledWith(route_mocks_1.routeData);
        }));
    });
    describe(joinRoute_helpers_1.default.joinRouteBlock, () => {
        it('should join route block', () => __awaiter(void 0, void 0, void 0, function* () {
            const joinRoute = { routeBatch: route_mocks_1.routeBatch };
            jest.spyOn(joinRoute_helpers_1.default, 'engagementFields').mockReturnValueOnce(user_route_mocks_1.blockMessage.blocks);
            jest.spyOn(joinRoute_helpers_1.default, 'routeFields').mockReturnValueOnce(user_route_mocks_1.blockMessage.blocks);
            yield joinRoute_helpers_1.default.joinRouteBlock(joinRoute);
            expect(joinRoute_helpers_1.default.engagementFields).toHaveBeenCalledWith(joinRoute);
            expect(joinRoute_helpers_1.default.routeFields).toHaveBeenCalledWith(route_mocks_1.routeBatch);
        }));
    });
    describe(joinRoute_helpers_1.default.engagementFields, () => {
        it('should show engagement fields', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(joinRoute_helpers_1.default, 'engagementBlockFields')
                .mockReturnValueOnce(user_route_mocks_1.blockMessage.blocks);
            yield joinRoute_helpers_1.default.engagementFields(route_mocks_1.joinRequest);
            expect(joinRoute_helpers_1.default.engagementBlockFields).toHaveBeenCalledWith(route_mocks_1.joinRequest);
        }));
    });
    describe(joinRoute_helpers_1.default.engagementBlockFields, () => {
        it('should show engagement fields in block message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(joinRoute_helpers_1.default, 'engagementDateFields')
                .mockReturnValueOnce(user_route_mocks_1.blockMessage.blocks);
            yield joinRoute_helpers_1.default.engagementBlockFields(route_mocks_1.routeBatch);
            expect(joinRoute_helpers_1.default.engagementDateFields).toHaveBeenCalledTimes(1);
        }));
    });
    describe(joinRoute_helpers_1.default.engagementDateFields, () => {
        it('should show engagement date fields', () => {
            const result = joinRoute_helpers_1.default.engagementDateFields('2019-12-11', '2019-12-11');
            expect(result).toBeDefined();
        });
    });
    describe(joinRoute_helpers_1.default.formatStartAndEndDates, () => {
        it('should format start date and end date', () => {
            const result = joinRoute_helpers_1.default.formatStartAndEndDates('2019-12-11', '2019-12-11');
            expect(result).toBeDefined();
        });
    });
    describe(joinRoute_helpers_1.default.joinRouteHandleRestrictions, () => {
        it('should not join a route when a user is not on any engagement', () => {
            joinRoute_helpers_1.default.joinRouteHandleRestrictions({ routeBatchId: null }, null);
            expect(new slack_block_models_1.SlackText(`Sorry! It appears you are not on any engagement at the moment.
         If you believe this is incorrect, contact Tembea Support.`))
                .toBeDefined();
        });
        it('should not join a route when a user is already on a route', () => {
            joinRoute_helpers_1.default.joinRouteHandleRestrictions({ routeBatchId: 2 }, route_mocks_1.routeBatch.engagement);
            expect(new slack_block_models_1.SlackText('You are already on a route. Cannot join another')).toBeDefined();
        });
    });
    describe(joinRoute_helpers_1.default.routeFields, () => {
        it('should get route fields', () => {
            const result = joinRoute_helpers_1.default.routeFields(route_mocks_1.routeBatch);
            expect(result).toBeDefined();
        });
    });
    describe(joinRoute_helpers_1.default.notifyJoiningRouteMessage, () => {
        const tempJoinRoute = {
            routeBatch: route_mocks_1.routeBatch,
            manager: route_mocks_1.joinRequest.manager,
            engagement: route_mocks_1.routeBatch.engagement,
        };
        it('should send a notification message when joing a route', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(joinRoute_helpers_1.default, 'joinNotFilledCapacity').mockReturnValueOnce(tempJoinRoute);
            yield joinRoute_helpers_1.default.notifyJoiningRouteMessage(route_mocks_1.payload, tempJoinRoute);
            expect(joinRoute_helpers_1.default.joinNotFilledCapacity)
                .toHaveBeenCalledWith(route_mocks_1.payload, tempJoinRoute);
        }));
        it('should not join filled capacity', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(joinRoute_helpers_1.default, 'saveJoinRouteRequest').mockReturnValueOnce({
                id: 2, managerId: tempJoinRoute.manager.id,
                engagementId: route_mocks_1.routeBatch.engagement.fellow.id, routeBatchId: route_mocks_1.routeBatch.id,
            });
            jest.spyOn(joinRouteRequest_service_1.joinRouteRequestService, 'updateJoinRouteRequest').mockReturnValueOnce(null);
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockReturnValueOnce(route_mocks_1.payload.user);
            jest.spyOn(formHelper, 'getFellowEngagementDetails')
                .mockReturnValueOnce(route_mocks_1.routeBatch.engagement);
            jest.spyOn(engagement_service_1.engagementService, 'updateEngagement').mockReturnValueOnce(null);
            jest.spyOn(route_service_1.routeService, 'addUserToRoute').mockReturnValueOnce(null);
            yield joinRoute_helpers_1.default.joinNotFilledCapacity(route_mocks_1.payload, tempJoinRoute);
            expect(joinRoute_helpers_1.default.saveJoinRouteRequest).toHaveBeenCalledWith(route_mocks_1.payload, tempJoinRoute.routeBatch.id);
            expect(joinRouteRequest_service_1.joinRouteRequestService.updateJoinRouteRequest).toHaveBeenCalledWith(2, {
                id: 2, status: 'Confirmed', engagement: { engagementId: route_mocks_1.routeBatch.engagement.fellow.id },
                manager: { managerId: tempJoinRoute.manager.id },
                routeBatch: { routeBatchId: route_mocks_1.routeBatch.id }
            });
            expect(user_service_1.default.getUserBySlackId).toHaveBeenCalledWith(route_mocks_1.payload.user.id);
            expect(formHelper.getFellowEngagementDetails)
                .toHaveBeenCalledWith(route_mocks_1.payload.user.id, route_mocks_1.payload.team.id);
            expect(engagement_service_1.engagementService.updateEngagement)
                .toHaveBeenCalledWith(12, { startDate: '2018-11-20', endDate: '2022-11-20', workHours: '20:00 - 00:00' });
            expect(route_service_1.routeService.addUserToRoute).toHaveBeenCalledWith(route_mocks_1.routeBatch.id, route_mocks_1.payload.user.id);
        }));
    });
    describe(joinRoute_helpers_1.default.saveJoinRouteRequest, () => {
        it('should save the joined request', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockReturnValueOnce({ manager: 'UP0RTRL02', workHours: '18:00 - 00:00' });
            jest.spyOn(cache_1.default, 'fetch').mockReturnValueOnce({
                startDate: '2/12/2018', endDate: '2/12/2018', partnerName: 'Emmy'
            });
            jest.spyOn(dateHelper_1.default, 'convertIsoString').mockReturnValueOnce({
                startDate: '2/12/2018', endDate: '2/12/2018'
            });
            jest.spyOn(partner_service_1.partnerService, 'findOrCreatePartner')
                .mockReturnValueOnce(route_mocks_1.routeBatch.engagement.partner);
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId')
                .mockReturnValueOnce(route_mocks_1.routeBatch.engagement.fellow);
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId')
                .mockReturnValueOnce(route_mocks_1.joinRequest.manager);
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk')
                .mockReturnValueOnce(route_mocks_1.routeBatch);
            jest.spyOn(engagement_service_1.engagementService, 'findOrCreateEngagement')
                .mockReturnValueOnce(route_mocks_1.routeBatch.engagement);
            jest.spyOn(joinRouteRequest_service_1.joinRouteRequestService, 'createJoinRouteRequest')
                .mockReturnValueOnce(null);
            yield joinRoute_helpers_1.default.saveJoinRouteRequest(route_mocks_1.payload, 2);
            expect(cache_1.default.fetch).toHaveBeenCalledTimes(2);
            expect(cache_1.default.fetch).toHaveBeenCalledWith('joinRouteRequestSubmission_UP0RTRL02');
            expect(cache_1.default.fetch).toHaveBeenCalledWith('userDetailsUP0RTRL02');
            expect(dateHelper_1.default.convertIsoString).toHaveBeenCalledTimes(1);
            expect(partner_service_1.partnerService.findOrCreatePartner).toHaveBeenCalledTimes(1),
                expect(slackHelpers_1.default.findOrCreateUserBySlackId).toHaveBeenCalledTimes(2),
                expect(routeBatch_service_1.routeBatchService.getRouteBatchByPk).toHaveBeenCalledTimes(1),
                expect(engagement_service_1.engagementService.findOrCreateEngagement).toHaveBeenCalledTimes(1);
            expect(joinRouteRequest_service_1.joinRouteRequestService.createJoinRouteRequest).toHaveBeenCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=joinRoute.helpers.spec.js.map