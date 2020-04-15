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
const index_1 = __importDefault(require("../index"));
const teamDetails_service_1 = require("../../../../../teamDetails/teamDetails.service");
const Notifications_1 = __importDefault(require("../../../Notifications"));
const user_service_1 = __importDefault(require("../../../../../users/user.service"));
const bugsnagHelper_1 = __importDefault(require("../../../../../../helpers/bugsnagHelper"));
const OpsRouteRequest_mock_1 = require("../../OperationsRouteRequest/__mocks__/OpsRouteRequest.mock");
const helper_1 = __importDefault(require("../../ProviderNotifications/helper"));
const routeMock_1 = require("../../../../../../helpers/__mocks__/routeMock");
const __mocks__1 = require("../../../../../../services/__mocks__");
const whatsapp_service_1 = __importDefault(require("../../../../../notifications/whatsapp/whatsapp.service"));
const routeBatch_service_1 = require("../../../../../routeBatches/routeBatch.service");
describe('Route Notifications', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('Send InactiveRoute Notification To RouteRiders', () => {
        it('should call the methods to create and send notification to all the riders', () => __awaiter(void 0, void 0, void 0, function* () {
            const routeInfo = {
                riders: [
                    { slackId: 1 },
                    { slackId: 2 },
                    { slackId: 3 }
                ],
                route: { destination: { address: 'Epic Tower' } },
                status: 'Inactive'
            };
            const teamUrl = 'go@slack.com';
            const teamDetailsMock = jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                .mockResolvedValue({ botToken: 'xxxx-123' });
            const createMessageMock = jest.spyOn(Notifications_1.default, 'createDirectMessage')
                .mockReturnValue('Good to go');
            const sendNotifyMock = jest.spyOn(index_1.default, 'nofityRouteUsers')
                .mockImplementation();
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue(null);
            const text = 'Sorry, Your route to *Epic Tower* is no longer available :disappointed:';
            yield index_1.default.sendRouteNotificationToRouteRiders(teamUrl, routeInfo);
            expect(teamDetailsMock).toHaveBeenCalledTimes(1);
            expect(teamDetailsMock).toHaveBeenCalledWith(teamUrl);
            expect(createMessageMock).toHaveBeenCalledTimes(1);
            expect(createMessageMock).toHaveBeenCalledWith('', text, false);
            expect(sendNotifyMock).toHaveBeenCalledTimes(1);
        }));
    });
    describe('Send notification to rider', () => {
        it('should call methods to get dmId and sendNotification', () => __awaiter(void 0, void 0, void 0, function* () {
            const imIdMock = jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue(1);
            const slackNotificationMock = jest.spyOn(Notifications_1.default, 'sendNotification')
                .mockImplementation();
            const message = { id: 1 };
            yield index_1.default.sendNotificationToRider(message, 12, 'token');
            expect(imIdMock).toHaveBeenCalledTimes(1);
            expect(imIdMock).toHaveBeenCalledWith(12, 'token');
            expect(slackNotificationMock).toHaveBeenCalledWith({ channel: 1, id: 1 }, 'token');
        }));
    });
    describe('generateRouteUpdateAttachement', () => {
        const updatedDetailsMock = {
            takeOff: '02:00',
            name: 'a route',
            destination: 'new destination',
            driverName: 'Fine Driver',
            driverPhoneNo: '01820284822'
        };
        it('should generate a new slack attachment object', () => {
            const result = index_1.default.generateRouteUpdateAttachement(updatedDetailsMock);
            expect(typeof result).toEqual('object');
            expect(Array.isArray(result.fields)).toBeTruthy();
            expect(result.fields.length).toEqual(5);
        });
    });
    describe('nofityRouteUsers', () => {
        const ridersMock = [
            { slackId: 1, id: 1 },
            { slackId: 2, id: 2 },
            { slackId: 3, id: 3 }
        ];
        const botToken = 'xxxx';
        const message = 'route updated';
        it('should send route update notification to all riders', () => __awaiter(void 0, void 0, void 0, function* () {
            const spy = jest.spyOn(index_1.default, 'sendNotificationToRider').mockImplementation();
            yield index_1.default.nofityRouteUsers(ridersMock, message, false, botToken);
            expect(spy).toHaveBeenCalledTimes(3);
            expect(spy).toHaveBeenLastCalledWith(message, ridersMock[2].slackId, botToken);
        }));
        it('should send notification and remove riders upon route deactivation/deletion', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(index_1.default, 'sendNotificationToRider').mockImplementation();
            const userMock = { id: 1, routeBatchId: 10, save: jest.fn() };
            jest.spyOn(user_service_1.default, 'getUserById').mockResolvedValue(userMock);
            yield index_1.default.nofityRouteUsers([{ slackId: 1, id: 10 }], message, true, botToken);
            expect(user_service_1.default.getUserById).toHaveBeenCalledTimes(1);
            expect(user_service_1.default.getUserById).toHaveBeenLastCalledWith(10);
        }));
        it('should catch all errors', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield index_1.default.nofityRouteUsers('', message, false, botToken);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe('sendRouteUseConfirmationNotificationToRider', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should send route update notification to all riders', () => __awaiter(void 0, void 0, void 0, function* () {
            const getDMSpy = jest.spyOn(Notifications_1.default, 'getDMChannelId')
                .mockResolvedValue('TEAMID12');
            const routeServiceSpy = jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk')
                .mockResolvedValue(routeMock_1.routeBatch);
            const notificationSpy = jest.spyOn(Notifications_1.default, 'sendNotification')
                .mockResolvedValue();
            const data = {
                record: __mocks__1.mockRecord[0], rider: { slackId: 'ASWEQEW' }
            };
            yield index_1.default.sendRouteUseConfirmationNotificationToRider(data, 'xoop-ewrwere');
            expect(getDMSpy).toHaveBeenCalledTimes(1);
            expect(routeServiceSpy).toHaveBeenCalledTimes(1);
            expect(notificationSpy).toHaveBeenCalledTimes(1);
        }));
        it('should catch errors when sending route use confirmation to rider', () => __awaiter(void 0, void 0, void 0, function* () {
            const getDMSpy = jest.spyOn(Notifications_1.default, 'getDMChannelId')
                .mockRejectedValue('');
            const errorSpy = jest.spyOn(bugsnagHelper_1.default, 'log');
            yield index_1.default.sendRouteUseConfirmationNotificationToRider({ recordId: 3, rider: { slackId: '78uu' } }, 'xoop-ewrwere');
            expect(getDMSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy).toHaveBeenCalledTimes(1);
        }));
    });
    describe('sendRouteApproveMessageToManager', () => {
        it('Should get manager approve attachment', () => __awaiter(void 0, void 0, void 0, function* () {
            const routeRequest = { manager: { slackId: 'UCCUXP' } };
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('xxid');
            jest.spyOn(helper_1.default, 'getManagerApproveAttachment').mockResolvedValue({});
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
            yield index_1.default.sendRouteApproveMessageToManager(routeRequest, 'xoop', OpsRouteRequest_mock_1.routeRequestData);
            expect(Notifications_1.default.getDMChannelId).toHaveBeenCalled();
        }));
        it('should catch all errors if invalid or no parameters are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield index_1.default.sendRouteApproveMessageToManager();
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe('sendRouteApproveMessageToFellow', () => {
        it('Should get fellow approve attachment', () => __awaiter(void 0, void 0, void 0, function* () {
            const routeRequest = { engagement: { fellow: { slackId: 'UCCUXP' } } };
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('xxid');
            jest.spyOn(helper_1.default, 'getFellowApproveAttachment').mockResolvedValue({});
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
            yield index_1.default.sendRouteApproveMessageToFellow(routeRequest, 'xoop', OpsRouteRequest_mock_1.routeRequestData);
            expect(Notifications_1.default.getDMChannelId).toHaveBeenCalled();
            expect(helper_1.default.getFellowApproveAttachment).toHaveBeenCalled();
            expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
        }));
        it('should catch all errors if invalid or no parameters are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield index_1.default.sendRouteApproveMessageToFellow();
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe('sendRouteTripReminder', () => {
        const data = {
            rider: {
                slackId: 'AABBCCDD'
            },
            driver: {
                id: 1,
                driverName: 'Pied Piper',
                driverPhoneNo: '+250789890980',
            },
            batch: routeMock_1.routeBatch
        };
        const botToken = 'xoop-sdad';
        it('should send route trip reminder message to user', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('TEAMID12');
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue();
            yield index_1.default.sendRouteTripReminder(data, botToken);
            expect(Notifications_1.default.getDMChannelId).toHaveBeenCalledWith(expect.any(String), expect.any(String));
        }));
        it('should catch and log errors', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockRejectedValue(new Error('Error'));
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield index_1.default.sendRouteTripReminder(data, botToken);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith(expect.any(Error));
        }));
        it('should send whatsapp route trip reminder to driver', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const driverMessage = {
                to: data.driver.driverPhoneNo,
                body: `Hello *${data.driver.driverName}*, You have an upcoming trip on route
        *${routeMock_1.routeBatch.route.name}*\n\n
        We wish you a safe trip.`,
            };
            jest.spyOn(index_1.default, 'getRouteTripReminderMessage').mockReturnValue(driverMessage);
            jest.spyOn(whatsapp_service_1.default, 'send').mockResolvedValue(null);
            yield index_1.default.sendWhatsappRouteTripReminder(data.driver, routeMock_1.routeBatch);
            expect(index_1.default.getRouteTripReminderMessage).toHaveBeenCalled();
            expect(whatsapp_service_1.default.send).toHaveBeenCalledWith(driverMessage);
            done();
        }));
        it('should get whatsapp route trip reminder message', () => {
            const messageDetails = {
                to: data.driver.driverPhoneNo,
                body: `Hello *${data.driver.driverName}*,`
                    + ` You have an upcoming trip on route *${routeMock_1.routeBatch.route.name}*\n\n`
                    + '*Batch*: undefined\n'
                    + `*Takes Off At*: ${routeMock_1.routeBatch.takeOff}\n`
                    + `*Cab Reg No*: ${routeMock_1.routeBatch.cabDetails.regNumber}\n\n`
                    + 'We wish you a safe trip.',
            };
            const sendMessage = index_1.default.getRouteTripReminderMessage(data.driver, routeMock_1.routeBatch);
            expect(sendMessage).toEqual(messageDetails);
        });
    });
});
//# sourceMappingURL=RouteNotifcations.spec.js.map