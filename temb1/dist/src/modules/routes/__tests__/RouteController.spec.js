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
const supertest_1 = __importDefault(require("supertest"));
const faker_1 = __importDefault(require("faker"));
const web_socket_event_service_1 = __importDefault(require("../../events/web-socket-event.service"));
const app_1 = __importDefault(require("../../../app"));
const utils_1 = __importDefault(require("../../../utils"));
const RouteController_1 = __importDefault(require("../RouteController"));
const RouteUsageController_1 = __importDefault(require("../RouteUsageController"));
const address_service_1 = require("../../addresses/address.service");
const googleMapsHelpers_1 = require("../../../helpers/googleMaps/googleMapsHelpers");
const GoogleMapsPlaceDetails_1 = __importDefault(require("../../../services/googleMaps/GoogleMapsPlaceDetails"));
const SlackMessageModels_1 = require("../../slack/SlackModels/SlackMessageModels");
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const route_service_1 = require("../route.service");
const route_request_service_1 = __importDefault(require("../route-request.service"));
const __mocks__1 = require("../../../services/__mocks__");
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const slackEvents_1 = require("../../slack/events/slackEvents");
const user_service_1 = __importDefault(require("../../users/user.service"));
const routeBatch_service_1 = require("../../routeBatches/routeBatch.service");
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const RouteNotifications_1 = __importDefault(require("../../slack/SlackPrompts/notifications/RouteNotifications"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const batchUseRecord_service_1 = require("../../batchUseRecords/batchUseRecord.service");
const RouteHelper_1 = __importDefault(require("../../../helpers/RouteHelper"));
const routeMock_1 = require("../__mocks__/routeMock");
const mockData_1 = require("../__mocks__/mockData");
const database_1 = __importDefault(require("../../../database"));
const trip_events_handlers_1 = __importDefault(require("../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../slack/__mocks__/socket.ioMock"));
const { models: { Route, RouteBatch, RouteUseRecord } } = database_1.default;
const assertRouteInfo = (body) => {
    expect(body)
        .toHaveProperty('status');
    expect(body)
        .toHaveProperty('takeOff');
    expect(body)
        .toHaveProperty('capacity');
    expect(body)
        .toHaveProperty('batch');
    expect(body)
        .toHaveProperty('inUse');
    expect(body)
        .toHaveProperty('id');
};
beforeEach(() => {
    jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
});
describe('RoutesController', () => {
    let validToken;
    beforeAll(() => {
        validToken = utils_1.default.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database_1.default.close();
    }));
    describe('deleteRouteBatch()', () => {
        let req;
        let res;
        beforeEach(() => {
            req = {
                params: {
                    routeBatchId: 2
                },
                body: {
                    teamUrl: 'url.slack.com'
                }
            };
            res = {
                status: jest.fn(() => ({
                    json: jest.fn(() => { })
                })).mockReturnValue({ json: jest.fn() })
            };
        });
        it('should delete a routeBatch', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue(__mocks__1.mockRouteBatchData);
            jest.spyOn(routeBatch_service_1.routeBatchService, 'deleteRouteBatch').mockImplementation(() => 1);
            jest.spyOn(slackEvents_1.SlackEvents, 'raise').mockImplementationOnce(() => { });
            yield RouteController_1.default.deleteRouteBatch(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.status().json).toHaveBeenCalledWith({
                message: 'route batch deleted successfully', success: true
            });
        }));
        it('should return a not found error', () => __awaiter(void 0, void 0, void 0, function* () {
            const spy = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull');
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue(false);
            jest.spyOn(routeBatch_service_1.routeBatchService, 'deleteRouteBatch').mockResolvedValue(0);
            yield RouteController_1.default.deleteRouteBatch(req, res);
            expect(errorHandler_1.default.throwErrorIfNull).toHaveBeenCalledTimes(1);
            expect(errorHandler_1.default.throwErrorIfNull).toHaveBeenCalledWith(false, 'route batch not found');
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(404);
            spy.mockRestore();
        }));
    });
    describe('getAll()', () => {
        let req;
        let res;
        beforeEach(() => {
            req = {};
            res = {
                status: jest.fn(() => ({
                    json: jest.fn(() => { })
                })).mockReturnValue({ json: jest.fn() })
            };
        });
        it('should return all route requests', () => __awaiter(void 0, void 0, void 0, function* () {
            req = { currentUser: { userInfo: { email: 'ddd@gmail.com' } } };
            jest.spyOn(route_request_service_1.default, 'getAllConfirmedRouteRequests')
                .mockResolvedValue(__mocks__1.mockRouteRequestData);
            jest.spyOn(user_service_1.default, 'getUserByEmail')
                .mockImplementation(() => ({ homebaseId: 1 }));
            yield RouteController_1.default.getAll(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.status().json).toHaveBeenCalledTimes(1);
            expect(res.status().json).toHaveBeenCalledWith({ routes: __mocks__1.mockRouteRequestData });
        }));
        it('should throw an Error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_request_service_1.default, 'getAllConfirmedRouteRequests')
                .mockImplementation(() => {
                throw Error('This is an error');
            });
            yield RouteController_1.default.getAll(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledTimes(1);
            expect(res.status().json).toHaveBeenCalledWith({
                message: 'An error has occurred', success: false
            });
        }));
    });
    describe('getOne', () => {
        let req;
        let res;
        beforeEach(() => {
            req = {
                params: {
                    id: 2
                }
            };
            res = {
                status: jest.fn(() => ({})).mockReturnValue({ json: jest.fn() })
            };
        });
        it('should give error message if route doesnt exist', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/routes/178882')
                .set('Content-Type', 'application/json')
                .set('Authorization', validToken)
                .expect(404, (err, response) => {
                const { body } = response;
                expect(body).toHaveProperty('message');
                expect(body).toEqual({ message: 'Route not found', success: false });
                done();
            });
        });
        it('should successfully fetch one routes', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_service_1.routeService, 'getRouteById').mockResolvedValue(__mocks__1.mockRouteBatchData);
            yield RouteController_1.default.getOne(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.status().json).toHaveBeenCalledTimes(1);
            expect(res.status().json).toHaveBeenCalledWith({
                message: 'Success',
                route: __mocks__1.mockRouteBatchData
            });
        }));
        it('should give error message if route is not integer', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/routes/102ed')
                .set('Content-Type', 'application/json')
                .set('Authorization', validToken)
                .expect(200, (err, response) => {
                const { body } = response;
                expect(body).toHaveProperty('message');
                expect(body).toEqual({
                    message: 'Please provide a positive integer value',
                    success: false
                });
                done();
            });
        });
    });
    describe('getRoutes', () => {
        it('should successfully fetch routes', (done) => {
            jest.spyOn(user_service_1.default, 'getUserByEmail')
                .mockImplementation(() => ({ homebaseId: 1 }));
            supertest_1.default(app_1.default)
                .get('/api/v1/routes')
                .set('Content-Type', 'application/json')
                .set('Authorization', validToken)
                .expect(200, (err, res) => {
                const { body } = res;
                expect(body).toHaveProperty('message');
                expect(body).toHaveProperty('data');
                expect(body.data).toHaveProperty('pageMeta');
                expect(body.data).toHaveProperty('routes');
                const { pageMeta: { totalResults } } = body.data;
                expect(typeof totalResults).toBe('number');
                if (body.data.routes.length) {
                    assertRouteInfo(body.data.routes[0]);
                }
                done();
            });
        });
        it('should handle internal server error', (done) => {
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRoutes')
                .mockRejectedValue(new Error("Cannot destructure property `botToken` of 'undefined' or 'null'."));
            jest.spyOn(user_service_1.default, 'getUserByEmail')
                .mockImplementation(() => ({ homebaseId: 1 }));
            supertest_1.default(app_1.default)
                .get('/api/v1/routes')
                .set('Content-Type', 'application/json')
                .set('Authorization', validToken)
                .expect(500, (err, res) => {
                const { body } = res;
                expect(body).toHaveProperty('message');
                expect(body).toHaveProperty('success');
                expect(body).toEqual({ message: "Cannot destructure property `botToken` of 'undefined' or 'null'.", success: false });
                done();
            });
        });
    });
    describe('createRoute', () => {
        const data = {
            routeName: 'Yaba',
            destination: {
                address: 'Some address in Yaba',
                coordinates: {
                    lat: 80,
                    lng: 176
                }
            },
            takeOffTime: '12:12',
            capacity: 4,
            teamUrl: 'andela-tembea.slack.com',
            provider: {
                id: 1,
                name: 'Provider Test Name',
                providerUserId: 1,
                isDirectMessage: true,
                user: {
                    name: 'Allan',
                    email: 'provider_email@email.com',
                    phoneNo: '+8001111111',
                    slackId: 'upng'
                }
            }
        };
        const routeData = {
            batch: {
                id: 1,
                inUse: 1,
                batch: 'A',
                capacity: 4,
                takeOff: '12:12',
                comments: 'EEEEEE',
                imageUrl: 'https://image-url',
                status: 'Inactive'
            }
        };
        it('should successfully duplicate a route', (done) => {
            const mockRoute = { name: 'bay area' };
            const message = 'Successfully duplicated bay area route';
            jest.spyOn(RouteHelper_1.default, 'duplicateRouteBatch').mockResolvedValue({ batch: mockRoute, routeName: mockRoute.name, botToken: 'gfhj' });
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                .mockResolvedValue({ botToken: 'xoop' });
            supertest_1.default(app_1.default)
                .post('/api/v1/routes?action=duplicate&batchId=1')
                .set('Content-Type', 'application/json')
                .set('Authorization', validToken)
                .send(data)
                .expect(200, (err, res) => {
                const { body } = res;
                expect(body).toHaveProperty('message');
                expect(body).toHaveProperty('success');
                expect(body).toEqual({ message, success: true, data: mockRoute });
                done();
            });
        });
        it('should successfully create a route', (done) => {
            jest.spyOn(RouteHelper_1.default, 'createNewRouteWithBatch').mockResolvedValue(routeData);
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                .mockResolvedValue({ botToken: 'xoop' });
            const eventsMock = jest.spyOn(slackEvents_1.SlackEvents, 'raise').mockImplementation();
            supertest_1.default(app_1.default)
                .post('/api/v1/routes')
                .set('Content-Type', 'application/json')
                .set('Authorization', validToken)
                .send(data)
                .expect(200, (err, res) => {
                const { body: { data: route } } = res;
                assertRouteInfo(route);
                expect(route.status).toEqual('Inactive');
                expect(route.takeOff).toEqual('12:12');
                expect(route.capacity).toEqual(4);
                expect(eventsMock).toHaveBeenCalled();
                done();
            });
        });
        it('should handle internal server error', (done) => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                .mockResolvedValue({ botToken: 'xoop' });
            jest.spyOn(address_service_1.addressService, 'createNewAddress')
                .mockRejectedValue(new Error("Cannot destructure property `botToken` of 'undefined' or 'null'."));
            supertest_1.default(app_1.default)
                .post('/api/v1/routes')
                .set('Content-Type', 'application/json')
                .set('Authorization', validToken)
                .send(data)
                .expect(500, (err, res) => {
                const { body } = res;
                expect(body).toHaveProperty('message');
                expect(body).toHaveProperty('success');
                expect(body).toEqual({ message: "Cannot destructure property `botToken` of 'undefined' or 'null'.", success: false });
                done();
            });
        });
    });
    describe('saveDestination', () => {
        const latitude = faker_1.default.address.latitude();
        const longitude = faker_1.default.address.longitude();
        const coordinates = `${latitude},${longitude}`;
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should fetch address from database if coordinates has been saved', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(address_service_1.addressService, 'findAddressByCoordinates')
                .mockResolvedValue({ address: 'dummy address' });
            const result = yield RouteController_1.default.saveDestination(coordinates);
            expect(address_service_1.addressService.findAddressByCoordinates).toHaveBeenCalledWith(longitude, latitude);
            expect(result).toEqual({ address: 'dummy address' });
        }));
        it('should fetch and save address from google maps api', () => __awaiter(void 0, void 0, void 0, function* () {
            const place = {
                place_id: '',
                geometry: { location: { lat: latitude, lng: longitude } }
            };
            const details = { result: { name: '', formatted_address: '' } };
            const address = `${details.result.name}, ${details.result.formatted_address}`;
            jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getPlaceInfo')
                .mockResolvedValue(place);
            jest.spyOn(GoogleMapsPlaceDetails_1.default, 'getPlaceDetails')
                .mockResolvedValue(details);
            jest.spyOn(address_service_1.addressService, 'createNewAddress')
                .mockResolvedValue('saved');
            const result = yield RouteController_1.default.saveDestination(coordinates);
            expect(googleMapsHelpers_1.RoutesHelper.getPlaceInfo).toHaveBeenCalledWith('coordinates', coordinates);
            expect(GoogleMapsPlaceDetails_1.default.getPlaceDetails)
                .toHaveBeenCalledWith(place.place_id);
            expect(address_service_1.addressService.createNewAddress)
                .toHaveBeenCalledWith(longitude, latitude, address);
            expect(result).toEqual('saved');
        }));
        it('should throw if google maps api could not find address', () => __awaiter(void 0, void 0, void 0, function* () {
            const place = null;
            jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getPlaceInfo')
                .mockResolvedValue(place);
            try {
                yield RouteController_1.default.saveDestination(coordinates);
            }
            catch (error) {
                expect(error).toBeInstanceOf(errorHandler_1.default);
                expect(error.statusCode).toEqual(400);
                expect(error.message).toEqual('Invalid Coordinates');
            }
        }));
    });
    describe('RouteController_getRouteUsage', () => {
        let req;
        let res;
        let usageServiceSpy;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            req = {
                query: {
                    from: '2019-05-05', to: '2019-05-06'
                }
            };
            res = {
                status: jest.fn(() => ({
                    json: jest.fn(() => { })
                })).mockReturnValue({ json: jest.fn() })
            };
            usageServiceSpy = jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'getRoutesUsage');
            const route = yield Route.create(routeMock_1.newRoute);
            routeMock_1.newRouteBatch.routeId = route.id;
            const routeBatch = yield RouteBatch.create(routeMock_1.newRouteBatch);
            routeMock_1.newRouteUseRecord.batchId = routeBatch.id;
            yield RouteUseRecord.create(routeMock_1.newRouteUseRecord);
        }));
        it('Should return the most and least used routes', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = routeMock_1.formatDate();
            const response = yield supertest_1.default(app_1.default).get(`/api/v1/routes/status/usage?from=2019-10-21&to=${date}`)
                .set('Authorization', validToken);
            expect(response.status).toEqual(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toEqual('Percentage Usage Generated');
        }));
        it('Should catch errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Something went wrong');
            usageServiceSpy.mockRejectedValue(error);
            jest.spyOn(bugsnagHelper_1.default, 'log');
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            yield RouteUsageController_1.default.getRouteUsage(req, res);
            expect(bugsnagHelper_1.default.log).toBeCalled();
            expect(bugsnagHelper_1.default.log).toBeCalledWith(error);
            expect(errorHandler_1.default.sendErrorResponse).toBeCalled();
            expect(errorHandler_1.default.sendErrorResponse).toBeCalledWith(error, res);
        }));
    });
    describe('Route Ratings Controller', () => {
        let res;
        let req;
        beforeEach(() => {
            res = {
                status: jest.fn(() => ({
                    json: jest.fn(() => { })
                })).mockReturnValue({ json: jest.fn() })
            };
            req = {
                query: { from: '2019-08-20T07:44:03.574Z', to: '2019-08-20T07:44:03.574Z' },
                headers: {
                    homebaseid: 3
                }
            };
        });
        it('should return ratings', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(responseHelper_1.default, 'sendResponse');
            jest.spyOn(route_service_1.routeService, 'routeRatings')
                .mockImplementationOnce(() => (mockData_1.MockRatings));
            yield RouteUsageController_1.default.getRouteRatings(req, res);
            expect(responseHelper_1.default.sendResponse).toBeCalled();
            expect(responseHelper_1.default.sendResponse).toBeCalledWith(res, 200, true, 'Ratings Fetched Successfully', mockData_1.RatingAverages);
        }));
        it('should catch error on get ratings fail', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = 'Something Went Wrong';
            const ratingsSpy = jest.spyOn(route_service_1.routeService, 'routeRatings');
            ratingsSpy.mockRejectedValue(error);
            jest.spyOn(bugsnagHelper_1.default, 'log');
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            yield RouteUsageController_1.default.getRouteRatings(req, res);
            expect(bugsnagHelper_1.default.log).toBeCalled();
            expect(bugsnagHelper_1.default.log).toBeCalledWith(error);
            expect(errorHandler_1.default.sendErrorResponse).toBeCalled();
            expect(errorHandler_1.default.sendErrorResponse).toBeCalledWith(error, res);
        }));
        it('should get all ratings from end point', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/routes/ratings?from=2019-08-20&to=2019-08-20')
                .set('Content-Type', 'application/json')
                .set('Authorization', validToken)
                .set('homebaseid', 3)
                .expect(200, (err, resp) => {
                const { status, body } = resp;
                expect(status).toEqual(200);
                expect(body).toHaveProperty('success');
                expect(body).toHaveProperty('message');
                expect(body).toHaveProperty('data');
                done();
            });
        });
        it('should should return failure response that demands ratings query URL', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/routes/ratings?from=201908-20T07:44:03.574Z&to=20190820T07:44:03.574Z')
                .set('Content-Type', 'application/json')
                .set('Authorization', validToken)
                .set('homebaseid', 3)
                .expect(400, (err, resp) => {
                const { status, body } = resp;
                expect(status).toEqual(400);
                expect(body).toHaveProperty('success');
                expect(body).toHaveProperty('message');
                expect(body.success).toEqual(false);
                done();
            });
        });
    });
});
describe('RouteController unit test', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });
    const reqMock = {
        body: { status: 'Inactive', teamUrl: 'team@slack.com' },
        params: { routeId: 1 }
    };
    describe('Update RouteBatch Details', () => {
        it('should call the response method with success message for route status update', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            jest.spyOn(routeBatch_service_1.routeBatchService, 'updateRouteBatch').mockResolvedValue(__mocks__1.mockRouteBatchData);
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue('good');
            const eventsMock = jest.spyOn(slackEvents_1.SlackEvents, 'raise').mockImplementation();
            const message = 'Route batch successfully updated';
            yield RouteController_1.default.updateRouteBatch(reqMock, 'res');
            expect(eventsMock).toHaveBeenCalledTimes(1);
            expect(eventsMock).toHaveBeenCalledWith('notify_route_riders', 'team@slack.com', 'good');
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledTimes(1);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith('res', 200, true, message, 'good');
        }));
        it('should call response method with success message for general route update', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            jest.spyOn(routeBatch_service_1.routeBatchService, 'updateRouteBatch').mockResolvedValue(__mocks__1.mockRouteBatchData);
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue('good');
            const eventsMock = jest.spyOn(slackEvents_1.SlackEvents, 'raise').mockImplementation();
            const message = 'Route batch successfully updated';
            yield RouteController_1.default.updateRouteBatch(Object.assign(Object.assign({}, reqMock), { body: Object.assign(Object.assign({}, reqMock.body), { status: 'Active' }) }), 'res');
            expect(eventsMock).toHaveBeenCalledWith('notify_route_riders', 'team@slack.com', 'good');
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith('res', 200, true, message, 'good');
        }));
        it('should call HTTPError response method when an error is caught', () => __awaiter(void 0, void 0, void 0, function* () {
            const err = new Error('Try Again');
            jest.spyOn(routeBatch_service_1.routeBatchService, 'updateRouteBatch').mockRejectedValue(err);
            const responseMock = jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            const httpErrorResponseMock = jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockImplementation();
            const eventsMock = jest.spyOn(slackEvents_1.SlackEvents, 'raise').mockImplementation();
            yield RouteController_1.default.updateRouteBatch(reqMock, 'res');
            expect(eventsMock).not.toHaveBeenCalled();
            expect(responseMock).not.toHaveBeenCalled();
            expect(httpErrorResponseMock).toHaveBeenCalledTimes(1);
            expect(httpErrorResponseMock).toHaveBeenCalledWith(err, 'res');
        }));
    });
    describe('deleteFellowFromRoute', () => {
        let userSpy;
        let notificationSpy;
        let res;
        const req = {
            params: { routeBatchId: 1 },
            body: { teamUrl: 'andela-tembea.slack.com' }
        };
        beforeEach(() => {
            userSpy = jest.spyOn(user_service_1.default, 'getUserById');
            notificationSpy = jest.spyOn(RouteNotifications_1.default, 'sendNotificationToRider')
                .mockImplementation(jest.fn());
            res = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should remove a fellow successfully from a route and send a notification', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'updateUser').mockImplementation(jest.fn());
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl').mockResolvedValue({
                botToken: 'token'
            });
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockReturnValue({
                routeId: 1
            });
            jest.spyOn(route_service_1.routeService, 'getRouteById').mockReturnValue({
                routeId: 1,
            });
            userSpy.mockResolvedValue({ routeBatchId: 1, slackId: 'user' });
            const message = new SlackMessageModels_1.SlackInteractiveMessage('*Hey <@user>, You\'ve been removed from `undefined` route.* \n *:information_source: Reach out to Ops department for any questions*.');
            yield RouteController_1.default.deleteFellowFromRoute(req, res);
            expect(res.status).toBeCalledWith(200);
            expect(res.status().json).toBeCalledWith({
                success: true,
                message: 'engineer successfully removed from the route',
                undefined
            });
            expect(notificationSpy).toBeCalledWith(message, 'user', 'token');
        }));
        it('should return a message if the user is not on a route', () => __awaiter(void 0, void 0, void 0, function* () {
            userSpy.mockResolvedValue({ routeBatchId: null, slackId: 'user' });
            yield RouteController_1.default.deleteFellowFromRoute(req, res);
            expect(res.status).toBeCalledWith(200);
            expect(res.status().json).toBeCalledWith({
                success: true,
                message: 'user doesn\'t belong to this route',
                undefined
            });
            expect(notificationSpy).not.toBeCalled();
        }));
        it('should throw an error if delete fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Dummy Error');
            userSpy.mockResolvedValue({ routeBatchId: 2, slackId: 'user' });
            jest.spyOn(user_service_1.default, 'updateUser').mockRejectedValue(error);
            const bugsnagSpy = jest.spyOn(bugsnagHelper_1.default, 'log')
                .mockImplementation(jest.fn());
            const httpErrorSpy = jest.spyOn(errorHandler_1.default, 'sendErrorResponse')
                .mockImplementation(jest.fn());
            yield RouteController_1.default.deleteFellowFromRoute(req, res);
            expect(bugsnagSpy).toBeCalledWith(error);
            expect(httpErrorSpy).toBeCalledWith(error, res);
        }));
    });
});
//# sourceMappingURL=RouteController.spec.js.map