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
const Notifications_1 = __importDefault(require("../../../Notifications"));
const helper_1 = __importDefault(require("../helper"));
const provider_service_1 = require("../../../../../providers/provider.service");
const index_1 = __importDefault(require("../index"));
const teamDetails_service_1 = require("../../../../../teamDetails/teamDetails.service");
const SlackAttachment_mock_1 = __importDefault(require("../../OperationsRouteRequest/__mocks__/SlackAttachment.mock"));
const AttachmentHelper_1 = __importDefault(require("../../AttachmentHelper"));
const bugsnagHelper_1 = __importDefault(require("../../../../../../helpers/bugsnagHelper"));
const NotificationResponseMock_1 = __importDefault(require("../../../__mocks__/NotificationResponseMock"));
const __mocks__1 = require("../../../../../../services/__mocks__");
const InteractivePrompts_1 = __importDefault(require("../../../InteractivePrompts"));
const cache_1 = __importDefault(require("../../../../../shared/cache"));
const user_service_1 = __importDefault(require("../../../../../users/user.service"));
const driver_service_1 = require("../../../../../drivers/driver.service");
const providersController_mock_1 = require("../../../../RouteManagement/__mocks__/providersController.mock");
const cab_service_1 = require("../../../../../cabs/cab.service");
const helper_2 = __importDefault(require("../../OperationsRouteRequest/helper"));
const teamDetailMock_1 = require("../../../../TripManagement/__mocks__/teamDetailMock");
const mockInformation_1 = require("../../../../../providers/notifications/__mocks__/mockInformation");
const routeBatch_service_1 = require("../../../../../routeBatches/routeBatch.service");
const driversMocks_1 = __importDefault(require("../../../../../drivers/__mocks__/driversMocks"));
describe('ProviderNotifications', () => {
    const data = {
        title: 'test',
        color: 'red',
        action: 'DDSD',
        emoji: 'LAOA'
    };
    const chanelId = 'ZHWKL';
    const submission = {
        routeName: 'Yaba',
        routeCapacity: 12,
        takeOffTime: '12:30',
        regNumber: 'JKEO284',
        provider: {
            providerUserId: 1
        },
        Provider: '1,Uber Kenya,16',
        driverNumber: 78978768,
        driverId: 2,
        driverPhoneNo: 9808787797998,
        driverName: 'James'
    };
    const routeRequest = {
        dataValues: {
            id: 2
        },
        status: 'Approved',
        engagement: {
            fellow: { slackId: 'AKAKA', email: 'kelvin.chirchir@andela.com', name: 'chirchir' }
        },
        busStop: { address: 'Mirema' },
        home: { address: 'Mirema' },
        manager: { slackId: 'Deo' }
    };
    const mockRouteAttachment = SlackAttachment_mock_1.default;
    mockRouteAttachment.addOptionalProps = jest.fn();
    mockRouteAttachment.addFieldsOrActions = jest.fn();
    beforeEach(() => {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(['12/01/2019', '12/12/2022', 'Safaricom']);
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue({ chanelId });
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockResolvedValue({});
        jest.spyOn(Notifications_1.default, 'sendNotification').mockReturnValue({});
        jest.spyOn(bugsnagHelper_1.default, 'log');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('Attachment tests', () => {
        beforeEach(() => {
            jest.spyOn(helper_1.default, 'getFellowApproveAttachment').mockReturnValue('token');
            jest.spyOn(helper_1.default, 'getManagerApproveAttachment').mockReturnValue('token');
            jest.spyOn(helper_1.default, 'getProviderCompleteAttachment')
                .mockReturnValue('token');
        });
    });
    describe('ProviderAttachmentHelper', () => {
        beforeEach(() => {
            jest.spyOn(helper_1.default, 'getFellowApproveAttachment');
            jest.spyOn(helper_1.default, 'getManagerApproveAttachment');
            jest.spyOn(helper_1.default, 'getProviderCompleteAttachment');
            jest.spyOn(helper_2.default, 'opsRouteInformation');
            AttachmentHelper_1.default.getStatusLabels = jest.fn(() => data);
            AttachmentHelper_1.default.addFieldsOrActions = jest.fn(() => data);
            AttachmentHelper_1.default.routeRequestAttachment = jest.fn(() => mockRouteAttachment);
            jest.spyOn(helper_1.default, 'routeInfoAttachment')
                .mockReturnValue(mockRouteAttachment);
            jest.spyOn(helper_1.default, 'providerRouteInformation');
            jest.spyOn(AttachmentHelper_1.default, 'engagementAttachment').mockResolvedValue(mockRouteAttachment);
            jest.spyOn(Notifications_1.default, 'createDirectMessage');
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should get provider route attachment', () => {
            helper_1.default.createProviderRouteAttachment(routeRequest, chanelId, submission);
            expect(AttachmentHelper_1.default.getStatusLabels)
                .toHaveBeenCalledWith(routeRequest.status, 'Confirmed');
            expect(helper_1.default.routeInfoAttachment).toHaveBeenCalledWith(submission);
            expect(Notifications_1.default.createDirectMessage).toHaveBeenCalled();
        });
        it('should get manager approve attachment', () => __awaiter(void 0, void 0, void 0, function* () {
            yield helper_1.default.getManagerApproveAttachment(routeRequest, chanelId, true, submission);
            expect(AttachmentHelper_1.default.getStatusLabels)
                .toHaveBeenCalledWith(routeRequest.status, 'Approved');
            expect(AttachmentHelper_1.default.routeRequestAttachment).toHaveBeenCalled();
            expect(helper_2.default.opsRouteInformation).toHaveBeenCalledWith(submission);
            expect(AttachmentHelper_1.default.engagementAttachment).toHaveBeenCalled();
        }));
        it('should get fellow approve attachment', () => {
            helper_1.default.getFellowApproveAttachment(routeRequest, chanelId, submission);
            expect(AttachmentHelper_1.default.getStatusLabels)
                .toHaveBeenCalledWith(routeRequest.status, 'Approved');
            expect(AttachmentHelper_1.default.routeRequestAttachment).toHaveBeenCalled();
            expect(AttachmentHelper_1.default.engagementAttachment).toHaveBeenCalled();
        });
        it('should get provider complete attachment', () => {
            jest.spyOn(helper_1.default, 'providerRouteInformation');
            helper_1.default.getProviderCompleteAttachment('asdasd', 'Complete', routeRequest, submission);
            expect(AttachmentHelper_1.default.routeRequestAttachment).toHaveBeenCalled();
            expect(helper_1.default.providerRouteInformation).toHaveBeenCalledWith(submission);
        });
        it('should create provider route information', () => {
            const routeInformationAttachment = helper_1.default
                .providerRouteInformation(submission);
            expect(routeInformationAttachment).toEqual({
                actions: [],
                attachment_type: undefined,
                author_icon: undefined,
                author_name: undefined,
                color: undefined,
                fields: [
                    { short: true, title: 'Driver Name', value: 'James' },
                    { short: true, title: 'Driver Phone Number', value: undefined },
                    { short: true, title: 'Route Name', value: 'Yaba' },
                    { short: true, title: 'Route Capacity', value: 12 },
                    { short: true, title: '*`Take-off Time`*', value: '12:30 PM' },
                    { short: true, title: 'Cab Registration Number', value: 'JKEO284' }
                ],
                image_url: undefined,
                mrkdwn_in: [],
                text: undefined,
                title: ''
            });
        });
    });
});
describe('Provider notifications', () => {
    it('Should update provider notification', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockResolvedValue();
        const tripDetails = NotificationResponseMock_1.default;
        const [channel, botToken, trip, timeStamp] = ['cpd33', 'xxop', tripDetails, '1555500000'];
        jest.spyOn(provider_service_1.providerService, 'findByPk').mockResolvedValue({ name: 'Uber' });
        const providerFieldMock = jest.spyOn(helper_1.default, 'providerFields');
        yield index_1.default.UpdateProviderNotification(channel, botToken, trip, timeStamp);
        expect(providerFieldMock).toHaveBeenCalled();
    }));
});
describe('sendProviderReasignDriverMessage', () => {
    it('Should send provider update notification', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(provider_service_1.providerService, 'findByPk').mockResolvedValue(__mocks__1.mockExistingProvider);
        jest.spyOn(user_service_1.default, 'getUserById').mockResolvedValue(providersController_mock_1.user);
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl').mockResolvedValue('xoop-ou99');
        jest.spyOn(driver_service_1.driverService, 'findAll').mockResolvedValue(driversMocks_1.default.findAllMock);
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('CATX99');
        jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue({});
        yield index_1.default.sendProviderReasignDriverMessage(providersController_mock_1.driver, [providersController_mock_1.route], 'adaeze.slack.com');
        expect(provider_service_1.providerService.findByPk).toHaveBeenCalled();
        expect(teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl).toHaveBeenCalled();
        expect(user_service_1.default.getUserById).toHaveBeenCalled();
        expect(driver_service_1.driverService.findAll).toHaveBeenCalled();
        expect(Notifications_1.default.getDMChannelId).toHaveBeenCalled();
        expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
    }));
});
describe('updateProviderReasignDriverMessage', () => {
    it('Should update provider reassign message', () => __awaiter(void 0, void 0, void 0, function* () {
        const { channel: { id: channelId }, original_message: { ts: timestamp } } = providersController_mock_1.reassignDriverPayload;
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockResolvedValue();
        yield index_1.default.updateProviderReasignDriverMessage(channelId, 'xoob', timestamp, providersController_mock_1.route, providersController_mock_1.driver);
        expect(InteractivePrompts_1.default.messageUpdate).toHaveBeenCalled();
    }));
    it('Should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const { channel: { id: channelId }, original_message: { ts: timestamp } } = providersController_mock_1.reassignDriverPayload;
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockRejectedValue();
        jest.spyOn(bugsnagHelper_1.default, 'log');
        yield index_1.default.updateProviderReasignDriverMessage(channelId, 'xoob', timestamp, providersController_mock_1.route, providersController_mock_1.driver);
        expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
    }));
});
describe('provider cab reassignnment', () => {
    beforeEach(() => {
        jest.spyOn(provider_service_1.providerService, 'findByPk').mockResolvedValue(__mocks__1.mockExistingProvider);
        jest.spyOn(user_service_1.default, 'getUserById').mockResolvedValue({ slackId: 'kdjfj' });
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl').mockResolvedValue('xoxb-47865');
        jest.spyOn(cab_service_1.cabService, 'getCabs').mockResolvedValue({ data: [providersController_mock_1.cab] });
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('UDWHS123');
        jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.restoreAllMocks();
    }));
    it('should notify the provider of the cab deletion', () => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.sendVehicleRemovalProviderNotification(providersController_mock_1.cab, [providersController_mock_1.route], 'segun-andela.slack.com');
        expect(provider_service_1.providerService.findByPk).toHaveBeenCalled();
        expect(user_service_1.default.getUserById).toHaveBeenCalled();
        expect(cab_service_1.cabService.getCabs).toHaveBeenCalled();
        expect(Notifications_1.default.getDMChannelId).toHaveBeenCalled();
        expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
    }));
    it('should enter the catch block', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(bugsnagHelper_1.default, 'log');
        jest.spyOn(provider_service_1.providerService, 'findByPk').mockRejectedValue({});
        yield index_1.default.sendVehicleRemovalProviderNotification(providersController_mock_1.cab, [providersController_mock_1.route]);
        expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
    }));
});
describe("Provider's Trip Notification", () => {
    const teamDetails = Object.assign({}, NotificationResponseMock_1.default);
    beforeEach(() => {
        jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue();
        jest.spyOn(Notifications_1.default, 'sendNotifications').mockResolvedValue({});
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('SLACKID');
        jest.spyOn(Notifications_1.default, 'notificationFields').mockResolvedValue({});
        jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue({});
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe("Send Provider's Trip notification should throw an error", () => {
        beforeEach(() => {
            jest.spyOn(Notifications_1.default, 'sendNotification').mockRejectedValue();
            jest.spyOn(provider_service_1.providerService, 'getProviderBySlackId')
                .mockResolvedValue(mockInformation_1.mockProviderInformation);
        });
        it('should call BugsnagHelper when an error ocuurs', () => __awaiter(void 0, void 0, void 0, function* () {
            yield index_1.default.sendTripNotification('SLACKID', null, null);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledTimes(1);
        }));
    });
    describe("Send Provider's Trip notification to channel", () => {
        beforeEach(() => {
            jest.spyOn(provider_service_1.providerService, 'getProviderBySlackId').mockResolvedValue({
                isDirectMessage: false,
                chanelId: 'CHANID'
            });
        });
    });
    describe("Send Provider's Trip notification to Provider's DM", () => {
        beforeEach(() => {
            jest.spyOn(provider_service_1.providerService, 'findByPk')
                .mockResolvedValue(mockInformation_1.mockProviderInformation);
        });
        it('should send trip notification to Provider dm', () => __awaiter(void 0, void 0, void 0, function* () {
            yield index_1.default.sendTripNotification(1, teamDetailMock_1.teamDetailsMock, teamDetails);
            expect(Notifications_1.default.sendNotifications).toHaveBeenCalledTimes(0);
            expect(Notifications_1.default.sendNotification).toHaveBeenCalledTimes(1);
        }));
    });
});
describe('updateProviderReAssignCabMessage ', () => {
    it('Should update provider reassign message', () => __awaiter(void 0, void 0, void 0, function* () {
        const { channel: { id: channelId }, original_message: { ts: timestamp } } = providersController_mock_1.reassignCabPayload;
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockResolvedValue();
        yield index_1.default.updateProviderReAssignCabMessage(channelId, 'moon', timestamp, providersController_mock_1.route, providersController_mock_1.cab);
        expect(InteractivePrompts_1.default.messageUpdate).toHaveBeenCalled();
    }));
    it('Should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const { channel: { id: channelId }, original_message: { ts: timestamp } } = providersController_mock_1.reassignCabPayload;
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockRejectedValue();
        jest.spyOn(bugsnagHelper_1.default, 'log');
        yield index_1.default.updateProviderReAssignCabMessage(channelId, 'moon', timestamp, providersController_mock_1.route, providersController_mock_1.cab);
        expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
    }));
});
describe('checkIsDirectMessage ', () => {
    it('Should return channelId if isDirectMessage is true', () => __awaiter(void 0, void 0, void 0, function* () {
        const providerDetails = { isDirectMessage: false, channelId: 'testChannel' };
        const slackId = 'sd245trfg';
        const channelId = index_1.default.checkIsDirectMessage(providerDetails, slackId);
        expect(channelId).toEqual('testChannel');
    }));
    it('Should return channelId if isDirectMessage is false', () => __awaiter(void 0, void 0, void 0, function* () {
        const providerDetails = { isDirectMessage: true, channelId: 'testChannel' };
        const slackId = 'sd245trfg';
        const channelId = index_1.default.checkIsDirectMessage(providerDetails, slackId);
        expect(channelId).toEqual('sd245trfg');
    }));
});
describe('sendRouteApprovalNotification', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('Should send a provider assign cab and driver notification', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(provider_service_1.providerService, 'findByPk').mockResolvedValue({ user: { name: 'Provider X', slackId: 'xoop-seas' } });
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('UXXID');
        jest.spyOn(Notifications_1.default, 'createDirectMessage').mockResolvedValue({});
        jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue({});
        jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue({
            route: { name: 'Hello', destination: { address: 'Abeokuta Street, Ebute-metta' } }
        });
        yield index_1.default.sendRouteApprovalNotification(providersController_mock_1.route, 1, 'xoop');
        expect(provider_service_1.providerService.findByPk).toHaveBeenCalled();
        expect(Notifications_1.default.getDMChannelId).toHaveBeenCalled();
        expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
    }));
    it('Should update provider approval notification', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockResolvedValue();
        yield index_1.default.updateRouteApprovalNotification('UXXID', 'xoop', '1234567', SlackAttachment_mock_1.default);
        expect(InteractivePrompts_1.default.messageUpdate).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=ProvidersNotifications.spec.js.map