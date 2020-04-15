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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DriversValidator_1 = __importDefault(require("../DriversValidator"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const provider_service_1 = require("../../modules/providers/provider.service");
const driver_service_1 = __importStar(require("../../modules/drivers/driver.service"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const user_service_1 = __importDefault(require("../../modules/users/user.service"));
describe('DriversValidator Middleware', () => {
    let [response, next] = [];
    const request = {
        params: {
            providerId: 1,
            driverId: 2
        },
    };
    beforeEach(() => {
        response = {
            status: jest.fn(),
            json: jest.fn(),
        };
        next = jest.fn();
        errorHandler_1.default.sendErrorResponse = jest.fn();
    });
    afterEach(() => jest.restoreAllMocks());
    describe('DriversValidator.validateProviderDriverIdParams', () => {
        it('should call next() if there are no validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            yield DriversValidator_1.default.validateProviderDriverIdParams(request, response, next);
            expect(next).toHaveBeenCalledTimes(1);
        }));
        it('should respond with validation errors for invalid params', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidRequest = {
                params: {
                    providerId: 'invalid',
                    driverId: 'invalid'
                },
            };
            const sendErrorResponseSpy = jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            yield DriversValidator_1.default.validateProviderDriverIdParams(invalidRequest, response, next);
            expect(sendErrorResponseSpy).toHaveBeenCalled();
        }));
    });
    describe('DriversValidator > validateParams', () => {
        it('should return a list', (done) => {
            expect(DriversValidator_1.default.validateParams({})).toStrictEqual([]);
            done();
        });
        it('should return a list of errors', (done) => {
            const params = { providerId: 'invalid', driverId: 'invalid' };
            expect(DriversValidator_1.default.validateParams(params)).toHaveLength(2);
            done();
        });
    });
    describe('DriversValidator > validateIsProviderDriver', () => {
        const provider = {
            dataValues: { id: 1 },
            hasDriver: jest.fn(() => true),
        };
        const driver = { dataValues: { id: 2, providerId: 1 } };
        beforeEach(() => {
            jest.spyOn(provider_service_1.providerService, 'getProviderById').mockResolvedValue(provider);
            jest.spyOn(driver_service_1.driverService, 'getDriverById').mockResolvedValue(driver);
        });
        it('should call next() if driver belongs to provider', () => __awaiter(void 0, void 0, void 0, function* () {
            yield DriversValidator_1.default.validateIsProviderDriver(request, response, next);
            expect(next).toHaveBeenCalledTimes(1);
        }));
        it('should respond with error if driver does not belong to provider', () => __awaiter(void 0, void 0, void 0, function* () {
            provider.hasDriver = jest.fn(() => false);
            yield DriversValidator_1.default.validateIsProviderDriver(request, response, next);
            const sendErrorResponseSpy = jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            const errorPayload = {
                message: 'Sorry, driver does not belong to the provider',
                statusCode: 400,
            };
            expect(sendErrorResponseSpy).toHaveBeenCalledWith(errorPayload, response);
        }));
        it('should handle unexpected exception', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(provider_service_1.providerService, 'getProviderById').mockReturnValue(null);
            yield DriversValidator_1.default.validateIsProviderDriver(request, response, next);
            const sendErrorResponseSpy = jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            expect(sendErrorResponseSpy).toHaveBeenCalled();
        }));
        describe('DriverValidator', () => {
            let res;
            let req;
            let dummyDriver;
            let dummyRightDriverData;
            let createUserByEmailSpy;
            beforeEach(() => {
                dummyDriver = {
                    email: 'jamesa232i@gmail.com',
                    driverName: 'James Savali',
                    driverNumber: '567219',
                    driverPhoneNo: '070812hj339'
                };
                dummyRightDriverData = {
                    email: 'jamesa232i@gmail.com',
                    driverName: 'James Savali',
                    driverNumber: '567219',
                    driverPhoneNo: '+6576666339'
                };
                res = {
                    status: jest.fn(() => ({
                        json: jest.fn()
                    }))
                };
                next = jest.fn();
                errorHandler_1.default.sendErrorResponse = jest.fn();
                responseHelper_1.default.sendResponse = jest.fn();
                req = {
                    params: { providerId: 1, driverId: 1 }
                };
                createUserByEmailSpy = jest.spyOn(user_service_1.default, 'createUserByEmail');
            });
            afterEach((done) => {
                jest.restoreAllMocks();
                done();
            });
            it('should validate driver update body', () => __awaiter(void 0, void 0, void 0, function* () {
                req.body = dummyDriver;
                yield DriversValidator_1.default.validateDriverUpdateBody(req, res, next);
                expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
            }));
            it('should call next if update body is ok', () => __awaiter(void 0, void 0, void 0, function* () {
                req.body = dummyRightDriverData;
                yield DriversValidator_1.default.validateDriverUpdateBody(req, res, next);
                expect(next).toHaveBeenCalled();
            }));
            it('should validate if phone number and driver number already exist in db', () => __awaiter(void 0, void 0, void 0, function* () {
                req = {
                    body: dummyDriver,
                    params: { driverId: 1 }
                };
                jest.spyOn(driver_service_1.default, 'exists').mockResolvedValue(true);
                yield DriversValidator_1.default.validatePhoneNoAndNumberAlreadyExists(req, res, next);
                expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 400, false, 'Driver with this driver number, email or phone number exists');
                expect(driver_service_1.default.exists).toHaveBeenCalled();
            }));
            it('should call next if no issue is found', () => __awaiter(void 0, void 0, void 0, function* () {
                req = {
                    body: dummyDriver,
                    params: { driverId: 1 }
                };
                jest.spyOn(driver_service_1.driverService, 'create').mockResolvedValue(driver);
                jest.spyOn(driver_service_1.default, 'exists').mockResolvedValue(false);
                yield DriversValidator_1.default.validatePhoneNoAndNumberAlreadyExists(req, res, next);
                expect(next).toHaveBeenCalled();
            }));
            describe('validateUserExistenceById', () => {
                it('should call next if userId is not request body', () => __awaiter(void 0, void 0, void 0, function* () {
                    req = {
                        body: {},
                        headers: { teamurl: 'teamurl' }
                    };
                    yield DriversValidator_1.default.validateUserExistenceById(req, res, next);
                    expect(next).toBeCalled();
                }));
                it('should call next if userId and user exists', () => __awaiter(void 0, void 0, void 0, function* () {
                    req = {
                        body: { userId: 1 },
                        headers: { teamurl: 'slackteamurl' }
                    };
                    jest.spyOn(user_service_1.default, 'getUserById').mockResolvedValue({});
                    yield DriversValidator_1.default.validateUserExistenceById(req, res, next);
                    expect(next).toBeCalled();
                }));
                it('should throw error if user doesnot exist', () => __awaiter(void 0, void 0, void 0, function* () {
                    req = {
                        body: { userId: 1 },
                        headers: { teamurl: 'slackteamurl' }
                    };
                    createUserByEmailSpy.mockResolvedValue(null);
                    jest.spyOn(user_service_1.default, 'getUserById').mockResolvedValue(null);
                    yield DriversValidator_1.default.validateUserExistenceById(req, res, next);
                    expect(next).not.toBeCalled();
                    expect(responseHelper_1.default.sendResponse).toBeCalled();
                }));
                it('should set userId to null if user email does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
                    req = {
                        body: { email: 'notfound@email.com' },
                        headers: { teamurl: 'slackteamurl' }
                    };
                    createUserByEmailSpy.mockResolvedValue(null);
                    jest.spyOn(user_service_1.default, 'getUserByEmail').mockResolvedValue(null);
                    yield DriversValidator_1.default.validateUserExistenceById(req, res, next);
                    expect(req.body.userId).toBe(null);
                    expect(next).toBeCalled();
                }));
            });
        });
    });
});
//# sourceMappingURL=DriversValidator.spec.js.map