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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JoinRouteHelpers_1 = __importDefault(require("../JoinRouteHelpers"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
const partner_service_1 = require("../../../../partners/partner.service");
const engagement_service_1 = require("../../../../engagements/engagement.service");
const slackHelpers_1 = __importDefault(require("../../../../../helpers/slack/slackHelpers"));
const joinRouteRequest_service_1 = require("../../../../joinRouteRequests/joinRouteRequest.service");
const routeBatch_service_1 = require("../../../../routeBatches/routeBatch.service");
const index_1 = __importDefault(require("../../../../../utils/index"));
const SlackMessageModels_1 = require("../../../SlackModels/SlackMessageModels");
const AttachmentHelper_1 = __importDefault(require("../../../SlackPrompts/notifications/AttachmentHelper"));
describe('JoinRouteHelpers', () => {
    const submission = {
        manager: 'managerId',
        workHours: '18:00-00:00'
    };
    const payload = {
        callback_id: 'join_route_Test_1',
        user: { id: 'slackId', name: 'test.user' },
        team: { id: 'teamId' }
    };
    const data = { id: 2 };
    const routeData = {
        id: 2,
        capacity: '0/4',
        riders: [1, 2],
        takeOff: '00:00',
        route: {
            imageUrl: 'routeImageUrl',
            name: 'routeName',
            destination: { address: 'address' }
        },
    };
    const { partnerName: name } = submission, engagementDetails = __rest(submission, ["partnerName"]);
    const joinRequestMock = {
        manager: { email: 'AAA.BBB@CCC.DDD', name: 'ZZZZZZ', slackId: 'managerId' },
        routeBatch: routeData,
        engagement: Object.assign(Object.assign({}, engagementDetails), { partner: { name }, fellow: { email: 'AAA.BBB@CCC.DDD', name: 'ZZZZZZ', slackId: 'PPPPPP' }, workHours: '18:00-00:00', startDate: '22/01/2019', endDate: '22/12/2019' })
    };
    let routeBatch;
    let fetch;
    let saveObject;
    let partner;
    let engagement;
    let fellow;
    let manager;
    let joinRequest;
    let fetchJoinRequest;
    beforeEach(() => {
        routeBatch = jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk')
            .mockReturnValue(routeData);
        fetch = jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({
            manager: 'manager',
            workHours: 'workHours'
        });
        saveObject = jest.spyOn(cache_1.default, 'saveObject').mockImplementation(jest.fn());
        partner = jest.spyOn(partner_service_1.partnerService, 'findOrCreatePartner').mockResolvedValue(data);
        engagement = jest.spyOn(engagement_service_1.engagementService, 'findOrCreateEngagement').mockResolvedValue(data);
        fellow = jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue(data);
        manager = jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue(data);
        joinRequest = jest.spyOn(joinRouteRequest_service_1.joinRouteRequestService, 'createJoinRouteRequest')
            .mockResolvedValue({ id: 1 });
        fetchJoinRequest = jest.spyOn(joinRouteRequest_service_1.joinRouteRequestService, 'getJoinRouteRequest')
            .mockResolvedValue(joinRequestMock);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('getName', () => {
        it('should return a string of split words given a string', () => {
            const result = JoinRouteHelpers_1.default.getName('test.user');
            expect(result).toEqual('Test User');
        });
    });
    describe('saveJoinRouteRequest', () => {
        it('should save join route request', () => __awaiter(void 0, void 0, void 0, function* () {
            const engagementData = ['12/01/2018', '12/12/2022', 'Safaricom'];
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(engagementData);
            const result = yield JoinRouteHelpers_1.default.saveJoinRouteRequest(payload, '1');
            expect(fetch).toBeCalledWith('joinRouteRequestSubmission_slackId');
            expect(partner).toBeCalledWith('Safaricom');
            expect(fellow).toBeCalledWith('slackId', 'teamId');
            expect(engagement).toBeCalled();
            expect(manager).toHaveBeenCalled();
            expect(routeBatch).toBeCalledWith('1');
            expect(joinRequest).toBeCalledWith(2, 2, 2);
            expect(result).toEqual({ id: 1 });
        }));
    });
    describe('getJoinRouteRequest', () => {
        const engagementData = {
            id: null,
            slackId: 'slackId',
            submission
        };
        it('should get engagement details from payload submission', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield JoinRouteHelpers_1.default.getJoinRouteRequest(engagementData);
            expect(saveObject).toBeCalledWith('joinRouteRequestSubmission_slackId', engagementData.submission);
            expect(result).toEqual(engagementData.submission);
        }));
        it('should get engagement details from JoinRequest model', () => __awaiter(void 0, void 0, void 0, function* () {
            const engData = Object.assign(Object.assign({}, engagementData), { id: 1, submission: undefined });
            const result = yield JoinRouteHelpers_1.default.getJoinRouteRequest(engData);
            expect(fetchJoinRequest).toBeCalledWith(1);
            expect(result).toEqual(Object.assign(Object.assign({}, engagementData.submission), { endDate: '22/12/2019', partnerName: undefined, startDate: '22/01/2019' }));
        }));
    });
    describe('engagementFields', () => {
        it('should return a list of slack attachment fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const nameSpy = jest.spyOn(AttachmentHelper_1.default, 'engagementAttachmentFields');
            const result = yield JoinRouteHelpers_1.default.engagementFields(joinRequestMock, null);
            expect(result).toBeInstanceOf(Array);
            expect(nameSpy).toHaveBeenCalledWith(joinRequestMock);
        }));
    });
    describe('routeFields', () => {
        it('should return a list of route attachment fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const route = {
                capacity: '0/4',
                riders: [1, 2],
                takeOff: '00:00',
                route: { name: 'routeName', destination: { address: 'address' } }
            };
            const result = JoinRouteHelpers_1.default.routeFields(route);
            expect(result.length).toEqual(4);
        }));
    });
    describe('joinRouteAttachments', () => {
        it('should return an attachment with JoinRoute details', () => __awaiter(void 0, void 0, void 0, function* () {
            const fieldsOrActionsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addFieldsOrActions');
            const formatTimeSpy = jest.spyOn(index_1.default, 'formatTime');
            const result = yield JoinRouteHelpers_1.default.joinRouteAttachments(joinRequestMock);
            expect(fieldsOrActionsSpy).toBeCalledTimes(1);
            expect(formatTimeSpy).toBeCalledWith('00:00');
            expect(result.image_url).toEqual('routeImageUrl');
        }));
    });
});
//# sourceMappingURL=Helpers.spec.js.map