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
const client_1 = require("@slack/client");
const Notifications_1 = __importDefault(require("../Notifications"));
const slackEvents_1 = require("../../events/slackEvents");
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const WebClientSingleton_1 = __importDefault(require("../../../../utils/WebClientSingleton"));
const NotificationsResponse_1 = __importDefault(require("../NotificationsResponse"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const department_service_1 = require("../../../departments/department.service");
const route_request_service_1 = __importDefault(require("../../../routes/route-request.service"));
const index_1 = require("../../../../services/__mocks__/index");
const user_service_1 = __importDefault(require("../../../users/user.service"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const cache_1 = __importDefault(require("../../../shared/cache"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const twilio_mocks_1 = require("../../../notifications/whatsapp/twilio.mocks");
const slack_block_models_1 = require("../../../new-slack/models/slack-block-models");
const trip_request_1 = require("../../../../database/models/trip-request");
const interactions_1 = __importDefault(require("../../../new-slack/trips/manager/interactions"));
const providerMonthlyReport_1 = __importDefault(require("../../../report/providerMonthlyReport"));
twilio_mocks_1.mockWhatsappOptions();
const tripInitial = {
    id: 2,
    requestId: null,
    departmentId: 23,
    tripStatus: 'Approved',
    destination: { address: 'Dubai' },
    origin: { address: 'New York' },
    pickup: {},
    departureDate: null,
    requestDate: new Date(),
    requester: { slackId: '1234' },
    requestedById: 6,
    riderId: 6,
    rider: { slackId: '3456' },
    homebase: { channel: 'HU123' },
    decliner: { slackId: 'U1727U' },
    driver: { id: 767 },
    department: { headId: 3, head: { id: 4, slackId: 'U234' } },
    cab: {
        driverName: 'Dave',
        driverPhoneNo: '6789009876',
        regNumber: 'JK 321 LG'
    }
};
jest.spyOn(slackEvents_1.SlackEvents, 'raise').mockReturnValue();
const webClientMock = {
    im: {
        open: jest.fn().mockImplementation(({ user }) => Promise.resolve({
            channel: { id: `${user}${419}` }
        }))
    },
    chat: {
        postMessage: jest.fn().mockImplementation((data) => Promise.resolve({ data })),
    },
    users: {
        info: jest.fn().mockResolvedValue({
            user: { real_name: 'someName', profile: { email: 'someemial@email.com' } },
            token: 'sdf'
        }),
        profile: {
            get: jest.fn().mockResolvedValue({
                profile: {
                    tz_offset: 'someValue',
                    email: 'sekito.ronald@andela.com'
                }
            })
        }
    },
};
const dbRider = {
    id: 275,
    slackId: '456FDRF',
    name: 'rider Paul',
    phoneNo: null,
    email: 'rider@andela.com',
    defaultDestinationId: null,
    routeBatchId: null,
    createdAt: '2019-03-05T19:32:17.426Z',
    updatedAt: '2019-03-05T19:32:17.426Z'
};
const botToken = 'xoxop-11267';
const teamDetails = {
    botToken: 'just a token',
    webhookConfigUrl: 'just a url',
    opsChannelId: 'S199'
};
const initSpy = () => {
    const mockUser = { slackId: 3 };
    const mockDept = { name: 'Tembea DTP' };
    const result = ['12/2/2019', '12/12/2020', 'Mastercard'];
    jest.spyOn(WebClientSingleton_1.default, 'getWebClient').mockReturnValue(webClientMock);
    jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(result);
    jest.spyOn(department_service_1.departmentService, 'getById').mockResolvedValue(mockDept);
    jest.spyOn(department_service_1.departmentService, 'getHeadByDeptId').mockResolvedValue(mockDept);
    jest.spyOn(slackHelpers_1.default, 'findUserByIdOrSlackId').mockResolvedValue(mockUser);
    jest.spyOn(WebClientSingleton_1.default, 'getWebClient').mockReturnValue(webClientMock);
    jest.spyOn(client_1.IncomingWebhook.prototype, 'send').mockResolvedValue(true);
    jest.spyOn(user_service_1.default, 'findOrCreateNewUserWithSlackId').mockResolvedValue(dbRider);
    jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ channel: 'BBBBBB' });
    jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue(teamDetails);
    jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue(botToken);
    jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(tripInitial);
    jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
    jest.spyOn(Notifications_1.default, 'sendNotifications').mockResolvedValue(null);
    jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('YES');
};
describe(Notifications_1.default, () => {
    beforeEach(() => {
        initSpy();
        const mockUser = { slackId: 3 };
        const result = ['12/2/2019', '12/12/2020', 'Mastercard'];
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(result);
        jest.spyOn(department_service_1.departmentService, 'getById').mockResolvedValue(mockUser);
        jest.spyOn(department_service_1.departmentService, 'getHeadByDeptId').mockResolvedValue(mockUser);
        jest.spyOn(slackHelpers_1.default, 'findUserByIdOrSlackId').mockResolvedValue(mockUser);
        jest.spyOn(WebClientSingleton_1.default, 'getWebClient').mockReturnValue(webClientMock);
        jest.spyOn(client_1.IncomingWebhook.prototype, 'send').mockResolvedValue(true);
        jest.spyOn(user_service_1.default, 'findOrCreateNewUserWithSlackId').mockResolvedValue(dbRider);
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ channel: 'BBBBBB' });
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe(Notifications_1.default.getDMChannelId, () => {
        it('return an id as received from slack', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.restoreAllMocks();
            jest.spyOn(WebClientSingleton_1.default, 'getWebClient').mockReturnValue(webClientMock);
            const slackId = 'U123';
            const channelId = yield Notifications_1.default.getDMChannelId(slackId, botToken);
            expect(WebClientSingleton_1.default.getWebClient).toBeCalledWith(botToken);
            expect(channelId).toEqual(expect.stringContaining(slackId));
        }));
    });
    describe(Notifications_1.default.sendNotification, () => {
        it('should send notification', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.restoreAllMocks();
            jest.spyOn(WebClientSingleton_1.default, 'getWebClient').mockReturnValue(webClientMock);
            const testResponse = { channel: { id: 'XXXXXX' } };
            yield Notifications_1.default.sendNotification(testResponse, botToken);
            expect(WebClientSingleton_1.default.getWebClient).toHaveBeenCalledWith(botToken);
        }));
    });
    describe(Notifications_1.default.createUserConfirmOrDeclineMessage, () => {
        it('should send notification to user when ride has been confirmed', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield Notifications_1.default.createUserConfirmOrDeclineMessage(true, 'Confirmed');
            expect(res).toEqual('Your trip has been Confirmed, and it is awaiting driver and vehicle assignment');
        }));
        it('should send notification to user when ride has been confirmed', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield Notifications_1.default.createUserConfirmOrDeclineMessage(false, 'declined');
            expect(res).toEqual('Your trip has been declined');
        }));
    });
    describe(Notifications_1.default.sendRequesterDeclinedNotification, () => {
        beforeEach(() => {
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('YES');
        });
        it('should send error on decline', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockRejectedValue();
            jest.spyOn(bugsnagHelper_1.default, 'log').mockResolvedValue(null);
            const tripInfo = Object.assign({}, tripInitial);
            yield Notifications_1.default.sendRequesterDeclinedNotification(tripInfo, botToken);
            expect(bugsnagHelper_1.default.log).toBeCalled();
        }));
        it('should send decline notification', () => __awaiter(void 0, void 0, void 0, function* () {
            const tripInfo = Object.assign(Object.assign({}, tripInitial), { riderId: 123, requestedById: 299 });
            yield Notifications_1.default.sendRequesterDeclinedNotification(tripInfo, botToken);
            expect(Notifications_1.default.sendNotification).toBeCalledTimes(2);
        }));
    });
    describe(Notifications_1.default.sendManagerConfirmOrDeclineNotification, () => {
        beforeEach(() => {
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('YES');
        });
        it('should send manager notification', () => __awaiter(void 0, void 0, void 0, function* () {
            const tripInfo = {
                department: { headId: 3 },
                rider: { slackId: 3 },
                origin: { address: 'never land' },
                destination: { address: 'never land' },
                cab: {
                    driverName: 'Sunday',
                    driverPhoneNo: '001001001',
                    regNumber: '1928dfsgg'
                }
            };
            const [userId, teamId] = [3, 'HAHJDILYR'];
            const declineStatus = false;
            yield Notifications_1.default.sendManagerConfirmOrDeclineNotification(teamId, userId, tripInfo, declineStatus);
            expect(Notifications_1.default.sendNotification)
                .toHaveBeenCalledWith(expect.any(Object), botToken);
        }));
        it('should send manager confirmation notification', () => __awaiter(void 0, void 0, void 0, function* () {
            const tripInfo = Object.assign({}, tripInitial);
            const payload = {
                user: { id: 3 },
                team: { id: 'HAHJDILYR' },
                submission: {
                    driverName: 'driverName', driverPhoneNo: 'driverPhoneNo', regNumber: 'regNumber'
                }
            };
            const { user: { id: userId }, team: { id: teamId } } = payload;
            const declineStatus = true;
            yield Notifications_1.default.sendManagerConfirmOrDeclineNotification(teamId, userId, tripInfo, declineStatus);
            expect(Notifications_1.default.sendNotification)
                .toHaveBeenCalledWith(expect.any(Object), botToken);
        }));
    });
    describe(Notifications_1.default.sendWebhookPushMessage, () => {
        it('should call IncomingWebhook send method', () => __awaiter(void 0, void 0, void 0, function* () {
            const [webhookUrl, message] = ['https://hello.com', 'Welcome to tembea'];
            const result = yield Notifications_1.default.sendWebhookPushMessage(webhookUrl, message);
            expect(client_1.IncomingWebhook.prototype.send).toHaveBeenCalledWith(message);
            expect(result).toBeTruthy();
        }));
    });
    describe(Notifications_1.default.sendUserConfirmOrDeclineNotification, () => {
        const opsStatus = true;
        const payload = {
            user: { id: 3 },
            team: { id: 'HAHJDILYR' },
            submission: {
                driverName: 'driverName', driverPhoneNo: 'driverPhoneNo', regNumber: 'regNumber'
            }
        };
        beforeEach(() => {
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('YES');
        });
        const { user: { id: userId }, team: { id: teamId } } = payload;
        it('should send user notification once when requester is equal to rider', () => __awaiter(void 0, void 0, void 0, function* () {
            const testT = Object.assign({}, tripInitial);
            testT.rider.slackId = 3;
            const res = yield Notifications_1.default.sendUserConfirmOrDeclineNotification(teamId, userId, testT, false, opsStatus);
            expect(res).toEqual(undefined);
        }));
        it('should send user notification twice when requester is not equal to rider', () => __awaiter(void 0, void 0, void 0, function* () {
            const testT = Object.assign({}, tripInitial);
            testT.rider.slackId = 4;
            const res = yield Notifications_1.default.sendUserConfirmOrDeclineNotification(teamId, userId, testT, false, opsStatus);
            expect(res).toEqual(undefined);
        }));
    });
    describe(Notifications_1.default.sendOperationsTripRequestNotification, () => {
        let sendRequesterApprovedNotification;
        const testTrip = Object.assign(Object.assign({}, tripInitial), { tripType: trip_request_1.TripTypes.regular });
        beforeEach(() => {
            jest.spyOn(Notifications_1.default, 'sendNotification');
            sendRequesterApprovedNotification = jest.spyOn(interactions_1.default, 'sendRequesterApprovedNotification');
            jest.spyOn(NotificationsResponse_1.default, 'getOpsTripRequestMessage').mockResolvedValue(new slack_block_models_1.BlockMessage([]));
            sendRequesterApprovedNotification.mockResolvedValue();
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should notify ops on manager\'s approval', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Notifications_1.default.sendOperationsTripRequestNotification(testTrip, botToken);
            jest.spyOn(interactions_1.default, 'sendRequesterApprovedNotification').mockResolvedValue();
            expect(interactions_1.default.sendRequesterApprovedNotification).toHaveBeenCalled();
        }));
        it('should test for that that is not regular', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Notifications_1.default.sendOperationsTripRequestNotification(Object.assign(Object.assign({}, testTrip), { tripType: trip_request_1.TripTypes.airportTransfer }), botToken);
            expect(interactions_1.default.sendRequesterApprovedNotification).not.toHaveBeenCalled();
            expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
        }));
    });
    describe(Notifications_1.default.sendOperationsNewRouteRequest, () => {
        let getTeamDetails;
        let routeRequestDetails;
        beforeEach(() => {
            getTeamDetails = jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails');
            getTeamDetails.mockImplementationOnce(() => ({ botToken: 'slackBotOauthToken', opsChannelId: 1 }));
            routeRequestDetails = jest.spyOn(route_request_service_1.default, 'getRouteRequest');
            routeRequestDetails.mockImplementation(() => ({
                distance: 2,
                busStopDistance: 3,
                routeImageUrl: 'image',
                busStop: { address: 'busstop' },
                home: { address: 'home' },
                manager: { slackId: '1234' },
                engagement: {
                    partner: { name: 'partner' },
                    startDate: '11-12-2018',
                    endDate: '11-12-2019',
                    workHours: '10:00-22:00',
                    fellow: { slackId: '4321' }
                }
            }));
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should send route request to ops channel', () => __awaiter(void 0, void 0, void 0, function* () {
            const teamId = 'AHDJDLKUER';
            jest.spyOn(route_request_service_1.default, 'getRouteRequest')
                .mockResolvedValue(index_1.mockRouteRequestData);
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails')
                .mockResolvedValue({ botToken: 'AAAAAA' });
            jest.spyOn(Notifications_1.default, 'sendOperationsNotificationFields');
            jest.spyOn(Notifications_1.default, 'sendNotifications')
                .mockResolvedValue({ ts: '122123423.053234' });
            yield Notifications_1.default.sendOperationsNewRouteRequest(teamId, '1');
            expect(Notifications_1.default.sendOperationsNotificationFields)
                .toHaveBeenCalledWith(index_1.mockRouteRequestData);
            expect(Notifications_1.default.sendNotifications).toHaveBeenCalledTimes(1);
        }));
    });
    describe(Notifications_1.default.sendRiderlocationConfirmNotification, () => {
        it('Should send request to rider', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Notifications_1.default.sendRiderlocationConfirmNotification({
                location: 'location',
                teamID: 'teamID',
                userID: 1,
                rider: 1
            });
            expect(Notifications_1.default.sendNotifications).toHaveBeenCalled();
        }));
    });
    describe(Notifications_1.default.sendOperationsRiderlocationConfirmation, () => {
        it('Should send confrimation to Ops', () => __awaiter(void 0, void 0, void 0, function* () {
            const sendNotifications = jest.spyOn(Notifications_1.default, 'sendNotifications');
            const getTeamDetails = jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue({
                botToken: { slackBotOauthToken: 'yahaha' },
                opsChannelId: 'qwertyuoi'
            });
            yield Notifications_1.default.sendOperationsRiderlocationConfirmation({
                riderID: 1,
                teamID: 'rtyui',
                confirmedLocation: 'Nairobi',
                waitingRequester: 1,
                location: 'Pickup'
            }, jest.fn());
            expect(getTeamDetails).toHaveBeenCalled();
            expect(sendNotifications).toHaveBeenCalled();
        }));
        it('Should call respond and bugsnug when error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            const respond = jest.fn();
            jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue({});
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockImplementation(() => {
                throw new Error('Dummy error');
            });
            const payload = {
                riderID: 1,
                teamID: 'rtyui',
                confirmedLocation: 'Nairobi',
                waitingRequester: 1,
                location: 'Pickup'
            };
            yield Notifications_1.default.sendOperationsRiderlocationConfirmation(payload, respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(respond).toHaveBeenCalled();
        }));
    });
    describe(Notifications_1.default.getCancelAttachment, () => {
        beforeEach(() => {
            jest.spyOn(user_service_1.default, 'findOrCreateNewUserWithSlackId').mockResolvedValue({});
            jest.spyOn(Notifications_1.default, 'notificationFields').mockResolvedValue({});
        });
        it('Should get manager cancel attachment when requester is rider', () => __awaiter(void 0, void 0, void 0, function* () {
            const [newTripRequest, imResponse, requester, rider] = [
                {}, {}, { slackId: '090OPI' }, { slackId: '090OPI' }
            ];
            const fields = [
                new slack_block_models_1.MarkdownText('*Pickup Location*:\nAndela office'),
                new slack_block_models_1.MarkdownText('*Destination*:\nKigali Lodge')
            ];
            jest.spyOn(Notifications_1.default, 'notificationFields').mockResolvedValue(fields);
            yield Notifications_1.default.getCancelAttachment(newTripRequest, imResponse, requester, rider);
            expect(Notifications_1.default.notificationFields).toHaveBeenCalled();
        }));
        it('Should get manager cancel attachment when requester is not rider', () => __awaiter(void 0, void 0, void 0, function* () {
            const [newTripRequest, imResponse, requester, rider] = [
                {}, {}, { slackId: '090OPJKL' }, { slackId: '090OPI' }
            ];
            const fields = [
                new slack_block_models_1.MarkdownText('*Pickup Location*:\nAndela office'),
                new slack_block_models_1.MarkdownText('*Destination*:\nKigali Lodge')
            ];
            jest.spyOn(Notifications_1.default, 'notificationFields').mockResolvedValue(fields);
            yield Notifications_1.default.getCancelAttachment(newTripRequest, imResponse, requester, rider);
            expect(Notifications_1.default.notificationFields).toHaveBeenCalled();
        }));
    });
    describe(Notifications_1.default.sendManagerCancelNotification, () => {
        const tripInfo = {
            id: '090OPI', departmentId: '090OPI', requestedById: '090OPI', riderId: '090OPI'
        };
        const respond = jest.fn();
        const data = { team: { id: 'teamId' } };
        beforeEach(() => {
            jest.spyOn(department_service_1.departmentService, 'getHeadByDeptId').mockResolvedValue({ slackId: 'OOO908' });
            jest.spyOn(slackHelpers_1.default, 'findUserByIdOrSlackId').mockResolvedValue('Adaeze');
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({});
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('TKD44OL');
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue({});
        });
        it('Should send manager notification successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getCancelAttachment').mockResolvedValue({});
            const getCancelAttachmentSpy = jest.spyOn(Notifications_1.default, 'getCancelAttachment');
            yield Notifications_1.default.sendManagerCancelNotification(data, tripInfo, respond);
            expect(department_service_1.departmentService.getHeadByDeptId).toHaveBeenCalled();
            expect(trip_service_1.default.getById).toHaveBeenCalled();
            expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalled();
            expect(getCancelAttachmentSpy).toHaveBeenCalled();
        }));
        it('Should run the catch block when there is an error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getCancelAttachment').mockRejectedValue({});
            yield Notifications_1.default.sendManagerCancelNotification(data, tripInfo, respond);
            expect(respond).toHaveBeenCalled();
        }));
    });
    describe(Notifications_1.default.sendOpsCancelNotification, () => {
        const respond = jest.fn();
        const data = { team: { id: 'teamId' } };
        const tripInfo = {
            requester: '090OPI', rider: '090OPI'
        };
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue({});
        });
        it('Should send cancel notification to the operations team', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getCancelAttachment').mockResolvedValue({});
            const sendNotificationSpy = jest.spyOn(Notifications_1.default, 'sendNotification');
            yield Notifications_1.default.sendOpsCancelNotification(data, tripInfo, respond);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetails).toHaveBeenCalled();
            expect(Notifications_1.default.getCancelAttachment).toHaveBeenCalled();
            expect(sendNotificationSpy).toHaveBeenCalled();
        }));
        it('Should run catch block when there is an error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'getCancelAttachment').mockRejectedValue({});
            yield Notifications_1.default.sendOpsCancelNotification(data, tripInfo, respond);
            expect(respond).toHaveBeenCalled();
        }));
    });
    describe(Notifications_1.default.getOpsMessageAttachment, () => {
        const initialTrip = Object.assign({}, tripInitial);
        it('sends notification to ops when user has booked themselves', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = Notifications_1.default.getOpsMessageAttachment(initialTrip, 1, 'HURT1234');
            expect(result).toBeInstanceOf(slack_block_models_1.BlockMessage);
        }));
        it('sends notification to ops when user has been booked for', () => __awaiter(void 0, void 0, void 0, function* () {
            const nTripRequest = Object.assign(Object.assign({}, initialTrip), { rider: { slackId: 'HGY1234' } });
            const result = Notifications_1.default.getOpsMessageAttachment(nTripRequest, 1, 'HURT1234');
            expect(result).toBeInstanceOf(slack_block_models_1.BlockMessage);
        }));
    });
    describe(Notifications_1.default.sendOpsTripRequestNotification, () => {
        const trip = {
            requestedById: 'Hello123',
            riderId: 10,
            departmentId: 2,
            id: 3,
            channel: { id: 'DL90XKSM6', name: 'directmessage' },
        };
        const dataReturned = {
            botToken: 'WELL1',
            opsChannelId: 2
        };
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue(dataReturned);
            jest.spyOn(Notifications_1.default, 'sendNotification');
            jest.spyOn(Notifications_1.default, 'opsNotificationMessage');
            bugsnagHelper_1.default.log = jest.fn();
        });
        it('should send a notification to the operations team when a user request a trip', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = { opsRequestMessage: 'Trip message', botToken: 'RDFT45' };
            jest.spyOn(Notifications_1.default, 'opsNotificationMessage').mockResolvedValue(mockResponse);
            yield Notifications_1.default.sendOpsTripRequestNotification(trip, { teamId: 'U1234' });
            expect(Notifications_1.default.sendNotification).toHaveBeenCalledWith('Trip message', 'RDFT45');
        }));
        it('should returns an error when the notification fails to send', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'opsNotificationMessage').mockImplementation(() => jest.fn());
            jest.spyOn(Notifications_1.default, 'sendNotification').mockRejectedValueOnce('An error just occured');
            yield Notifications_1.default.sendOpsTripRequestNotification(trip, { teamId: 'U1234' });
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith('An error just occured');
        }));
    });
    describe(Notifications_1.default.sendOpsPostRatingMessage, () => {
        it('should send a notification to the operations team when a user complete and rate a trip', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                type: 'interactive_message',
                actions: [{ name: '1', type: 'button', value: '1' }],
                callback_id: 'rate_trip',
                team: { id: 'TP0G7J00A', domain: 'tembea' },
                channel: { id: 'AA1AA11111', name: 'directmessage' },
                user: { id: 'UP3SJTDPY', name: 'john.doe' },
                action_ts: '1572867898.763198',
                message_ts: '1572867893.000700',
                attachment_id: '1',
                token: 'AGED4OXhDrpvW3MWU9PNGER',
                is_app_unfurl: false,
                original_message: {
                    type: 'message',
                    subtype: 'bot_message',
                    text: '*Please rate this trip on a scale of \'1 - 5\' :star: *',
                    ts: '1572867893.000700',
                    username: 'tembea',
                    bot_id: 'BNQ0PSR00',
                    attachments: [[Object]]
                },
                response_url: 'https://sample.com/api/john.doe',
                trigger_id: '117514386930.120001619011.A3PD3d0a4d1dd248dldldhlkgahd'
            };
            const fieldsAttachement = [
                { text: '*Passenger*: John', type: 'mrkdwn' },
                { text: '*Pickup Location*: Kigali, Kimironko', type: 'mrkdwn' },
            ];
            jest.mock('../../SlackModels/SlackMessageModels');
            const getMockedTrip = jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails')
                .mockResolvedValue({ botToken: 'SADFMH4', opsChannelId: '34U5KQEJ' });
            const mockedFieldsAttachment = jest.spyOn(NotificationsResponse_1.default, 'getOpsTripBlocksFields').mockResolvedValue(fieldsAttachement);
            yield Notifications_1.default.sendOpsPostRatingMessage(payload);
            expect(getMockedTrip).toHaveBeenCalledWith(payload.team.id);
            expect(mockedFieldsAttachment).toHaveBeenCalledWith(1);
        }));
    });
    describe.only(Notifications_1.default.sendOpsProvidersTripsReport, () => {
        const opsProviderReport = {
            CS2AL04QH: {
                total: 10,
                month: 'Jan, 2020',
                name: 'NAIROBI',
                providersData: [
                    {
                        name: 'YEGO',
                        trips: 2,
                        percantage: 100
                    }
                ]
            }
        };
        const dataReturned = {
            botToken: 'WELL1'
        };
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue(dataReturned);
            jest.spyOn(NotificationsResponse_1.default, 'getOpsProviderTripsFields');
        });
        it('should send a providers report to ops channel', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(providerMonthlyReport_1.default, 'generateData')
                .mockResolvedValue(opsProviderReport);
            yield Notifications_1.default.sendOpsProvidersTripsReport();
            expect(Notifications_1.default.sendNotification).toHaveBeenCalled();
        }));
        it('should not send a providers report to ops channel', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(providerMonthlyReport_1.default, 'generateData')
                .mockResolvedValue({});
            yield Notifications_1.default.sendOpsProvidersTripsReport();
            expect(Notifications_1.default.sendNotification).toHaveBeenCalledTimes(0);
        }));
    });
    describe(Notifications_1.default.requestFeedbackMessage, () => {
        it('should send notification to users', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                .mockReturnValueOnce({ botToken: 'lelelele' });
            const spyOnNotification = jest.spyOn(Notifications_1.default, 'sendNotifications')
                .mockReturnValue('notification sent');
            jest.spyOn(user_service_1.default, 'getUsersSlackId')
                .mockReturnValueOnce([{ slackId: 'kekek', name: 'name' }]);
            yield Notifications_1.default.requestFeedbackMessage();
            expect(spyOnNotification).toHaveBeenCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=Notifications.spec.js.map