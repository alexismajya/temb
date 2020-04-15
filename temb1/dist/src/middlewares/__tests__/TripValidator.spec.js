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
const TripValidator_1 = __importDefault(require("../TripValidator"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const trip_service_1 = __importDefault(require("../../modules/trips/trip.service"));
const SlackInteractions_mock_1 = require("../../modules/slack/SlackInteractions/__mocks__/SlackInteractions.mock");
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
describe('Trip Validator', () => {
    let req;
    let reqDecline;
    let res;
    let next;
    let resolved;
    beforeEach(() => {
        req = {
            body: {
                comment: 'ns',
                slackUrl: 'sokoolworkspace.slack.com',
                providerId: 1
            },
            params: { tripId: 15 },
            status: 200,
            query: { action: 'confirm' }
        };
        reqDecline = {
            body: {
                comment: 'ns',
                slackUrl: 'sokoolworkspace.slack.com'
            },
            params: { tripId: 15 },
            status: 200,
            query: { action: 'decline' }
        };
        res = {
            status: jest
                .fn(() => ({
                json: jest.fn(() => { })
            }))
                .mockReturnValue({ json: jest.fn() })
        };
        next = jest.fn();
    });
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });
    describe('validateAll method', () => {
        beforeEach(() => {
            resolved = {
                success: false,
                message: 'Some properties are missing for approval',
                errors: [
                    'Please provide driverPhoneNo.'
                ]
            };
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(SlackInteractions_mock_1.tripRequestDetails);
        });
        it('should call validateAll with all values for confirm with non existing trip', () => __awaiter(void 0, void 0, void 0, function* () {
            errorHandler_1.default.sendErrorResponse = jest.fn(() => { });
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse')
                .mockResolvedValue(resolved);
            jest.spyOn(trip_service_1.default, 'checkExistence')
                .mockResolvedValue(false);
            yield TripValidator_1.default.validateAll(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledTimes(0);
        }));
        it('should call validateAll with all values for confirm', () => __awaiter(void 0, void 0, void 0, function* () {
            errorHandler_1.default.sendErrorResponse = jest.fn(() => { });
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse')
                .mockResolvedValue(resolved);
            jest.spyOn(trip_service_1.default, 'checkExistence')
                .mockResolvedValue(true);
            yield TripValidator_1.default.validateAll(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(1);
        }));
        it('should fail if action is decline and providerId is supplied', () => __awaiter(void 0, void 0, void 0, function* () {
            req.query.action = 'decline';
            errorHandler_1.default.sendErrorResponse = jest.fn(() => { });
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse')
                .mockResolvedValue(resolved);
            jest.spyOn(trip_service_1.default, 'checkExistence')
                .mockResolvedValue(true);
            yield TripValidator_1.default.validateAll(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledTimes(0);
        }));
        it('should call next middleware if providerId is not supplied and action is decline', () => __awaiter(void 0, void 0, void 0, function* () {
            req.query.action = 'decline';
            delete req.body.providerId;
            errorHandler_1.default.sendErrorResponse = jest.fn(() => { });
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse')
                .mockResolvedValue(resolved);
            jest.spyOn(trip_service_1.default, 'checkExistence')
                .mockResolvedValue(true);
            yield TripValidator_1.default.validateAll(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(1);
        }));
        it('should call validateAll with all values for decline', () => __awaiter(void 0, void 0, void 0, function* () {
            errorHandler_1.default.sendErrorResponse = jest.fn(() => { });
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse')
                .mockResolvedValue(resolved);
            jest.spyOn(trip_service_1.default, 'checkExistence')
                .mockResolvedValue(true);
            yield TripValidator_1.default.validateAll(reqDecline, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(1);
        }));
        it('should call validateAll with missing tripId ', () => __awaiter(void 0, void 0, void 0, function* () {
            errorHandler_1.default.sendErrorResponse = jest.fn(() => { });
            req.params.tripId = null;
            req.body.providerId = 1;
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            jest.spyOn(trip_service_1.default, 'checkExistence').mockResolvedValue(true);
            yield TripValidator_1.default.validateAll(req, res, next).then(() => {
                expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
                expect(errorHandler_1.default.sendErrorResponse)
                    .toHaveBeenCalledWith({
                    message: {
                        errorMessage: 'Validation error occurred, see error object for details',
                        tripId: 'tripId should be a number',
                    },
                    statusCode: 400
                }, res);
            });
        }));
        it('should call next middleware', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'checkExistence').mockResolvedValueOnce(true);
            const reqq = Object.assign({}, req);
            reqq.params.tripId = 1;
            reqq.body.providerId = 1;
            yield TripValidator_1.default.validateAll(reqq, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        }));
    });
    describe('validateEachInput method', () => {
        beforeEach(() => {
            resolved = {
                success: false,
                message: 'Some properties are not valid',
                errors: [
                    {
                        name: 'slackUrl',
                        error: 'Invalid slackUrl. e.g: ACME.slack.com'
                    }
                ]
            };
        });
        it('should call validateAll with invalid driverPhoneNo ', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const testReq = Object.assign({}, req);
            testReq.body.driverPhoneNo = 'sdd';
            errorHandler_1.default.sendErrorResponse = jest.fn(() => { });
            jest.spyOn(trip_service_1.default, 'checkExistence').mockResolvedValue(true);
            yield TripValidator_1.default.validateAll(testReq, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledWith({
                message: expect.objectContaining({
                    driverPhoneNo: '"driverPhoneNo" is not allowed',
                }),
                statusCode: 400,
            }, res);
            expect(next).toHaveBeenCalledTimes(0);
            done();
        }));
        it('should call validateAll with invalid tripId ', (done) => __awaiter(void 0, void 0, void 0, function* () {
            errorHandler_1.default.sendErrorResponse = jest.fn(() => { });
            req.params.tripId = 'we';
            jest.spyOn(trip_service_1.default, 'checkExistence').mockResolvedValue(true);
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            yield TripValidator_1.default.validateAll(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledWith({
                message: {
                    errorMessage: 'Validation error occurred, see error object for details',
                    tripId: 'tripId should be a number'
                },
                statusCode: 400
            }, res);
            done();
        }));
    });
    describe('validate query params', () => {
        let validationErrorResponse;
        let jsonMock;
        let statusMock;
        beforeEach(() => {
            validationErrorResponse = {
                success: false,
                message: 'Validation Error',
                data: null
            };
            jsonMock = jest.fn();
            statusMock = jest.fn().mockImplementation(() => ({ json: jsonMock }));
            res = {
                status: statusMock
            };
            next = jest.fn();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('validate that query parameters are options', () => {
            req = { query: {} };
            TripValidator_1.default.validateGetTripsParam(req, res, next);
            expect(statusMock).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
        });
        describe('status', () => {
            it('valid status provided', () => {
                req = { query: { status: 'Confirmed' } };
                TripValidator_1.default.validateGetTripsParam(req, res, next);
                expect(statusMock).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledTimes(1);
            });
            it('invalid status provided', () => {
                req = { query: { status: 'Unknown' } };
                TripValidator_1.default.validateGetTripsParam(req, res, next);
                expect(statusMock).toHaveBeenCalledWith(400);
                expect(jsonMock).toHaveBeenCalled();
                expect(next).not.toHaveBeenCalled();
            });
        });
        describe('Date', () => {
            it('validate \'after\' date is valid', () => {
                req = { query: { departureTime: 'after:2018-01-01' } };
                TripValidator_1.default.validateGetTripsParam(req, res, next);
                expect(statusMock).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledTimes(1);
            });
            it('validate \'before\' date is valid', () => {
                req = { query: { departureTime: 'before:2018-01-01' } };
                TripValidator_1.default.validateGetTripsParam(req, res, next);
                expect(statusMock).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledTimes(1);
            });
            it('validate \'before\' & \'after\' date is valid', () => {
                req = { query: { departureTime: 'before:2018-01-01;after:2017-10-10' } };
                TripValidator_1.default.validateGetTripsParam(req, res, next);
                expect(statusMock).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledTimes(1);
            });
            it('validate \'before\' date is invalid', () => {
                req = { query: { requestedOn: 'before:2019-02-30' } };
                TripValidator_1.default.validateGetTripsParam(req, res, next);
                expect(statusMock).toHaveBeenCalledWith(400);
                validationErrorResponse.data = {
                    errors: [
                        'requestedOn \'before\' date is not valid. It should be in the format \'YYYY-MM-DD\''
                    ]
                };
                expect(jsonMock).toHaveBeenCalledWith(validationErrorResponse);
                expect(next).not.toHaveBeenCalled();
            });
            it('validate \'after\' date is invalid', () => {
                req = { query: { requestedOn: 'after:2019-02-30' } };
                TripValidator_1.default.validateGetTripsParam(req, res, next);
                expect(statusMock).toHaveBeenCalledWith(400);
                validationErrorResponse.data = {
                    errors: [
                        'requestedOn \'after\' date is not valid. It should be in the format \'YYYY-MM-DD\''
                    ]
                };
                expect(jsonMock).toHaveBeenCalledWith(validationErrorResponse);
                expect(next).not.toHaveBeenCalled();
            });
            it('should validate departureTime input format is valid', () => {
                req = { query: { departureTime: 'invalid:2019-02-10;after:2020-02-10' } };
                TripValidator_1.default.validateGetTripsParam(req, res, next);
                expect(statusMock).toHaveBeenCalledWith(400);
                validationErrorResponse.data = {
                    errors: [
                        'Invalid format, departureTime must be in the format '
                            + 'departureTime=before:YYYY-MM-DD;after:YYYY-MM-DD'
                    ]
                };
                expect(jsonMock).toHaveBeenCalledWith(validationErrorResponse);
                expect(next).not.toHaveBeenCalled();
            });
            it('should validate \'after\' date is great than \'before\'', () => {
                req = { query: { requestedOn: 'before:2019-02-10;after:2020-02-10' } };
                TripValidator_1.default.validateGetTripsParam(req, res, next);
                expect(statusMock).toHaveBeenCalledWith(400);
                validationErrorResponse.data = {
                    errors: ['requestedOn \'before\' date cannot be less than \'after\' date']
                };
                expect(jsonMock).toHaveBeenCalledWith(validationErrorResponse);
                expect(next).not.toHaveBeenCalled();
            });
        });
    });
});
describe('Travel Trip Validator', () => {
    const req = { body: {} };
    let res;
    let next;
    beforeEach(() => {
        jest.spyOn(responseHelper_1.default, 'sendResponse');
        jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
        next = jest.fn();
        res = {
            status: jest.fn(() => ({ json: jest.fn() })),
        };
    });
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });
    it('should validate the request body', () => __awaiter(void 0, void 0, void 0, function* () {
        yield TripValidator_1.default.validateTravelTrip(req, res, next);
        expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
    }));
    it('should call next it no errors are found', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {
            startDate: '2016-11-15 03:00',
            endDate: '2018-11-15 03:00',
            departmentList: [' people ', ' TDD ']
        };
        yield TripValidator_1.default.validateTravelTrip(req, res, next);
        expect(req.body.departmentList[1]).toBe('TDD');
        expect(req.body.departmentList[0]).toBe('people');
        expect(next).toHaveBeenCalledTimes(1);
    }));
});
//# sourceMappingURL=TripValidator.spec.js.map