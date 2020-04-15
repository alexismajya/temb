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
const sequelize_1 = __importDefault(require("sequelize"));
const ProviderMockData_1 = require("../__mocks__/ProviderMockData");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const providerHelper_1 = __importDefault(require("../../../helpers/providerHelper"));
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const provider_service_1 = require("../provider.service");
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const user_service_1 = __importDefault(require("../../users/user.service"));
const __mocks__1 = require("../../../services/__mocks__");
const ProviderController_1 = __importDefault(require("../ProviderController"));
describe(ProviderController_1.default, () => {
    let req;
    let providerServiceSpy;
    let createUserByEmailSpy;
    const res = {
        status() {
            return this;
        },
        json() {
            return this;
        }
    };
    beforeEach(() => {
        jest.spyOn(res, 'status');
        jest.spyOn(res, 'json');
        createUserByEmailSpy = jest.spyOn(user_service_1.default, 'createUserByEmail');
        jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockResolvedValue(null);
        jest.spyOn(responseHelper_1.default, 'sendResponse').mockResolvedValue(null);
        jest.spyOn(bugsnagHelper_1.default, 'log').mockResolvedValue(null);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe(ProviderController_1.default.getAllProviders, () => {
        beforeEach(() => {
            providerServiceSpy = jest.spyOn(provider_service_1.providerService, 'getProviders');
            req = {
                query: {
                    page: 1,
                    size: 3,
                    name: 'uber'
                },
                currentUser: { userInfo: { email: 'ddd@gmail.com' } },
                headers: {
                    homebaseid: '4'
                }
            };
        });
        it('Should get all providers', () => __awaiter(void 0, void 0, void 0, function* () {
            const paginateSpy = jest.spyOn(providerHelper_1.default, 'paginateData');
            providerServiceSpy.mockResolvedValue(ProviderMockData_1.newProviders);
            paginateSpy.mockReturnValue(ProviderMockData_1.newPaginatedData);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockReturnValue();
            yield ProviderController_1.default.getAllProviders(req, res);
            expect(providerHelper_1.default.paginateData)
                .toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse)
                .toBeCalledWith(res, 200, true, ProviderMockData_1.successMessage, ProviderMockData_1.newProviders);
        }));
        it('Should catch errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Something went wrong');
            providerServiceSpy.mockRejectedValue(error);
            jest.spyOn(user_service_1.default, 'getUserByEmail').mockImplementation(() => ({ email: 'ddd@gmail.com' }));
            yield ProviderController_1.default.getAllProviders(req, res);
            expect(bugsnagHelper_1.default.log)
                .toBeCalledWith(error);
            expect(errorHandler_1.default.sendErrorResponse)
                .toBeCalledWith(error, res);
        }));
    });
    describe(ProviderController_1.default.addProvider, () => {
        const providerData = {
            name: 'Uber Kenya',
            email: 'allan@andela.com',
            notificationChannel: '0',
        };
        let providerSpy;
        beforeEach(() => {
            req = {
                body: providerData,
                headers: {
                    homebaseid: '4'
                }
            };
            jest.spyOn(user_service_1.default, 'getUserByEmail')
                .mockResolvedValue(__mocks__1.mockUser);
            providerSpy = jest.spyOn(provider_service_1.providerService, 'createProvider');
            jest.spyOn(provider_service_1.providerService, 'verify').mockResolvedValue(null);
        });
        it('creates a provider successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const { homebaseid } = req.headers;
            providerSpy.mockResolvedValue(__mocks__1.mockReturnedProvider.provider);
            yield ProviderController_1.default.addProvider(req, res);
            expect(provider_service_1.providerService.createProvider)
                .toHaveBeenCalledWith(Object.assign(Object.assign({}, providerData), { homebaseId: homebaseid }));
            expect(responseHelper_1.default.sendResponse)
                .toHaveBeenCalledWith(res, 201, true, 'Provider created successfully', __mocks__1.mockReturnedProvider.provider);
        }));
        it('logs HTTP errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const err = 'validationError';
            providerSpy.mockRejectedValueOnce(err);
            yield ProviderController_1.default.addProvider(req, res);
            expect(bugsnagHelper_1.default.log)
                .toHaveBeenCalledWith(err);
            expect(responseHelper_1.default.sendResponse)
                .toHaveBeenCalledWith(res, 400, false, expect.any(String), expect.any(Object));
        }));
    });
    describe(ProviderController_1.default.updateProvider, () => {
        it('should update provider successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            createUserByEmailSpy.mockResolvedValue({ id: 1 });
            providerServiceSpy = jest.spyOn(provider_service_1.providerService, 'updateProvider').mockReturnValue({});
            req = {
                params: 1,
                body: {
                    name: 'Sharks Uber',
                    email: 'Sharks@uber.com'
                },
                headers: { teamurl: 'teamurl' }
            };
            yield ProviderController_1.default.updateProvider(req, res);
            expect(responseHelper_1.default.sendResponse).toBeCalled();
            expect(responseHelper_1.default.sendResponse).toBeCalledWith(res, 200, true, 'Provider Details updated Successfully', {});
        }));
        it('should return message if provider doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
            createUserByEmailSpy.mockResolvedValue({ id: 1 });
            providerServiceSpy = jest.spyOn(provider_service_1.providerService, 'updateProvider').mockResolvedValue({ message: 'Update Failed. Provider does not exist' });
            req = {
                params: 100,
                body: {
                    name: 'Sharks Uber',
                    email: 'Sharks@uber.com'
                },
                headers: { teamurl: 'teamurl' }
            };
            yield ProviderController_1.default.updateProvider(req, res);
            expect(responseHelper_1.default.sendResponse).toBeCalledWith(res, 404, false, 'Update Failed. Provider does not exist');
        }));
        it('should return message if user doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
            createUserByEmailSpy.mockResolvedValue(false);
            providerServiceSpy = jest.spyOn(provider_service_1.providerService, 'updateProvider').mockReturnValue({
                message: 'user with email doesnt exist'
            });
            req = {
                params: 100,
                body: {
                    name: 'Sharks Uber',
                    email: 'Sharks@uber.com'
                },
                headers: { teamurl: 'teamurl' }
            };
            yield ProviderController_1.default.updateProvider(req, res);
            expect(responseHelper_1.default.sendResponse).toBeCalledWith(res, 404, false, 'user with email doesnt exist');
        }));
        it('should return message if update fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Something went wrong');
            createUserByEmailSpy.mockResolvedValue(false);
            providerServiceSpy = jest.spyOn(provider_service_1.providerService, 'updateProvider').mockRejectedValue(error);
            req = {
                params: 100,
                body: {
                    name: 'Sharks Uber',
                    email: 'Sharks@uber.com'
                },
                headers: { teamurl: 'teamurl' }
            };
            yield ProviderController_1.default.updateProvider(req, res);
            expect(bugsnagHelper_1.default.log).toBeCalled();
            expect(responseHelper_1.default.sendResponse).toBeCalled();
        }));
        it('should return message for sequelize validation error', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new sequelize_1.default.ValidationError();
            providerServiceSpy = jest.spyOn(provider_service_1.providerService, 'updateProvider').mockRejectedValue(error);
            req = {
                params: 100,
                body: {
                    name: 'Sharks Uber',
                    email: 'Sharks@uber.com'
                },
                headers: { teamurl: 'teamurl' }
            };
            yield ProviderController_1.default.updateProvider(req, res);
            expect(bugsnagHelper_1.default.log).toBeCalled();
            expect(responseHelper_1.default.sendResponse).toBeCalled();
        }));
    });
    describe(ProviderController_1.default.deleteProvider, () => {
        let deleteProviderSpy;
        let message;
        beforeEach(() => {
            req = {
                params: {
                    id: 1
                },
                headers: {
                    homebaseid: '4'
                }
            };
        });
        beforeEach(() => {
            deleteProviderSpy = jest.spyOn(provider_service_1.providerService, 'deleteProvider');
        });
        it('should return server error', () => __awaiter(void 0, void 0, void 0, function* () {
            deleteProviderSpy.mockRejectedValueOnce('something happened');
            const serverError = {
                message: 'Server Error. Could not complete the request',
                statusCode: 500
            };
            yield ProviderController_1.default.deleteProvider(req, res);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith('something happened');
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledWith(serverError, res);
        }));
        it('should delete a provider successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            message = 'Provider deleted successfully';
            deleteProviderSpy.mockReturnValue(1);
            yield ProviderController_1.default.deleteProvider(req, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 200, true, message);
        }));
        it('should return provider does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            message = 'Provider does not exist';
            deleteProviderSpy.mockReturnValue(0);
            yield ProviderController_1.default.deleteProvider(req, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, message);
        }));
    });
    describe(ProviderController_1.default.getViableProviders, () => {
        it('Should get a list of viable providers', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(provider_service_1.providerService, 'getViableProviders').mockResolvedValue(ProviderMockData_1.viableProviders);
            yield ProviderController_1.default.getViableProviders(req);
            expect(provider_service_1.providerService.getViableProviders).toHaveBeenCalled();
        }));
        it('should return a 404 error', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = 'No viable provider exists';
            jest.spyOn(provider_service_1.providerService, 'getViableProviders').mockResolvedValue([]);
            yield ProviderController_1.default.getViableProviders(req, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, message);
        }));
    });
});
//# sourceMappingURL=ProviderController.spec.js.map