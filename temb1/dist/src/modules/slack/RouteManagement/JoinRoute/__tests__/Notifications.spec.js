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
const JoinRouteHelpers_1 = __importDefault(require("../JoinRouteHelpers"));
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const JoinRouteNotifications_1 = __importDefault(require("../JoinRouteNotifications"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const Notifications_1 = __importDefault(require("../../../SlackPrompts/Notifications"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
const slackHelpers_1 = __importDefault(require("../../../../../helpers/slack/slackHelpers"));
const __mocks__1 = require("../../../../../services/__mocks__");
const joinRouteRequest_service_1 = require("../../../../joinRouteRequests/joinRouteRequest.service");
const homebase_service_1 = require("../../../../homebases/homebase.service");
const routeBatch_service_1 = require("../../../../routeBatches/routeBatch.service");
describe('JoinRouteNotifications', () => {
    let addPropsSpy;
    beforeEach(() => {
        const engagementData = ['12/01/2018', '12/12/2022', 'Safaricom'];
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(engagementData);
        const slackAttachment = new SlackMessageModels_1.SlackAttachment();
        jest.spyOn(JoinRouteHelpers_1.default, 'joinRouteAttachments')
            .mockResolvedValue(slackAttachment);
        addPropsSpy = jest.spyOn(slackAttachment, 'addOptionalProps');
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId')
            .mockResolvedValue({ channel: 'opsChannelId' });
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('sendFellowDetailsPreview', () => {
        it('should respond with a previewDetails interactive message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(JoinRouteNotifications_1.default, 'generateJoinRouteFromSubmission')
                .mockResolvedValue({ test: 'test' });
            const payload = {
                callback_id: 'join_route_fellowDetails_1',
                user: { id: 'slackId' },
                team: { id: 'teamId' },
                state: JSON.stringify({ routeId: 123 }),
                submission: {
                    partnerName: 'AAAAAA', workHours: 'BB:CC', startDate: '11/11/2019', endDate: '12/12/2019'
                }
            };
            yield JoinRouteNotifications_1.default.sendFellowDetailsPreview(payload);
            expect(JoinRouteHelpers_1.default.joinRouteAttachments)
                .toHaveBeenCalledWith({ test: 'test' });
            expect(JoinRouteNotifications_1.default.generateJoinRouteFromSubmission).toBeCalledTimes(1);
            expect(addPropsSpy).toBeCalledTimes(1);
        }));
    });
    describe('sendManagerJoinRequest', () => {
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue(1);
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('id1');
            jest.spyOn(joinRouteRequest_service_1.joinRouteRequestService, 'getJoinRouteRequest').mockResolvedValue({});
        });
        it('should send manger notification', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user: { id: 'slackId' },
                team: { id: 'teamId' }
            };
            const spy = jest.spyOn(Notifications_1.default, 'sendNotifications')
                .mockReturnValue();
            yield JoinRouteNotifications_1.default.sendManagerJoinRequest(payload, 2);
            expect(addPropsSpy).toBeCalledTimes(1);
            expect(spy).toBeCalledTimes(1);
        }));
    });
    describe('sendFilledCapacityJoinRequest', () => {
        let joinRouteRequestSubmission;
        beforeEach(() => {
            joinRouteRequestSubmission = {
                workHours: ''
            };
            jest.spyOn(cache_1.default, 'fetch')
                .mockResolvedValueOnce({ joinRouteRequestSubmission });
            jest.spyOn(JoinRouteNotifications_1.default, 'generateJoinRouteFromSubmission')
                .mockResolvedValue('tempJoinRoute');
            jest.spyOn(JoinRouteHelpers_1.default, 'joinRouteAttachments')
                .mockReturnValue(['attachments']);
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails')
                .mockResolvedValue({ botToken: 'botToken' });
            jest.spyOn(Notifications_1.default, 'sendNotifications')
                .mockResolvedValue();
        });
        it('should send full capacity notification to ops', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                routeId: 1,
                teamId: 'teamId',
                requesterSlackId: 'slackId'
            };
            yield JoinRouteNotifications_1.default.sendFilledCapacityJoinRequest(data);
            expect(cache_1.default.fetch).toHaveBeenCalled();
            expect(JoinRouteHelpers_1.default.joinRouteAttachments)
                .toHaveBeenCalledWith('tempJoinRoute');
            expect(Notifications_1.default.sendNotifications).toHaveBeenCalled();
            expect(Notifications_1.default.sendNotifications.mock.calls[0][0])
                .toEqual('opsChannelId');
            expect(Notifications_1.default.sendNotifications.mock.calls[0][1])
                .toEqual(['attachments']);
            expect(Notifications_1.default.sendNotifications.mock.calls[0][3])
                .toEqual('botToken');
        }));
    });
    describe('sendFilledCapacityJoinRequest', () => {
        let joinRouteRequestSubmission;
        let submission;
        beforeEach(() => {
            submission = { workHours: 'BB:CC' };
            joinRouteRequestSubmission = submission;
            jest.spyOn(cache_1.default, 'saveObject')
                .mockResolvedValue({ joinRouteRequestSubmission });
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk')
                .mockResolvedValue(__mocks__1.mockRouteData);
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId')
                .mockReturnValue({});
        });
        it('should send full capacity notification to ops', () => __awaiter(void 0, void 0, void 0, function* () {
            const engagementObject = {
                startDate: '12/01/2019',
                endDate: '12/07/2020',
                partnerName: 'Safaricom'
            };
            const result = yield JoinRouteNotifications_1.default.generateJoinRouteFromSubmission(submission, 'routeId', 'slackId', 'teamId', engagementObject);
            expect(cache_1.default.saveObject).toHaveBeenCalled();
            expect(routeBatch_service_1.routeBatchService.getRouteBatchByPk)
                .toHaveBeenCalledWith('routeId', true);
            expect(slackHelpers_1.default.findOrCreateUserBySlackId)
                .toHaveBeenCalledWith('slackId', 'teamId');
            expect(result).toHaveProperty('routeBatch');
            expect(result).toHaveProperty('engagement');
            expect(result.engagement).toHaveProperty('fellow');
            expect(result.engagement).toHaveProperty('partner');
            expect(result.engagement).toHaveProperty('workHours');
            expect(result.engagement).toHaveProperty('startDate');
            expect(result.engagement).toHaveProperty('endDate');
        }));
    });
});
//# sourceMappingURL=Notifications.spec.js.map