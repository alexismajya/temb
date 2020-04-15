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
const NotificationsResponse_1 = __importDefault(require("../NotificationsResponse"));
const SlackModels = __importStar(require("../../SlackModels/SlackMessageModels"));
const NotificationResponseMock_1 = __importDefault(require("../__mocks__/NotificationResponseMock"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const slack_block_models_1 = require("../../../new-slack/models/slack-block-models");
describe(NotificationsResponse_1.default, () => {
    const payload = {
        department: 'dept',
        data: 'data',
        slackChannelId: 'slack',
        requestDate: '11/12/2018 11:00',
        departureDate: '21/12/2018 11:00',
        tripStatus: 'trip',
        managerComment: 'manager',
        driver: {
            id: 1,
            driverName: 'John',
            driverPhoneNo: '+780000000000671'
        },
        rider: {
            name: 'John'
        },
        origin: {
            address: 'Kigali, Kimironko'
        },
        destination: {
            address: 'Kigali, Airport'
        },
        provider: {
            name: 'John',
        },
        cab: {
            regNumber: 'RAB120A',
            model: 'SUV'
        },
        distance: '1.2 Km',
        updatedAt: '2019-11-11'
    };
    beforeEach(() => {
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue(1);
        jest.spyOn(homebase_service_1.homebaseService, 'findHomeBaseByChannelId').mockResolvedValue({
            id: 3,
            name: 'Nairobi',
            channel: 'CELT35X40',
            countryId: 3,
            addressId: null,
            locationId: 40,
            createdAt: '2019-10-21T23:13:10.840Z',
            updatedAt: '2019-10-21T23:13:10.840Z',
            deletedAt: null
        });
    });
    it('should test response for operations channel for regular trip', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield NotificationsResponse_1.default.getOpsTripRequestMessage(NotificationResponseMock_1.default, NotificationResponseMock_1.default, 'hello', 'regular');
        expect(result).toHaveProperty('attachments');
    }));
    it('should test response for operations channel for travel trip', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield NotificationsResponse_1.default.getOpsTripRequestMessage(NotificationResponseMock_1.default, NotificationResponseMock_1.default, 'hello', 'travel');
        expect(result).toHaveProperty('attachments');
    }));
    it('should test travelOperations response', () => {
        const result = NotificationsResponse_1.default.travelOperationsDepartmentResponse(NotificationResponseMock_1.default, 'blue', [], 'call');
        expect(result).toHaveProperty('attachments');
    });
    it('should test OperationsDepartment response', () => {
        const result = NotificationsResponse_1.default.prepareOperationsDepartmentResponse(NotificationResponseMock_1.default, 'blue', [], 'call');
        expect(result).toHaveProperty('attachments');
    });
    it('should create get requester Attachment', () => {
        const { department, data, slackChannelId, pickup, destination, requestDate, departureDate, tripStatus, managerComment } = payload;
        const result = NotificationsResponse_1.default.getRequesterAttachment(department, data, slackChannelId, pickup, destination, requestDate, departureDate, tripStatus, managerComment);
        expect(result[0]).toHaveProperty('actions');
        expect(result[0]).toHaveProperty('attachment_type');
    });
    it('should create notification header for manager approval', () => __awaiter(void 0, void 0, void 0, function* () {
        const trip = {
            pickup: { address: 'testAddress' },
            destination: { address: 'testAddress' }
        };
        const result = yield NotificationsResponse_1.default.getMessageHeader(trip);
        expect(result).toEqual(expect.stringContaining(trip.pickup.address));
    }));
    it('should create notification header for Ops approval', () => __awaiter(void 0, void 0, void 0, function* () {
        const channelId = 'CELT35X40';
        const trip = {
            pickup: { address: 'testAddress' },
            destination: { address: 'testAddress' }
        };
        const result = yield NotificationsResponse_1.default.getMessageHeader(trip, channelId);
        expect(result).toEqual(expect.stringContaining(trip.pickup.address));
    }));
    it('should show confirm options if homebase is not Kampala', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockReturnValue({ name: 'Nairobi' });
        const response = yield NotificationsResponse_1.default.getOpsSelectAction(1, 1, []);
        expect(response.text).toEqual('Confirm request options');
    }));
    it('should show Confirm and assign cab and driver if homebase is Kampala', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockReturnValue({ name: 'Kampala' });
        const response = yield NotificationsResponse_1.default.getOpsSelectAction(1, 1, []);
        expect(response.text).toEqual('Confirm and assign cab and driver');
    }));
    it('should generateOperationsRequestActions', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(NotificationsResponse_1.default, 'getOpsSelectAction').mockReturnValue({});
        const options = yield NotificationsResponse_1.default.generateOperationsRequestActions(1, 'UHFDAA');
        expect(options).toBeDefined();
        expect(options).toEqual([{},
            new SlackModels.SlackButtonAction('declineRequest', 'Decline', 1, 'danger')]);
    }));
    it('should create interactive message for provider', () => __awaiter(void 0, void 0, void 0, function* () {
        const testChannel = 'U1234';
        const result = yield NotificationsResponse_1.default.responseForRequester(payload, testChannel);
        expect(result).toEqual(expect.objectContaining({ channel: testChannel }));
    }));
    it('should send a notification to the operations team when a user complete and rate a trip', () => __awaiter(void 0, void 0, void 0, function* () {
        const getMockedTrip = jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(payload);
        yield NotificationsResponse_1.default.getOpsTripBlocksFields(1);
        expect(getMockedTrip).toHaveBeenCalledWith(1, true);
    }));
    it.only('should generate providers trips information fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const fields = [
            new slack_block_models_1.MarkdownText('*Provider*: YEGO\n'),
            new slack_block_models_1.MarkdownText('*Trips*: 2\n'),
            new slack_block_models_1.MarkdownText('*Percentage*: 100%\n')
        ];
        const result = yield NotificationsResponse_1.default
            .getOpsProviderTripsFields([
            {
                name: 'YEGO',
                trips: 2,
                percantage: 100
            }
        ]);
        expect(result[0].fields).toEqual(fields);
    }));
});
//# sourceMappingURL=NotificationsResponse.spec.js.map