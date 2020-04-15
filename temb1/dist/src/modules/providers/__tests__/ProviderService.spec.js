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
const providerHelper_1 = __importDefault(require("../../../helpers/providerHelper"));
const provider_service_1 = require("../provider.service");
const user_service_1 = __importDefault(require("../../users/user.service"));
const ProviderMockData_1 = require("../__mocks__/ProviderMockData");
const database_1 = __importDefault(require("../../../database"));
const Notifications_1 = __importDefault(require("../../../modules/slack/SlackPrompts/Notifications"));
const mockInformation_1 = require("../notifications/__mocks__/mockInformation");
const { models: { Provider } } = database_1.default;
describe('ProviderService', () => {
    describe(provider_service_1.providerService.getProviders, () => {
        beforeEach(() => {
            providerHelper_1.default.serializeDetails = jest.fn();
        });
        it('returns a list of providers', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Provider, 'findAll').mockResolvedValue(ProviderMockData_1.mockCabsData.cabsFiltered);
            const result = yield provider_service_1.providerService.getProviders({ page: 1, size: 10 }, {}, 1);
            expect(result.pageMeta.pageNo).toBe(1);
            expect(Provider.findAll).toBeCalled();
        }));
        it('returns a list of providers when the page able parameter is not passed', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Provider, 'findAll').mockResolvedValue(ProviderMockData_1.mockCabsData.cabsFiltered);
            const result = yield provider_service_1.providerService.getProviders({ page: undefined, size: undefined }, {}, 1);
            expect(result.pageMeta.pageNo).toBe(1);
            expect(Provider.findAll).toBeCalled();
        }));
        it('returns a list of providers when page <= totalPages', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Provider, 'findAll').mockResolvedValue(ProviderMockData_1.mockCabsData.cabsFiltered);
            const result = yield provider_service_1.providerService.getProviders({ page: 2, size: 10 }, {}, 1);
            expect(result.pageMeta.pageNo).toBe(1);
            expect(Provider.findAll).toBeCalled();
        }));
    });
    describe(provider_service_1.providerService.createProvider, () => {
        beforeEach(() => {
            jest.spyOn(Provider, 'create').mockResolvedValue(ProviderMockData_1.mockCreatedProvider[0]);
        });
        it('test createProvider', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield provider_service_1.providerService.createProvider({
                name: 'Uber Kenya', providerUserId: 3,
            });
            expect(Provider.create).toHaveBeenCalled();
            expect(result).toEqual(ProviderMockData_1.mockCreatedProvider[0].get());
        }));
    });
    describe(provider_service_1.providerService.deleteProvider, () => {
        beforeAll(() => {
            jest.spyOn(Provider, 'destroy').mockResolvedValue(1);
        });
        it('should delete a provider successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield provider_service_1.providerService.deleteProvider(1);
            expect(result).toEqual(1);
        }));
        it('should return zero for unexisting data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Provider, 'destroy').mockResolvedValue(0);
            const result = yield provider_service_1.providerService.deleteProvider(1);
            expect(result).toEqual(0);
        }));
    });
    describe(provider_service_1.providerService.updateProvider, () => {
        it('should update provider details successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = [1, [{ name: 'Uber Uganda' }]];
            jest.spyOn(user_service_1.default, 'getUserByEmail')
                .mockReturnValue({
                dataValues: { id: 1 },
            });
            jest.spyOn(provider_service_1.providerService, 'updateProvider').mockReturnValueOnce(mockData);
            const results = yield provider_service_1.providerService.updateProvider({ name: 'Uber Uganda' }, 100);
            expect(results[1][0].name)
                .toEqual('Uber Uganda');
        }));
    });
    describe(provider_service_1.providerService.findByPk, () => {
        it('should find provider by PK', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                get: () => ({
                    mockProviderRecordById: ProviderMockData_1.mockProviderRecordById,
                }),
            };
            jest.spyOn(Provider, 'findByPk').mockReturnValue(mockResponse);
            const results = yield provider_service_1.providerService.findByPk(1, true);
            expect(Provider.findByPk).toBeCalled();
        }));
    });
    describe(provider_service_1.providerService.findProviderByUserId, () => {
        it('should find provider by user id', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Provider, 'findOne').mockReturnValue(ProviderMockData_1.mockProviderRecordByProviderId);
            const results = yield provider_service_1.providerService.findProviderByUserId(16);
            expect(Provider.findOne).toBeCalled();
        }));
    });
    describe(provider_service_1.providerService.getViableProviders, () => {
        it('should get viable providers in providers drop down', () => __awaiter(void 0, void 0, void 0, function* () {
            const dummyProviders = [{
                    get: () => ({
                        vehicles: ProviderMockData_1.mockCabsData.cabs, drivers: ProviderMockData_1.mockDriversData,
                    }),
                }];
            jest.spyOn(Provider, 'findAll').mockResolvedValue(dummyProviders);
            yield provider_service_1.providerService.getViableProviders(1);
            expect(Provider.findAll).toBeCalled();
        }));
    });
    describe(provider_service_1.providerService.getProviderBySlackId, () => {
        it('should get provider by slack id', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield provider_service_1.providerService.getProviderBySlackId('3');
            expect(result).toBeDefined();
        }));
    });
    describe(provider_service_1.providerService.notifyTripRequest, () => {
        it('should notify user using Direct message channel', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue(null);
            yield provider_service_1.providerService.notifyTripRequest(mockInformation_1.mockProviderInformation, mockInformation_1.mockTeamDetailInformation, mockInformation_1.mockInformation.tripDetails);
        }));
    });
});
//# sourceMappingURL=ProviderService.spec.js.map