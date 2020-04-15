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
const TripActionsController_1 = __importDefault(require("../TripActionsController"));
const Notifications_1 = __importDefault(require("../../SlackPrompts/Notifications"));
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const UserInputValidator_1 = __importDefault(require("../../../../helpers/slack/UserInputValidator"));
const database_1 = __importDefault(require("../../../../database"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const cab_service_1 = require("../../../cabs/cab.service");
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const ProviderNotifications_1 = __importDefault(require("../../SlackPrompts/notifications/ProviderNotifications"));
const driver_notifications_1 = __importDefault(require("../../SlackPrompts/notifications/DriverNotifications/driver.notifications"));
const provider_service_1 = require("../../../providers/provider.service");
const app_event_service_1 = __importDefault(require("../../../events/app-event.service"));
const twilio_mocks_1 = require("../../../notifications/whatsapp/twilio.mocks");
const interactions_1 = __importDefault(require("../../../new-slack/trips/manager/interactions"));
const teamDetailMock_1 = require("../__mocks__/teamDetailMock");
twilio_mocks_1.mockWhatsappOptions();
const { models: { TripRequest } } = database_1.default;
jest.mock('../../SlackPrompts/Notifications.js');
jest.mock('../../events/', () => ({
    slackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    }))
}));
jest.mock('../../events/slackEvents', () => ({
    SlackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    })),
}));
jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('token');
jest.mock('../../SlackPrompts/Notifications.js');
jest.mock('../../events/', () => ({
    slackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    }))
}));
describe('TripActionController operations decline tests', () => {
    const state = JSON.stringify({ trip: 1000000, actionTs: 212132 });
    const opsUserId = 1;
    let payload;
    beforeEach(() => {
        payload = {
            user: {
                id: 'TEST123'
            },
            channel: {
                id: 'CE0F7SZNU'
            },
            team: {
                id: 1
            },
            submission: {
                opsDeclineComment: 'abishai has it'
            },
            state
        };
        jest.spyOn(cab_service_1.cabService, 'findOrCreateCab')
            .mockImplementation((driverName, driverPhoneNo, regNumber) => Promise.resolve({
            cab: { driverName, driverPhoneNo, regNumber },
        }));
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should run changeTripToDeclined()', () => __awaiter(void 0, void 0, void 0, function* () {
        teamDetails_service_1.teamDetailsService.getTeamDetails = jest.fn(() => Promise.resolve('token'));
        const findOrCreateUserBySlackId = jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId');
        findOrCreateUserBySlackId.mockImplementation(() => ({
            id: 1
        }));
        const changeTripStatusToDeclined = jest.spyOn(TripActionsController_1.default, 'changeTripStatusToDeclined');
        changeTripStatusToDeclined.mockImplementation(() => { });
        yield TripActionsController_1.default.changeTripStatus(payload);
        expect(findOrCreateUserBySlackId).toHaveBeenCalledTimes(1);
        expect(changeTripStatusToDeclined).toHaveBeenCalledWith(1, payload, 'token');
    }));
    it('should go to the changeTripStatus() catch block on error', () => __awaiter(void 0, void 0, void 0, function* () {
        const findOrCreateUserBySlackId = jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId');
        findOrCreateUserBySlackId.mockImplementation(() => Promise.reject(new Error()));
        const changeTripStatusToConfirmed = jest.spyOn(TripActionsController_1.default, 'changeTripStatusToConfirmed');
        changeTripStatusToConfirmed.mockImplementation(() => { });
        const response = yield TripActionsController_1.default.changeTripStatus(payload);
        expect(findOrCreateUserBySlackId).toHaveBeenCalledTimes(1);
        expect(changeTripStatusToConfirmed).not.toHaveBeenCalled();
        expect(response).toBeDefined();
    }));
    it('should run changeTripStatus() to declinedByOps', () => __awaiter(void 0, void 0, void 0, function* () {
        const trip = {
            destinationId: 2,
            name: 'A trip',
            riderId: 1,
            tripStatus: 'Approved',
            originId: 1,
            departureTime: '2018-12-12- 22:00',
            requestedById: 1,
            departmentId: 1,
            reason: 'I need to go',
            noOfPassengers: 1,
            tripType: 'Regular Trip'
        };
        jest.spyOn(Notifications_1.default, 'sendUserConfirmOrDeclineNotification').mockResolvedValue();
        jest.spyOn(Notifications_1.default, 'sendManagerConfirmOrDeclineNotification').mockResolvedValue();
        jest.spyOn(interactions_1.default, 'sendOpsDeclineOrApprovalCompletion').mockResolvedValue();
        jest.spyOn(TripRequest, 'create').mockResolvedValueOnce(trip);
        jest.spyOn(trip_service_1.default, 'updateRequest')
            .mockImplementation((t) => (Object.assign(Object.assign({}, t), { status: 'DeclinedByOps' })));
        payload.state = JSON.stringify({ trip: trip.id, actionTs: 212132 });
        const result = yield TripActionsController_1.default.changeTripStatusToDeclined(opsUserId, payload, teamDetailMock_1.teamDetailsMock);
        expect(result).toEqual('success');
        expect(Notifications_1.default.sendUserConfirmOrDeclineNotification).toHaveBeenCalled();
        expect(Notifications_1.default.sendManagerConfirmOrDeclineNotification).toHaveBeenCalled();
        expect(interactions_1.default.sendOpsDeclineOrApprovalCompletion).toHaveBeenCalled();
    }));
    it('should run the catchBlock on changeTripStatusToDeclined error ', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(trip_service_1.default, 'getById')
            .mockRejectedValue(new Error('Dummy error'));
        try {
            yield TripActionsController_1.default.changeTripStatusToDeclined(opsUserId, payload);
        }
        catch (err) {
            expect(err).toBeDefined();
        }
    }));
});
describe('TripActionController operations approve tests', () => {
    let payload;
    beforeEach(() => {
        payload = {
            user: {
                id: 'TEST123'
            },
            channel: {
                id: 'CE0F7SZNU'
            },
            team: {
                id: 1
            },
            submission: {
                confirmationComment: 'derick has it',
                driverName: 'derick',
                driverPhoneNo: '0700000000',
                regNumber: 'KAA666Q',
                cab: '1, SBARU, KAA666Q',
                driver: 1,
                capacity: '1',
                model: 'ferrari',
                providerId: 1
            },
            state: '{ "tripId": "3", "isAssignProvider": true }'
        };
        jest.spyOn(driver_notifications_1.default, 'checkAndNotifyDriver').mockResolvedValue(null);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    afterAll((done) => database_1.default.close().then(done));
    const opsUserId = 3;
    it('should change Trip Status for confirmation comment', () => __awaiter(void 0, void 0, void 0, function* () {
        teamDetails_service_1.teamDetailsService.getTeamDetails = jest.fn(() => Promise.resolve(teamDetailMock_1.teamDetailsMock));
        const findOrCreateUserBySlackId = jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId');
        findOrCreateUserBySlackId.mockImplementation(() => ({
            id: 1
        }));
        const changeTripStatusToConfirmed = jest.spyOn(TripActionsController_1.default, 'changeTripStatusToConfirmed');
        changeTripStatusToConfirmed.mockImplementation(() => { });
        yield TripActionsController_1.default.changeTripStatus(payload);
        expect(findOrCreateUserBySlackId).toHaveBeenCalledTimes(1);
        expect(changeTripStatusToConfirmed).toHaveBeenCalledWith(1, payload, teamDetailMock_1.teamDetailsMock);
    }));
    it('should run notifiyProvider upon provider assignment', () => __awaiter(void 0, void 0, void 0, function* () {
        const notifyAll = jest.spyOn(TripActionsController_1.default, 'notifyAll').mockResolvedValue(null);
        jest.spyOn(interactions_1.default, 'sendOpsDeclineOrApprovalCompletion').mockResolvedValue(null);
        jest.spyOn(provider_service_1.providerService, 'getProviderById').mockResolvedValue({
            providerUserId: 1, name: 'Test Provider'
        });
        jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue({ id: 1, name: 'Sample User' });
        yield TripActionsController_1.default.changeTripStatusToConfirmed(opsUserId, payload, teamDetailMock_1.teamDetailsMock);
        expect(notifyAll).toHaveBeenCalled();
    }));
    it('should run the catchBlock on changeTripStatusToConfirmed error ', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(trip_service_1.default, 'getById')
            .mockRejectedValue(new Error('Dummy error'));
        try {
            yield TripActionsController_1.default.changeTripStatusToConfirmed(opsUserId, payload, teamDetailMock_1.teamDetailsMock);
        }
        catch (err) {
            expect(err).toBeDefined();
        }
    }));
    it('should run runCabValidation', () => {
        const validateCabDetailsSpy = jest.spyOn(UserInputValidator_1.default, 'validateCabDetails');
        const result = TripActionsController_1.default.runCabValidation(payload);
        expect(validateCabDetailsSpy).toHaveBeenCalledWith(payload);
        expect(result.length).toBe(0);
    });
    it('should run runCabValidation', () => {
        payload.submission.regNumber = '%^&*(';
        const validateCabDetailsSpy = jest.spyOn(UserInputValidator_1.default, 'validateCabDetails');
        const result = TripActionsController_1.default.runCabValidation(payload);
        expect(validateCabDetailsSpy).toHaveBeenCalledWith(payload);
        expect(result.length).toBe(1);
    });
    it('should run notifyAll', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(Notifications_1.default, 'sendManagerConfirmOrDeclineNotification')
            .mockReturnValue();
        jest.spyOn(ProviderNotifications_1.default, 'sendTripNotification')
            .mockReturnValue();
        jest.spyOn(interactions_1.default, 'sendOpsDeclineOrApprovalCompletion')
            .mockResolvedValue();
        yield TripActionsController_1.default.notifyAll(payload, { rider: { slackId: 'AAA' } }, 'token');
        expect(Notifications_1.default.sendManagerConfirmOrDeclineNotification).toHaveBeenCalled();
        expect(ProviderNotifications_1.default.sendTripNotification).toHaveBeenCalled();
        expect(Notifications_1.default.sendUserConfirmOrDeclineNotification).toHaveBeenCalled();
    }));
    describe(TripActionsController_1.default.completeTripRequest, () => {
        const mockTrip = { id: 1 };
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xxop');
            jest.spyOn(trip_service_1.default, 'completeCabAndDriverAssignment').mockResolvedValue(mockTrip);
            jest.spyOn(ProviderNotifications_1.default, 'UpdateProviderNotification')
                .mockResolvedValue({});
            jest.spyOn(app_event_service_1.default, 'broadcast').mockImplementationOnce(() => jest.fn());
        });
        it('Should send notifications to provider and user on trip completion', () => __awaiter(void 0, void 0, void 0, function* () {
            yield TripActionsController_1.default.completeTripRequest(payload);
            expect(trip_service_1.default.completeCabAndDriverAssignment).toBeCalled();
        }));
    });
    describe(TripActionsController_1.default.getTripNotificationDetails, () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue({ id: 'UE1FCCXXX' });
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
                .mockResolvedValue('xoxb-xxxx-xxxx');
        }));
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should update trip notification details', () => __awaiter(void 0, void 0, void 0, function* () {
            const { ops, slackBotOauthToken } = yield TripActionsController_1.default.getTripNotificationDetails({
                user: { id: 1 }, team: { id: 1 }
            });
            expect(ops.id).toEqual('UE1FCCXXX');
            expect(slackBotOauthToken).toEqual('xoxb-xxxx-xxxx');
            expect(slackHelpers_1.default.findOrCreateUserBySlackId).toHaveBeenCalledTimes(1);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=TripActionsController.spec.js.map