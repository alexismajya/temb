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
const HomeBaseValidatorMocks_1 = __importDefault(require("../__mocks__/HomeBaseValidatorMocks"));
const HomebaseValidator_1 = __importDefault(require("../HomebaseValidator"));
const CountryHelper_1 = __importDefault(require("../../helpers/CountryHelper"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const HomeBaseHelper_1 = __importDefault(require("../../helpers/HomeBaseHelper"));
const database_1 = require("../../database");
describe('HomebaseValidator', () => {
    const req = {
        body: {
            countryId: '1',
            homebaseName: 'Nairobi',
            channel: 'U08UJK',
            currency: 'NGN',
            opsEmail: 'opskigali@andela.com',
            travelEmail: 'kigali@andela.com',
            address: {
                location: {
                    longitude: 180,
                    latitude: 86
                },
                address: 'this is the address'
            }
        },
        query: {
            countryId: 1,
            name: 'Nairobi',
            channel: 'U08UJK'
        }
    };
    const res = {
        status() {
            return this;
        },
        json() {
            return this;
        }
    };
    const next = jest.fn();
    responseHelper_1.default.sendResponse = jest.fn();
    beforeEach(() => {
        jest.spyOn(responseHelper_1.default, 'sendResponse');
        jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('reqeust body validation', () => {
        it('test with invalid fields', () => {
            jest.spyOn(res, 'status');
            jest.spyOn(res, 'json');
            const invalidReq = {
                body: {
                    channel: 1,
                    countryId: 'abc',
                    homebaseName: 78,
                    currency: 'NGN',
                    opsEmail: 'opskigali@andela.com',
                    travelEmail: 'kigali@andela.com'
                }
            };
            HomebaseValidator_1.default.validateHomeBase(invalidReq, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    channel: '"channel" must be a string',
                    countryId: 'countryId should be a number',
                    homebaseName: '"homebaseName" must be a string',
                    address: 'Please provide address',
                },
                message: 'Validation error occurred, see error object for details',
                success: false
            });
        });
        it('test with valid fields', () => {
            HomebaseValidator_1.default.validateHomeBase(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('test validateCountryExists', () => {
        let countryExistSpy;
        beforeEach(() => {
            countryExistSpy = jest.spyOn(CountryHelper_1.default, 'checkIfCountryExistsById');
        });
        it('test when country exists', () => __awaiter(void 0, void 0, void 0, function* () {
            countryExistSpy.mockResolvedValue(true);
            yield HomebaseValidator_1.default.validateCountryExists(req, res, next);
            expect(next).toHaveBeenCalled();
        }));
        it('test when country does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = 'The country with Id: \'1\' does not exist';
            countryExistSpy.mockResolvedValue(null);
            yield HomebaseValidator_1.default.validateCountryExists(req, res, next);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, message);
        }));
    });
    describe('validateHomeBaseExists', () => {
        let homeBaseSpy;
        const request = {
            body: { homebaseId: undefined },
            params: { id: 1 }
        };
        beforeEach(() => {
            homeBaseSpy = jest.spyOn(HomeBaseHelper_1.default, 'checkIfHomeBaseExists');
        });
        it('should return null if homebase  does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            homeBaseSpy.mockResolvedValue(null);
            const message = 'The HomeBase with Id: \'1\' does not exist';
            yield HomebaseValidator_1.default.validateHomeBaseExists(request, res, next);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, message);
        }));
        it('should call next if homebase  exist', () => __awaiter(void 0, void 0, void 0, function* () {
            homeBaseSpy.mockResolvedValue({ id: 1, name: 'Uganda' });
            yield HomebaseValidator_1.default.validateHomeBaseExists(request, res, next);
            expect(next).toHaveBeenCalled();
        }));
        it('should validate edit homebase request body', () => {
            jest.spyOn(res, 'status');
            jest.spyOn(res, 'json');
            const invalidReq = {
                body: {
                    homebaseName: 1
                }
            };
            HomebaseValidator_1.default.validateUpdateHomeBase(invalidReq, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    address: 'Please provide address',
                    homebaseName: '"homebaseName" must be a string'
                },
                message: 'Validation error occurred, see error object for details',
                success: false
            });
        });
    });
    describe('validateHomeBaseIdQueryParam', () => {
        const request = {
            params: { id: 'iii' }
        };
        beforeEach(() => {
            jest.spyOn(res, 'status');
            jest.spyOn(res, 'json');
        });
        it('should validate homebase id in query param', () => {
            HomebaseValidator_1.default.validateHomeBaseIdQueryParam(request, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Please provide a positive integer value',
                success: false
            });
        });
        it('should call next if homebase id in query param is valid', () => {
            request.params.id = 1;
            HomebaseValidator_1.default.validateHomeBaseIdQueryParam(request, res, next);
            expect(errorHandler_1.default.sendErrorResponse).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });
    describe('check counties have dedicated emails', () => {
        beforeEach(() => {
            jest.spyOn(res, 'status');
            jest.spyOn(res, 'json');
            jest.spyOn(database_1.Homebase, 'findOne').mockResolvedValue(HomeBaseValidatorMocks_1.default);
        });
        let request = {
            body: {
                countryId: 1,
                opsEmail: 'tembea@andela.com'
            }
        };
        it('should validate email if new or email already belongs same country', () => __awaiter(void 0, void 0, void 0, function* () {
            const next1 = jest.fn();
            yield HomebaseValidator_1.default.validHomeBaseEmail(request, res, next1);
            expect(next1).toHaveBeenCalledTimes(1);
        }));
        it.only('should call not next if email is already in use and not for that country', () => {
            request = {
                body: {
                    countryId: 2,
                    opsEmail: 'tembea@andela.com'
                }
            };
            const next1 = jest.fn();
            HomebaseValidator_1.default.validHomeBaseEmail(request, res, next1);
            expect(next1).toHaveBeenCalledTimes(0);
        });
    });
});
//# sourceMappingURL=HomebaseValidator.spec.js.map