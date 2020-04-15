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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const TripsControllerMock_1 = require("./__mocks__/TripsControllerMock");
const TripsController_1 = __importDefault(require("../TripsController"));
const TripActionsController_1 = __importDefault(require("../../slack/TripManagement/TripActionsController"));
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const user_service_1 = __importDefault(require("../../users/user.service"));
const RouteUseRecordService_1 = __importDefault(require("../../../services/RouteUseRecordService"));
const mocked = __importStar(require("./__mocks__"));
const trip_service_1 = __importDefault(require("../trip.service"));
const ProvidersHelper_1 = __importDefault(require("../../slack/helpers/slackHelpers/ProvidersHelper"));
const ProviderNotifications_1 = __importDefault(require("../../slack/SlackPrompts/notifications/ProviderNotifications"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const homebase_service_1 = require("../../homebases/homebase.service");
const database_1 = __importDefault(require("../../../database"));
const cab_service_1 = require("../../cabs/cab.service");
const driver_service_1 = require("../../drivers/driver.service");
const provider_service_1 = require("../../providers/provider.service");
const TripHelper_1 = __importDefault(require("../../../helpers/TripHelper"));
describe('TripController', () => {
    const { mockedValue: { routes: trips } } = mocked, rest = __rest(mocked, ["mockedValue"]);
    let req;
    beforeEach(() => {
        req = { query: { page: 1 } };
        const mockedData = {
            trips, totalPages: 2, pageNo: 1, totalItems: 1, itemsPerPage: 100
        };
        jest.spyOn(trip_service_1.default, 'getTrips').mockResolvedValue(mockedData);
        jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(mocked.mockTrip.trip[0]);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    afterAll((done) => database_1.default.close().then(done));
    describe('TripController_getTrips', () => {
        it('Should get all trips value', () => __awaiter(void 0, void 0, void 0, function* () {
            const { resultValue: { message, success, data: mockedData }, response: res } = rest;
            req = Object.assign(Object.assign({}, req), { currentUser: {
                    userInfo: {
                        email: 'emma.ogwal@andela.com',
                    }
                }, headers: { homebaseid: 1 } });
            const data = Object.assign(Object.assign({}, mockedData), { trips });
            jest.spyOn(user_service_1.default, 'getUserByEmail').mockImplementation(() => ({ homebaseId: 1 }));
            jest.spyOn(trip_service_1.default, 'getTrips').mockImplementation(() => ({
                totalPages: 2, trips, page: 1, totalItems: 1, itemsPerPage: 100
            }));
            yield TripsController_1.default.getTrips(req, res);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.status().json).toHaveBeenCalledWith({
                data,
                message,
                success
            });
        }));
        it('Should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const { response: res } = rest;
            req = Object.assign(Object.assign({}, req), { currentUser: {
                    userInfo: {
                        email: 'emma.ogwal@andela.com',
                    }
                }, headers: { homebaseid: 1 } });
            jest
                .spyOn(trip_service_1.default, 'getTrips')
                .mockRejectedValue(new Error('dummy error'));
            jest.spyOn(user_service_1.default, 'getUserByEmail').mockImplementation(() => ({ homebaseId: 1 }));
            yield TripsController_1.default.getTrips(req, res);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({
                message: 'dummy error',
                success: false
            });
        }));
    });
    describe('TripsController for update trip', () => {
        let reqConfirm;
        let req2;
        let reqDecline;
        let res;
        let payload;
        beforeEach(() => {
            reqConfirm = {
                body: {
                    driverName: 'nn',
                    driverPhoneNo: '0777777777',
                    regNumber: 'lmnbv',
                    comment: 'ns',
                    slackUrl: 'sokoolworkspace.slack.com'
                },
                params: { tripId: 3 },
                query: { action: 'confirm' }
            };
            reqDecline = {
                body: {
                    driverName: 'nn',
                    driverPhoneNo: '0777777777',
                    regNumber: 'lmnbv',
                    comment: 'ns',
                    slackUrl: 'sokoolworkspace.slack.com'
                },
                params: { tripId: 3 },
                query: { action: 'decline' }
            };
            req2 = {
                body: {
                    driverName: 'nn',
                    comment: 'ns',
                    slackUrl: 'sokoolworkspace.slack.com'
                },
                params: { tripId: 3 },
                query: { action: 'confirm' }
            };
            res = {
                status: jest
                    .fn(() => ({
                    json: jest.fn(() => { })
                }))
                    .mockReturnValue({ json: jest.fn() })
            };
            payload = {
                user: { id: 'UG9MG84U8' },
                team: { id: 'TGAAF6X8T' },
                channel: { id: 'CGACQJAE8' },
                state: '{"trip":"16","tripId":"16","actionTs":"1550735688.001800"}',
                submission: {
                    confirmationComment: 'ns',
                    driverName: 'sksk',
                    driverPhoneNo: '093839',
                    regNumber: '938'
                },
            };
            jest.spyOn(ProvidersHelper_1.default, 'getProviderUserDetails').mockResolvedValue({});
            jest.spyOn(TripActionsController_1.default, 'getTripNotificationDetails').mockResolvedValue({});
            jest.spyOn(ProviderNotifications_1.default, 'sendTripNotification').mockResolvedValue({});
        });
        afterEach((done) => {
            jest.restoreAllMocks();
            done();
        });
        describe('updateTrip() with confirm', () => {
            it('updateTrip should run with confirm  success', () => __awaiter(void 0, void 0, void 0, function* () {
                jest
                    .spyOn(TripsController_1.default, 'getCommonPayloadParam')
                    .mockResolvedValue(payload);
                jest
                    .spyOn(TripsController_1.default, 'getSlackIdFromReq')
                    .mockResolvedValue('UG9MG84U8');
                jest
                    .spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                    .mockResolvedValue({ teamId: 'kkk', opsChannelId: 'kk' });
                jest
                    .spyOn(TripActionsController_1.default, 'changeTripStatus')
                    .mockResolvedValue('success');
                yield TripsController_1.default.updateTrip(reqConfirm, res);
                expect(TripActionsController_1.default.changeTripStatus).toHaveBeenCalledTimes(1);
                expect(res.status().json).toHaveBeenCalledTimes(1);
                expect(res.status().json).toHaveBeenLastCalledWith(TripsControllerMock_1.TripConfirmSuccessMock);
            }));
            it('updateTrip() should run with decline success', () => __awaiter(void 0, void 0, void 0, function* () {
                jest
                    .spyOn(TripsController_1.default, 'getCommonPayloadParam')
                    .mockResolvedValue(payload);
                jest
                    .spyOn(TripsController_1.default, 'getSlackIdFromReq')
                    .mockResolvedValue('UG9MG84U8');
                jest
                    .spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                    .mockResolvedValue({ teamId: 'kkk', opsChannelId: 'kk' });
                jest
                    .spyOn(TripActionsController_1.default, 'changeTripStatus')
                    .mockResolvedValue('success');
                yield TripsController_1.default.updateTrip(reqDecline, res);
                expect(TripActionsController_1.default.changeTripStatus).toHaveBeenCalledTimes(1);
                expect(res.status().json).toHaveBeenCalledTimes(1);
                expect(res.status().json).toHaveBeenLastCalledWith(TripsControllerMock_1.TripDeclineSuccessMock);
            }));
            it('updateTrip() should run with decline fail', () => __awaiter(void 0, void 0, void 0, function* () {
                jest
                    .spyOn(TripsController_1.default, 'getCommonPayloadParam')
                    .mockResolvedValue(payload);
                jest
                    .spyOn(TripsController_1.default, 'getSlackIdFromReq')
                    .mockResolvedValue('UG9MG84U8');
                jest
                    .spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                    .mockResolvedValue({ teamId: 'kkk', opsChannelId: 'kk' });
                jest
                    .spyOn(TripActionsController_1.default, 'changeTripStatus')
                    .mockResolvedValue({ text: 'failed' });
                yield TripsController_1.default.updateTrip(reqDecline, res);
                expect(TripActionsController_1.default.changeTripStatus).toHaveBeenCalledTimes(1);
                expect(res.status().json).toHaveBeenCalledTimes(1);
                expect(res.status().json).toHaveBeenLastCalledWith(TripsControllerMock_1.TripConfirmFailMock);
            }));
            it('updateTrip() should run with confirm fail', () => __awaiter(void 0, void 0, void 0, function* () {
                jest
                    .spyOn(TripsController_1.default, 'getCommonPayloadParam')
                    .mockResolvedValue(payload);
                jest
                    .spyOn(TripsController_1.default, 'getSlackIdFromReq')
                    .mockResolvedValue('UG9MG84U8');
                jest
                    .spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                    .mockResolvedValue({ teamId: 'kkk', opsChannelId: 'kk' });
                jest
                    .spyOn(TripActionsController_1.default, 'changeTripStatus')
                    .mockResolvedValue({ text: 'failed' });
                yield TripsController_1.default.updateTrip(reqConfirm, res);
                expect(TripActionsController_1.default.changeTripStatus).toHaveBeenCalledTimes(1);
                expect(res.status().json).toHaveBeenCalledTimes(1);
                expect(res.status().json).toHaveBeenLastCalledWith(TripsControllerMock_1.TripConfirmFailMock);
            }));
            it('getSlackIdFromReq() should return user Id', (done) => {
                jest
                    .spyOn(user_service_1.default, 'getUserByEmail')
                    .mockResolvedValue({});
                TripsController_1.default.getSlackIdFromReq({ userInfo: { email: 'paul@andela.com' } });
                expect(user_service_1.default.getUserByEmail).toHaveBeenCalledTimes(1);
                done();
            });
            it('getCommonPayloadParam() should should get payload', () => __awaiter(void 0, void 0, void 0, function* () {
                jest
                    .spyOn(TripsController_1.default, 'getSlackIdFromReq')
                    .mockResolvedValue('UG9MG84U8');
                jest
                    .spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                    .mockResolvedValue({ teamId: 'kkk', opsChannelId: 'kk' });
                jest.spyOn(homebase_service_1.homebaseService, 'getById').mockResolvedValue({ id: 1, name: 'Nairobi', channel: 12 });
                yield TripsController_1.default.getCommonPayloadParam('', '', '');
                expect(teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl).toHaveBeenCalledTimes(1);
                expect(TripsController_1.default.getSlackIdFromReq).toHaveBeenCalledTimes(1);
            }));
            it('updateTrip() with missing data', () => __awaiter(void 0, void 0, void 0, function* () {
                jest
                    .spyOn(TripsController_1.default, 'getCommonPayloadParam')
                    .mockResolvedValue(payload);
                jest
                    .spyOn(TripActionsController_1.default, 'changeTripStatus')
                    .mockResolvedValue({ text: 'failed' });
                yield TripsController_1.default.updateTrip(req2, res);
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.status().json).toHaveBeenCalledTimes(1);
            }));
        });
        describe('TripController_getTravelTrips', () => {
            let request;
            const { response: resMock, mockedTravelTrips } = mocked;
            beforeEach(() => {
                request = {
                    body: {
                        startDate: '2018-11-15 00:0',
                        endDate: '2019-11-15 03:00',
                        departmentList: ['People', 'D0 Programs']
                    },
                    headers: { homebaseid: 1 }
                };
                jest.spyOn(trip_service_1.default, 'getCompletedTravelTrips').mockResolvedValue(mockedTravelTrips.data);
            });
            afterEach(() => {
                jest.resetAllMocks();
                jest.restoreAllMocks();
            });
            describe('TripController_getTravelTrips_Success', () => {
                it('Should get all Travel trips', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield TripsController_1.default.getTravelTrips(request, resMock);
                    expect(resMock.status).toHaveBeenCalled();
                    expect(resMock.status).toHaveBeenCalledWith(200);
                }));
            });
            describe('TripController_getRouteTrips', () => {
                const requestQuery = {
                    query: { page: 1, size: 1 },
                    headers: { homebaseid: 1 }
                };
                it('should get all route trips', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield TripsController_1.default.getRouteTrips(requestQuery, res);
                    expect(res.status).toHaveBeenCalled();
                    expect(res.status).toHaveBeenCalledWith(200);
                }));
                it('should return empty array if no records are available', () => __awaiter(void 0, void 0, void 0, function* () {
                    jest.spyOn(RouteUseRecordService_1.default, 'getRouteTripRecords')
                        .mockResolvedValue({ data: null });
                    yield TripsController_1.default.getRouteTrips(requestQuery, res);
                    expect(res.status).toHaveBeenCalled();
                    expect(res.status).toHaveBeenCalledWith(200);
                }));
                it('should return error response if error is thrown', () => __awaiter(void 0, void 0, void 0, function* () {
                    RouteUseRecordService_1.default.getRouteTripRecords = jest.fn()
                        .mockRejectedValue(new Error('network error'));
                    jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
                    yield TripsController_1.default.getRouteTrips(requestQuery, res);
                    expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
                }));
            });
            describe('TripController_providerConfirm', () => {
                const reqst = {
                    body: {
                        providerId: 4,
                        tripId: 898,
                        teamId: 'TPDKFR8TE',
                        vehicleRegNo: 'LSK-23-HJS',
                        driverName: 'Test Driver',
                        driverPhoneNo: '+23481989388390',
                        vehicleModel: 'Avensisz',
                        color: 'yellow'
                    }
                };
                const provider = { id: 4 };
                const trip = { id: 898 };
                const driver = { id: 2 };
                const cab = { id: 3 };
                it('should let the provider to confirm a trip', () => __awaiter(void 0, void 0, void 0, function* () {
                    jest.spyOn(provider_service_1.providerService, 'getProviderById').mockResolvedValue(provider);
                    jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(trip);
                    jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue({ teamId: 'TPDKFR8TE' });
                    jest.spyOn(driver_service_1.driverService, 'create').mockResolvedValue(driver);
                    jest.spyOn(cab_service_1.cabService, 'findOrCreateCab').mockResolvedValue({ cab });
                    jest.spyOn(trip_service_1.default, 'completeCabAndDriverAssignment').mockResolvedValue({});
                    yield TripsController_1.default.providerConfirm(reqst, res);
                    expect(provider_service_1.providerService.getProviderById).toHaveBeenCalledWith(4);
                    expect(trip_service_1.default.getById).toHaveBeenCalledWith(898, true);
                    expect(teamDetails_service_1.teamDetailsService.getTeamDetails).toHaveBeenCalledWith('TPDKFR8TE');
                    expect(driver_service_1.driverService.create).toHaveBeenCalledWith('Test Driver', '+23481989388390', 4);
                    expect(cab_service_1.cabService.findOrCreateCab).toHaveBeenCalledWith('LSK-23-HJS', null, 'Avensisz', 4, 'yellow');
                    expect(trip_service_1.default.completeCabAndDriverAssignment).toHaveBeenCalledWith({
                        tripId: 898, updateData: { cabId: 3, driverId: 2 }, teamId: 'TPDKFR8TE'
                    });
                    expect(res.status).toHaveBeenCalledWith(201);
                    expect(res.status().json).toHaveBeenCalledTimes(1);
                }));
                it('should not confirm a trip if provider is not found', () => __awaiter(void 0, void 0, void 0, function* () {
                    jest.spyOn(TripHelper_1.default, 'checkExistence').mockResolvedValue(reqst);
                    jest.spyOn(provider_service_1.providerService, 'getProviderById').mockResolvedValue({ id: 100 });
                    yield TripsController_1.default.providerConfirm(reqst, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                }));
                it('should not confirm a trip if a trip is not found', () => __awaiter(void 0, void 0, void 0, function* () {
                    jest.spyOn(provider_service_1.providerService, 'getProviderById').mockResolvedValue(provider);
                    jest.spyOn(TripHelper_1.default, 'checkExistence').mockResolvedValue(reqst);
                    jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({ id: 200 });
                    yield TripsController_1.default.providerConfirm(reqst, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                }));
                it('should not confirm a trip if the team is not found', () => __awaiter(void 0, void 0, void 0, function* () {
                    jest.spyOn(provider_service_1.providerService, 'getProviderById').mockResolvedValue(provider);
                    jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(trip);
                    jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails').mockResolvedValue({ teamId: 'TPDKFR8' });
                    yield TripsController_1.default.providerConfirm(reqst, res);
                    expect(res.status).toHaveBeenCalledWith(404);
                }));
                it('should throw an error when it fails to complete trip confirmation', () => __awaiter(void 0, void 0, void 0, function* () {
                    const newRes = {
                        providerId: 4,
                    };
                    yield TripsController_1.default.providerConfirm(newRes, res);
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.status().json).toHaveBeenCalledTimes(1);
                }));
            });
        });
    });
});
//# sourceMappingURL=TripsController.spec.js.map