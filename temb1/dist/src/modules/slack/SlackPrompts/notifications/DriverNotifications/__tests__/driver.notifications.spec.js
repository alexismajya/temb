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
const driver_service_1 = __importDefault(require("../../../../../drivers/driver.service"));
const driver_notifications_1 = __importDefault(require("../driver.notifications"));
const teamDetails_service_1 = require("../../../../../teamDetails/teamDetails.service");
const Notifications_1 = __importDefault(require("../../../Notifications"));
const faker_1 = __importDefault(require("faker"));
const trip_request_1 = require("../../../../../../database/models/trip-request");
const whatsapp_service_1 = __importDefault(require("../../../../../../modules/notifications/whatsapp/whatsapp.service"));
const testUser = {
    id: 2,
    name: 'MyName',
    phoneNo: faker_1.default.phone.phoneNumber(),
    email: faker_1.default.internet.email(),
    slackId: 'SDCFFJ',
};
const testTripInfo = {
    id: 1,
    origin: { address: faker_1.default.address.streetAddress() },
    destination: { address: faker_1.default.address.streetAddress() },
    tripStatus: trip_request_1.TripStatus.approved,
    departureTime: faker_1.default.date.future().toISOString(),
    reason: faker_1.default.lorem.words(5),
    tripNote: faker_1.default.lorem.paragraphs(2),
    noOfPassengers: faker_1.default.random.number(10),
    driver: {
        id: 1,
        driverName: faker_1.default.name.firstName(),
        providerId: 2,
        driverPhoneNo: '+250223232344',
        userId: 3,
        user: { slackId: 'U1234' },
    },
    cab: { id: 1, capacity: 4, regNumber: faker_1.default.random.uuid(),
        model: faker_1.default.lorem.word(), providerId: 2 },
    riderId: testUser.id,
    rider: testUser,
    requestedById: testUser.id,
    requester: testUser,
    response_url: 'hello',
    tripType: trip_request_1.TripTypes.regular,
    approver: testUser,
    department: { id: 1, name: 'Hello', headId: testUser.id, homebaseId: 2, teamId: 'T12' },
    managerComment: faker_1.default.lorem.words(5),
    createdAt: faker_1.default.date.future().toISOString(),
    distance: '2.3km',
    driverSlackId: 'UKJKDL',
};
const testRouteBatchInfo = {
    id: 1,
    takeOff: '1:30',
    batch: 'A',
    driver: {
        id: 1,
        driverName: 'MyName',
        driverPhoneNo: '+250734343433',
        userId: 11,
        user: {
            name: 'MyName',
            phoneNo: faker_1.default.phone.phoneNumber(),
            email: faker_1.default.internet.email(),
            slackId: faker_1.default.random.alphaNumeric(6).toLocaleUpperCase(),
        },
    },
    providerId: 11,
    cabDetails: { id: 1, capacity: 4, regNumber: faker_1.default.random.uuid(),
        model: faker_1.default.lorem.word(), providerId: 2 },
    route: { id: 1, name: 'Route 1', imageUrl: 'hello', destinationId: 2, homebaseId: 3 },
};
const testRouteBatchInfo2 = {
    id: 1,
    takeOff: '1:30',
    batch: 'A',
    driver: {
        id: 1,
        driverName: 'MyName',
        driverPhoneNo: '+250734343433',
        user: {
            name: 'MyName',
            phoneNo: faker_1.default.phone.phoneNumber(),
            email: faker_1.default.internet.email(),
            slackId: faker_1.default.random.alphaNumeric(6).toLocaleUpperCase(),
        },
    },
    providerId: 11,
    cabDetails: { id: 1, capacity: 4, regNumber: faker_1.default.random.uuid(),
        model: faker_1.default.lorem.word(), providerId: 2 },
    route: { id: 1, name: 'Route 1', imageUrl: 'hello', destinationId: 2, homebaseId: 3 },
};
describe(driver_notifications_1.default, () => {
    const validateWaMessage = (driver) => expect.objectContaining({
        to: driver.driverPhoneNo,
        body: expect.stringContaining(driver.driverName),
    });
    beforeEach(() => {
        jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe(driver_notifications_1.default.sendDriverTripApproveOnSlack, () => {
        const testChannel = 'C10JKA';
        const testToken = 'xoxp-1134';
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue(testToken);
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue(testChannel);
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should send Driver Trip ApproveNotification', () => __awaiter(void 0, void 0, void 0, function* () {
            yield driver_notifications_1.default.sendDriverTripApproveOnSlack('team', testTripInfo, 'UGGSa');
            expect(Notifications_1.default.sendNotification).toHaveBeenCalledWith(expect.objectContaining({
                channel: testChannel,
            }), testToken);
        }));
    });
    describe(driver_notifications_1.default.checkAndNotifyDriver, () => {
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue({ botToken: 'token' });
            jest.spyOn(driver_service_1.default, 'findOneDriver').mockResolvedValue(testTripInfo.driver);
            jest.spyOn(driver_notifications_1.default, 'checkAndNotifyDriver');
            jest.spyOn(driver_notifications_1.default, 'sendDriverTripApproveOnSlack').mockResolvedValue(null);
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should check and notify driver if they have a userId', () => __awaiter(void 0, void 0, void 0, function* () {
            yield driver_notifications_1.default.checkAndNotifyDriver(testTripInfo.driver.id, 'UYDAA', testTripInfo);
            expect(driver_notifications_1.default.sendDriverTripApproveOnSlack).toBeCalled();
        }));
        it('should not notify driver if they dont have a userId', () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = { id: 1 };
            jest.spyOn(driver_service_1.default, 'findOneDriver').mockResolvedValueOnce(driver);
            yield driver_notifications_1.default.checkAndNotifyDriver(driver.id, 'UYDAA', testTripInfo);
            expect(driver_notifications_1.default.sendDriverTripApproveOnSlack).not.toBeCalled();
        }));
        it('should notify driver via whatsapp', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(whatsapp_service_1.default, 'send').mockResolvedValue(null);
            jest.spyOn(driver_service_1.default, 'findOneDriver').mockResolvedValueOnce(Object.assign(Object.assign({}, testTripInfo.driver), { userId: undefined }));
            yield driver_notifications_1.default.checkAndNotifyDriver(testTripInfo.driver.id, 'UYDAA', testTripInfo);
            expect(whatsapp_service_1.default.send).toHaveBeenCalledWith(expect.objectContaining({
                body: expect.stringContaining(testTripInfo.destination.address),
                to: testTripInfo.driver.driverPhoneNo,
            }));
        }));
    });
    describe(driver_notifications_1.default.getTripAssignmentWhatsappMessage, () => {
        it('getTripAssignmentWhatsappMessage', () => {
            const attachment = driver_notifications_1.default
                .getTripAssignmentWhatsappMessage(testUser, testTripInfo);
            expect(attachment).toBeDefined();
        });
    });
    describe(driver_notifications_1.default.getRouteAssignmentWhatsappMessage, () => {
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should send driver WhatsApp notification about assigned route', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield driver_notifications_1.default
                .getRouteAssignmentWhatsappMessage(testRouteBatchInfo);
            expect(result).toEqual(validateWaMessage(testRouteBatchInfo.driver));
        }));
    });
    describe(driver_notifications_1.default.sendRouteAssignment, () => {
        const channel = 'CM123JJ';
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(driver_notifications_1.default, 'sendRouteAssignment');
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue(channel);
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
        }));
        it('should send Driver slack notification about route assignment if they have a userId', () => __awaiter(void 0, void 0, void 0, function* () {
            const testToken = 'token';
            yield driver_notifications_1.default.sendRouteAssignment(testRouteBatchInfo, testToken);
            expect(Notifications_1.default.sendNotification).toBeCalledWith(expect.objectContaining({
                channel,
            }), testToken);
        }));
        it('should not send notification to the driver once there something wrong', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(driver_notifications_1.default.sendRouteAssignment(null, 'token')).rejects.toThrow();
        }));
        it('should send Driver whatsapp notification about route assignment once they do not have a userId', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(whatsapp_service_1.default, 'send').mockResolvedValue(null);
            yield driver_notifications_1.default.sendRouteAssignment(testRouteBatchInfo2, 'token');
            expect(whatsapp_service_1.default.send)
                .toHaveBeenCalledWith(validateWaMessage(testRouteBatchInfo2.driver));
        }));
    });
});
//# sourceMappingURL=driver.notifications.spec.js.map