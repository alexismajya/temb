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
const index_1 = __importDefault(require("../../SlackPrompts/notifications/ProviderNotifications/index"));
const ProvidersController_1 = __importDefault(require("../ProvidersController"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const route_service_1 = require("../../../routes/route.service");
const providersController_mock_1 = require("../__mocks__/providersController.mock");
const driver_service_1 = require("../../../drivers/driver.service");
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const Notifications_1 = __importDefault(require("../../SlackPrompts/Notifications"));
const provider_service_1 = require("../../../providers/provider.service");
const cab_service_1 = require("../../../cabs/cab.service");
const homebase_service_1 = require("../../../homebases/homebase.service");
const twilio_mocks_1 = require("../../../notifications/whatsapp/twilio.mocks");
const routeBatch_service_1 = require("../../../routeBatches/routeBatch.service");
twilio_mocks_1.mockWhatsappOptions();
describe('Provider Controller', () => {
    let respond;
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    beforeEach(() => {
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ channel: 'BBBBBB' });
    });
    describe('reassigned cab', () => {
        beforeEach(() => {
            jest.spyOn(cab_service_1.cabService, 'getById').mockResolvedValue({
                id: 1,
                regNuber: 'LKJ-123',
                providerId: 3
            });
            jest.spyOn(routeBatch_service_1.routeBatchService, 'updateRouteBatch').mockResolvedValue();
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue(providersController_mock_1.route);
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('moon-token');
            jest.spyOn(index_1.default, 'updateProviderReAssignCabMessage').mockResolvedValue({});
            jest.spyOn(ProvidersController_1.default, 'sendUserUpdatedRouteMessage').mockResolvedValue({});
        });
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.restoreAllMocks();
        }));
        it('should reassign a cab to route', () => __awaiter(void 0, void 0, void 0, function* () {
            yield ProvidersController_1.default.handleCabReAssigmentNotification(providersController_mock_1.reassignCabPayload, jest.fn());
            expect(index_1.default.updateProviderReAssignCabMessage).toHaveBeenCalled();
            expect(ProvidersController_1.default.sendUserUpdatedRouteMessage).toHaveBeenCalled();
        }));
        it('should fail when reassigning a cab to a route', () => __awaiter(void 0, void 0, void 0, function* () {
            respond = jest.fn;
            jest.spyOn(bugsnagHelper_1.default, 'log');
            jest.spyOn(index_1.default, 'updateProviderReAssignCabMessage').mockRejectedValue();
            yield ProvidersController_1.default.handleCabReAssigmentNotification(providersController_mock_1.reassignCabPayload, respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe('Send new cab details to user', () => {
        it('should send user update notification', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('moooon');
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
            yield ProvidersController_1.default.sendUserUpdatedRouteMessage(providersController_mock_1.user, providersController_mock_1.route, providersController_mock_1.cab, 'moon-token');
            expect(Notifications_1.default.getDMChannelId).toHaveBeenCalled();
            expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
        }));
    });
});
describe('reassignDriver', () => {
    beforeEach(() => {
        jest.spyOn(routeBatch_service_1.routeBatchService, 'updateRouteBatch').mockResolvedValue();
        jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue(providersController_mock_1.route);
        jest.spyOn(driver_service_1.driverService, 'getDriverById').mockResolvedValue();
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xoop-token');
        jest.spyOn(index_1.default, 'updateProviderReasignDriverMessage').mockResolvedValue({});
        jest.spyOn(ProvidersController_1.default, 'sendUserRouteUpdateMessage').mockResolvedValue({});
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.restoreAllMocks();
    }));
    it('Should reassign driver to a route', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(index_1.default, 'updateProviderReasignDriverMessage').mockResolvedValue({});
        yield ProvidersController_1.default.providerReassignDriver(providersController_mock_1.reassignDriverPayload);
        expect(index_1.default.updateProviderReasignDriverMessage).toHaveBeenCalled();
        expect(ProvidersController_1.default.sendUserRouteUpdateMessage).toHaveBeenCalled();
    }));
    it('Should enter catch block', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(bugsnagHelper_1.default, 'log');
        jest.spyOn(index_1.default, 'updateProviderReasignDriverMessage').mockRejectedValue();
        yield ProvidersController_1.default.providerReassignDriver(providersController_mock_1.reassignDriverPayload);
        expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
    }));
});
describe('Send user notification', () => {
    it('Should send user update notification', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('xxxoop');
        jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
        yield ProvidersController_1.default.sendUserRouteUpdateMessage(providersController_mock_1.user, providersController_mock_1.route, providersController_mock_1.driver, 'xoob-try');
        expect(Notifications_1.default.getDMChannelId).toHaveBeenCalled();
        expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
    }));
});
describe('handleProviderRouteApproval', () => {
    let userMessageSpy;
    let OpsMessageSpy;
    let updateProviderMessageSpy;
    beforeEach(() => {
        jest.spyOn(provider_service_1.providerService, 'findByPk').mockResolvedValue({ name: 'adaeze' });
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue({ botToken: 'xoop' });
        jest.spyOn(cab_service_1.cabService, 'getById').mockResolvedValue({ capacity: 4 });
        jest.spyOn(routeBatch_service_1.routeBatchService, 'updateRouteBatch').mockResolvedValue();
        jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue(providersController_mock_1.routeData);
        userMessageSpy = jest.spyOn(ProvidersController_1.default, 'sendUserProviderAssignMessage')
            .mockResolvedValue();
        OpsMessageSpy = jest.spyOn(ProvidersController_1.default, 'sendOpsProviderAssignMessage')
            .mockResolvedValue();
        updateProviderMessageSpy = jest.spyOn(index_1.default, 'updateRouteApprovalNotification')
            .mockResolvedValue();
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId')
            .mockResolvedValue({ channel: 'opsChannelId' });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should handle provider approval', () => __awaiter(void 0, void 0, void 0, function* () {
        const state = JSON.stringify({ tripId: 1, channel: 'UXXID', timestamp: '123456789' });
        const payload = {
            team: { id: 'teamId' },
            submission: { driver: '2', cab: '1' },
            state,
            user: { id: 'U123' },
        };
        yield ProvidersController_1.default.handleProviderRouteApproval(payload, jest.fn());
        expect(userMessageSpy).toHaveBeenCalled();
        expect(OpsMessageSpy).toHaveBeenCalled();
        expect(updateProviderMessageSpy).toHaveBeenCalled();
    }));
});
describe('sendOpsProviderAssignMessage', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('Should send ops provider approval message', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(Notifications_1.default, 'createDirectMessage').mockResolvedValue();
        jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
        yield ProvidersController_1.default.sendOpsProviderAssignMessage('deeCabs', 'bay-area', 'XOOP', 'UXXID', providersController_mock_1.SlackAttachment);
        expect(Notifications_1.default.createDirectMessage).toHaveBeenCalled();
        expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
    }));
});
describe('sendUserProviderAssignMessage', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('Should send users provider assign message', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = 'A driver and cab has been assigned to your route "*bay area*". :smiley:';
        jest.spyOn(Notifications_1.default, 'createDirectMessage').mockResolvedValue();
        jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('UPMX1');
        yield ProvidersController_1.default.sendUserProviderAssignMessage(providersController_mock_1.routeData.riders, 'xoop', 'bay area', providersController_mock_1.SlackAttachment);
        expect(Notifications_1.default.createDirectMessage).toHaveBeenCalledWith('UPMX1', message, [providersController_mock_1.SlackAttachment]);
        expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
    }));
    describe('saveRoute', () => {
        it('Should save route', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedRouteData = { busStop: 'bloomsberg', routeImageUrl: 'www.pic.co' };
            const submission = { routeName: 'dee-dee', routeCapacity: 4, takeOffTime: '3:00' };
            jest.spyOn(route_service_1.routeService, 'createRouteBatch').mockResolvedValue(providersController_mock_1.routeData);
            jest.spyOn(route_service_1.routeService, 'addUserToRoute').mockResolvedValue();
            yield ProvidersController_1.default.saveRoute(updatedRouteData, submission, 1);
            expect(route_service_1.routeService.createRouteBatch).toHaveBeenCalled();
            expect(route_service_1.routeService.addUserToRoute).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=ProvidersController.spec.js.map