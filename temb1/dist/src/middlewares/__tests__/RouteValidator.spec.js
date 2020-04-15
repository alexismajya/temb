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
const RouteValidator_1 = __importDefault(require("../RouteValidator"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const GeneralValidator_1 = __importDefault(require("../GeneralValidator"));
const RouteHelper_1 = __importDefault(require("../../helpers/RouteHelper"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
let reqMock = {
    body: {
        routeName: 'Yaba',
        capacity: 3,
        vehicle: 'HSJ 3893',
        takeOffTime: '12:00',
        destination: {
            address: 'Yaba Left, EPIC Tower',
            coordinates: {
                lat: '3.40949',
                lng: '-0.99393'
            }
        }
    },
    query: {
        action: ''
    }
};
const providerMock = {
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
};
describe('Route Validator', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('validate route batch status', () => {
        it('should call next middleware when acceptable status is passed', () => {
            reqMock = { body: { teamUrl: 'andela-tembea.slack.com', status: 'Active' } };
            const nextMock = jest.fn();
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            RouteValidator_1.default.validateRouteUpdate(reqMock, 'res', nextMock);
            expect(nextMock).toHaveBeenCalledTimes(1);
            expect(responseHelper_1.default.sendResponse).not.toHaveBeenCalled();
        });
        it('should call response method when an unacceptable status is passed', () => {
            reqMock = { body: { teamUrl: 'andela-tembea.slack.com', status: 'Pending' } };
            const nextMock = jest.fn();
            const errMessage = 'Validation error occurred, see error object for details';
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockImplementation();
            RouteValidator_1.default.validateRouteUpdate(reqMock, 'res', nextMock);
            expect(nextMock).not.toHaveBeenCalled();
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
            expect(errorHandler_1.default.sendErrorResponse)
                .toHaveBeenCalledWith({
                statusCode: 400,
                message: errMessage,
                error: { status: 'only Inactive,Active are allowed' }
            }, 'res');
        });
    });
    describe('validate all props', () => {
        it('should call next method when creating a new route if all property exist', () => {
            const nextMock = jest.fn();
            reqMock = {
                body: {
                    routeName: 'Yaba',
                    capacity: 3,
                    teamUrl: 'adaeze.slack.com',
                    takeOffTime: '12:00',
                    destination: {
                        address: 'Yaba Left, EPIC Tower',
                        coordinates: {
                            lat: '3.40949',
                            lng: '-0.99393'
                        }
                    },
                    provider: providerMock
                }
            };
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            RouteValidator_1.default.validateNewRoute(reqMock, 'res', nextMock);
            expect(nextMock).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).not.toHaveBeenCalled();
        });
        it('should call error response method when creating a new route if any property doesnt exist', () => {
            reqMock = {
                body: {
                    routeName: '',
                    capacity: 3,
                    vehicle: '',
                    takeOffTime: '12:00',
                    destination: {
                        address: '',
                        coordinates: {
                            lat: '3.40949',
                            lng: '-0.99393'
                        }
                    }
                },
                query: {
                    action: ''
                }
            };
            const nextMock = jest.fn();
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            RouteValidator_1.default.validateNewRoute(reqMock, 'res', nextMock);
            expect(nextMock).not.toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledTimes(1);
        });
        it('should call next method if route is being duplicated', () => {
            reqMock = {
                body: {},
                query: {
                    action: 'duplicate',
                    batchId: 1
                }
            };
            const nextMock = jest.fn();
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            RouteValidator_1.default.validateNewRoute(reqMock, 'res', nextMock);
            expect(nextMock).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).not.toHaveBeenCalled();
        });
    });
    describe('validateDelete', () => {
        it('should validate props', () => {
            reqMock = { body: { teamUrl: 'tembea.slack.com' } };
            const nextMock = jest.fn();
            RouteValidator_1.default.validateDelete(reqMock, 'res', nextMock);
            expect(nextMock).toHaveBeenCalled();
        });
    });
    describe('validate value types', () => {
        it('should call error response when creating new route if all value types are invalid', () => {
            reqMock = {
                body: {
                    routeName: '',
                    capacity: 'jdjdk',
                    takeOffTime: '12:00',
                    teamUrl: 1,
                    destination: {
                        address: 'Yaba Left, EPIC Tower',
                        coordinates: {
                            lat: '500',
                            lng: '-0.99393'
                        }
                    },
                    provider: providerMock
                },
                query: {
                    action: ''
                }
            };
            const nextMock = jest.fn();
            const errorMessage = {
                capacity: 'capacity should be a number',
                errorMessage: 'Validation error occurred, see error object for details',
                lat: 'lat should not be greater than 86',
                routeName: '\"routeName\" is not allowed to be empty',
                teamUrl: '\"teamUrl\" must be a string',
            };
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            RouteValidator_1.default.validateNewRoute(reqMock, 'res', nextMock);
            expect(nextMock).not.toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledTimes(1);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith('res', 400, false, errorMessage);
        });
    });
    describe('validate RouteId Parameter', () => {
        it('should call RouteValidator.validateIdParam routeId', () => {
            reqMock = {
                params: { routeId: 1 },
                route: { path: '/routes/:routeId' }
            };
            const nextMock = jest.fn();
            const spy = jest.spyOn(RouteValidator_1.default, 'validateIdParam');
            RouteValidator_1.default.validateRouteIdParam(reqMock, 'res', nextMock);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('res', 1, 'routeId', nextMock);
        });
        it('should call RouteValidator.validateIdParam routeBatchId', () => {
            reqMock = {
                params: { routeBatchId: 1 },
                route: { path: '/routes/:routeBatchId' }
            };
            const nextMock = jest.fn();
            const spy = jest.spyOn(RouteValidator_1.default, 'validateIdParam');
            RouteValidator_1.default.validateRouteIdParam(reqMock, 'res', nextMock);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('res', 1, 'routeBatchId', nextMock);
        });
        it('should call RouteValidator.validateIdParam userId', () => {
            reqMock = {
                params: { userId: 1 },
                route: { path: '/routes/fellows/:userId' }
            };
            const nextMock = jest.fn();
            const spy = jest.spyOn(RouteValidator_1.default, 'validateIdParam');
            RouteValidator_1.default.validateRouteIdParam(reqMock, 'res', nextMock);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('res', 1, 'userId', nextMock);
        });
    });
    describe('validate validateIdParam', () => {
        it('should call next method when the id is valid', () => {
            const nextMock = jest.fn();
            jest.spyOn(GeneralValidator_1.default, 'validateNumber').mockReturnValue(true);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            RouteValidator_1.default.validateIdParam('res', true, 'id', nextMock);
            expect(nextMock).toHaveBeenCalledTimes(1);
            expect(responseHelper_1.default.sendResponse).not.toHaveBeenCalled();
        });
        it('should call response method when the id is not valid', () => {
            const nextMock = jest.fn();
            const errorMessage = 'Please provide a positive integer value for id';
            jest.spyOn(GeneralValidator_1.default, 'validateNumber').mockReturnValue(false);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            RouteValidator_1.default.validateIdParam('res', false, 'id', nextMock);
            expect(nextMock).not.toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledTimes(1);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith('res', 400, false, errorMessage);
        });
    });
    describe('validate RouteBatch Update Fields', () => {
        const reqMockInvalid = {
            body: {
                takeOff: '1100aa',
                batch: 'B',
                name: 'Yaba',
                capacity: 'not correct',
                inUse: '10 times wrong',
                regNumber: 'XAH A7G FA',
                providerId: 1
            }
        };
        const nextMock = jest.fn();
        it('should validate all request body data', () => __awaiter(void 0, void 0, void 0, function* () {
            reqMock = {
                body: {
                    takeOff: '11:00',
                    batch: 'B',
                    name: 'Yaba',
                    capacity: 12,
                    inUse: 10,
                    regNumber: 'XAH A7G FA',
                    providerId: 1,
                }
            };
            jest.spyOn(RouteHelper_1.default, 'checkThatRouteNameExists').mockReturnValue([true, { id: 1 }]);
            jest.spyOn(RouteHelper_1.default, 'checkThatProviderIdExists').mockReturnValue([true, { id: 1 }]);
            jest.spyOn(RouteHelper_1.default, 'checkThatVehicleRegNumberExists').mockReturnValue([true, { id: 1 }]);
            yield RouteValidator_1.default.validateRouteBatchUpdateFields(reqMock, 'res', nextMock);
            expect(nextMock).toHaveBeenCalledTimes(1);
        }));
        it('should return error response when invalid data is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(RouteHelper_1.default, 'checkThatRouteNameExists').mockReturnValue([false]);
            jest.spyOn(RouteHelper_1.default, 'checkThatVehicleRegNumberExists').mockReturnValue([false]);
            jest.spyOn(RouteHelper_1.default, 'checkThatProviderIdExists').mockReturnValue([false]);
            const spy = jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            yield RouteValidator_1.default.validateRouteBatchUpdateFields(reqMockInvalid, 'res', nextMock);
            expect(nextMock).not.toHaveBeenCalled();
            expect(spy.mock.calls[0][3].length).toEqual(4);
        }));
    });
    describe('validate destination address', () => {
        it('should call next() when creating new route which address doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
            reqMock = {
                body: { destination: { address: 'EPIC Tower' } },
                query: { action: '' }
            };
            const nextMock = jest.fn();
            jest.spyOn(RouteHelper_1.default, 'checkThatAddressAlreadyExists').mockReturnValue(false);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            yield RouteValidator_1.default.validateDestinationAddress(reqMock, 'res', nextMock);
            expect(nextMock).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).not.toHaveBeenCalled();
        }));
        it('should call response method when creating new route which address does exist', () => __awaiter(void 0, void 0, void 0, function* () {
            reqMock = {
                body: { destination: { address: 'EPIC Tower' } },
                query: { action: '' }
            };
            const nextMock = jest.fn();
            const errorMessage = 'Address already exists';
            jest.spyOn(RouteHelper_1.default, 'checkThatAddressAlreadyExists').mockReturnValue(true);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            yield RouteValidator_1.default.validateDestinationAddress(reqMock, 'res', nextMock);
            expect(nextMock).not.toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledTimes(1);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith('res', 400, false, errorMessage);
        }));
        it('should call next() when duplicating a route which address does exist', () => __awaiter(void 0, void 0, void 0, function* () {
            reqMock = {
                body: { destination: { address: 'EPIC Tower' } },
                query: { action: 'duplicate' }
            };
            const nextMock = jest.fn();
            jest.spyOn(RouteHelper_1.default, 'checkThatAddressAlreadyExists').mockReturnValue(true);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            yield RouteValidator_1.default.validateDestinationAddress(reqMock, 'res', nextMock);
            expect(nextMock).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).not.toHaveBeenCalled();
        }));
    });
    describe('validate destination Coordinates', () => {
        it('should call next() when creating new route which coordinate doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
            reqMock = {
                body: { destination: { coordinates: '3.9904, -0.59939' } },
                query: { action: '' }
            };
            const nextMock = jest.fn();
            jest.spyOn(RouteHelper_1.default, 'checkThatLocationAlreadyExists').mockReturnValue(false);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            yield RouteValidator_1.default.validateDestinationCoordinates(reqMock, 'res', nextMock);
            expect(nextMock).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).not.toHaveBeenCalled();
        }));
        it('should call response method when creating new route which coordinate does exist', () => __awaiter(void 0, void 0, void 0, function* () {
            reqMock = {
                body: { destination: { coordinates: '3.9904, -0.59939' } },
                query: { action: '' }
            };
            const nextMock = jest.fn();
            const errorMessage = 'Provided coordinates belong to an existing address';
            jest.spyOn(RouteHelper_1.default, 'checkThatLocationAlreadyExists').mockReturnValue(true);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            yield RouteValidator_1.default.validateDestinationCoordinates(reqMock, 'res', nextMock);
            expect(nextMock).not.toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledTimes(1);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith('res', 400, false, errorMessage);
        }));
        it('should call next() when duplicating a route which coordinate does exist', () => __awaiter(void 0, void 0, void 0, function* () {
            reqMock = {
                body: { destination: { coordinates: '3.9904, -0.59939' } },
                query: { action: 'duplicate' }
            };
            const nextMock = jest.fn();
            jest.spyOn(RouteHelper_1.default, 'checkThatLocationAlreadyExists').mockReturnValue(true);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
            yield RouteValidator_1.default.validateDestinationCoordinates(reqMock, 'res', nextMock);
            expect(nextMock).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).not.toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=RouteValidator.spec.js.map