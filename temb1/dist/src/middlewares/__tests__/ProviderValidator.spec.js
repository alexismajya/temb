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
const ProviderValidator_1 = __importDefault(require("../ProviderValidator"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const user_service_1 = __importDefault(require("../../modules/users/user.service"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const provider_service_1 = require("../../modules/providers/provider.service");
const errorMessage = 'Validation error occurred, see error object for details';
describe(ProviderValidator_1.default, () => {
    let res;
    let next;
    let req;
    beforeEach(() => {
        res = {
            status: jest.fn(() => ({
                json: jest.fn()
            }))
        };
        next = jest.fn();
        jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockReturnValue();
        jest.spyOn(responseHelper_1.default, 'sendResponse').mockReturnValue();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe(ProviderValidator_1.default.verifyProviderUpdate, () => {
        let httpSpy;
        beforeEach(() => {
            httpSpy = jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
        });
        it('should validate update parameters ', () => {
            const error = { message: { invalidParameter: 'Id should be a valid integer' } };
            req = {
                params: { id: 'notValid' },
                body: {}
            };
            httpSpy.mockReturnValue(error);
            ProviderValidator_1.default.verifyProviderUpdate(req, res, next);
            expect(httpSpy).toBeCalled();
        });
        it('should validate empty request body', () => {
            req = {
                params: { id: 1 },
                body: {}
            };
            ProviderValidator_1.default.verifyProviderUpdate(req, res, next);
            expect(httpSpy).toBeCalled();
        });
        it('should validate empty request body values', () => {
            req = {
                params: { id: 1 },
                body: {
                    name: '',
                    email: 'me@email.com'
                }
            };
            ProviderValidator_1.default.verifyProviderUpdate(req, res, next);
            expect(httpSpy).toBeCalled();
        });
        it('should return next if valid update body ', () => {
            req = {
                params: { id: 1 },
                body: { email: 'me@email.com' }
            };
            ProviderValidator_1.default.verifyProviderUpdate(req, res, next);
            expect(httpSpy).not.toBeCalled();
            expect(next).toBeCalled();
        });
    });
    describe(ProviderValidator_1.default.validateNewProvider, () => {
        it('validates the PATCH method', () => {
            req = {
                method: 'PATCH',
                body: {}
            };
            ProviderValidator_1.default.validateNewProvider(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse)
                .toHaveBeenCalledWith({
                statusCode: 400,
                message: errorMessage,
                error: {
                    email: 'Please provide email',
                    name: 'Please provide name',
                    notificationChannel: 'Please provide notificationChannel'
                },
            }, res);
        });
        it('returns next', () => {
            req = {
                body: {
                    email: 'allan@andela.com',
                    name: 'all',
                    notificationChannel: '0',
                }
            };
            ProviderValidator_1.default.validateNewProvider(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe(ProviderValidator_1.default.validateDriverRequestBody, () => {
        it('should throw errors if fields are missing in body', () => __awaiter(void 0, void 0, void 0, function* () {
            const createReq = {
                body: {
                    driverName: 'Muhwezi Deo',
                    driverNumber: '42220222',
                    email: 'Test@test.com'
                }
            };
            yield ProviderValidator_1.default.validateDriverRequestBody(createReq, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledWith({
                statusCode: 400,
                message: errorMessage,
                error: {
                    driverPhoneNo: 'Please provide driverPhoneNo',
                    providerId: 'Please provide providerId'
                }
            }, res);
        }));
        it('should throw errors if a field is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const createReq = {
                body: {
                    driverName: '',
                    driverNumber: '42220222',
                    email: 'Test@test.com',
                    driverPhoneNo: '+2507042211313',
                    providerId: 1
                }
            };
            yield ProviderValidator_1.default.validateDriverRequestBody(createReq, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledWith({
                statusCode: 400,
                message: errorMessage,
                error: { driverName: '\"driverName\" is not allowed to be empty' }
            }, res);
        }));
        it('should call next if request body is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const createReq = {
                body: {
                    driverName: 'Test User',
                    driverNumber: '42220222',
                    email: 'Test@test.com',
                    driverPhoneNo: '+2507042211313',
                    providerId: 1
                }
            };
            yield ProviderValidator_1.default.validateDriverRequestBody(createReq, res, next);
            expect(next).toHaveBeenCalled();
        }));
    });
    describe(ProviderValidator_1.default.validateProviderExistence, () => {
        it('should send error if a provider doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const createReq = {
                body: {
                    driverName: 'Test User',
                    driverNumber: '42220222',
                    email: 'Test@test.com',
                    driverPhoneNo: '07042211313',
                    providerId: 100
                }
            };
            jest.spyOn(provider_service_1.providerService, 'findByPk').mockReturnValue(null);
            yield ProviderValidator_1.default.validateProviderExistence(createReq, res, next);
            expect(responseHelper_1.default.sendResponse).toBeCalledWith(res, 404, false, 'Provider doesnt exist');
        }));
        it('should call next if provider exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const createReq = {
                body: {
                    driverName: 'Test User',
                    driverNumber: '42220222',
                    email: 'Test@test.com',
                    driverPhoneNo: '07042211313',
                    providerId: 1
                }
            };
            jest.spyOn(provider_service_1.providerService, 'findByPk').mockReturnValue({
                name: 'Test Provider',
                email: 'test@test.com'
            });
            yield ProviderValidator_1.default.validateProviderExistence(createReq, res, next);
            expect(next).toHaveBeenCalled();
        }));
    });
    describe(ProviderValidator_1.default.validateProvider, () => {
        let testReq;
        beforeEach(() => {
            testReq = {
                body: {
                    driverName: 'Test User',
                    driverNumber: '42220222',
                    email: 'Test@test.com',
                    driverPhoneNo: '07042211313',
                    notificationChannel: '0',
                },
                headers: {
                    teamurl: 'https://temvea.test',
                }
            };
            jest.spyOn(user_service_1.default, 'createUserByEmail').mockResolvedValue({ id: 1 });
        });
        it('should add provider user id if user exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateReq = Object.assign({}, testReq);
            yield ProviderValidator_1.default.validateProvider(updateReq, res, next);
            expect(next).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=ProviderValidator.spec.js.map