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
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const country_service_1 = __importStar(require("../country.service"));
const database_1 = __importDefault(require("../../../database"));
const __mocks__1 = require("../../../services/__mocks__");
const mocked = __importStar(require("../__mocks__"));
const countryHelperMock_1 = require("../../../helpers/__mocks__/countryHelperMock");
const { models: { Country } } = database_1.default;
describe(country_service_1.default, () => {
    beforeAll((done) => database_1.default.close().then(done, done));
    afterAll((done) => database_1.default.close().then(done, done));
    describe('test function GetAllCountries()', () => {
        let findAllCountriesSpy;
        beforeEach(() => {
            jest.spyOn(Country, 'count').mockResolvedValue(2);
            findAllCountriesSpy = jest.spyOn(Country, 'findAll');
        });
        it('should get all countries', () => __awaiter(void 0, void 0, void 0, function* () {
            findAllCountriesSpy.mockResolvedValue(mocked.mockCountryCreationResponse.countries);
            const countries = yield country_service_1.countryService.getAllCountries(1, 1, '');
            expect(findAllCountriesSpy).toHaveBeenCalled();
            expect(countries).toEqual({
                count: 1,
                rows: [mocked.mockCountryCreationResponse.countries[0].get()],
            });
        }));
    });
    describe('test getCountryByID()', () => {
        it('should get a country by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedResponse = {
                get: () => ({
                    id: 1,
                    name: 'Kenya',
                    status: 'Active',
                    createdAt: '2019-04-01T12:07:13.002Z',
                    updatedAt: '2019-04-01T12:07:13.002Z',
                }),
            };
            const findOneSpy = jest.spyOn(Country, 'findOne')
                .mockResolvedValue(mockedResponse);
            const country = yield country_service_1.countryService.getCountryById(1);
            expect(findOneSpy).toHaveBeenCalled();
            expect(country).toEqual(mockedResponse.get());
        }));
    });
    describe('test findCountryByName', () => {
        it('should find country by name', () => __awaiter(void 0, void 0, void 0, function* () {
            const findOneSpy = jest.spyOn(Country, 'findOne')
                .mockResolvedValue(mocked.mockCountryCreationResponse.countries[0]);
            const country = yield country_service_1.countryService.findCountry('Kenya');
            expect(findOneSpy).toHaveBeenCalled();
            expect(country).toEqual(mocked.mockCountryCreationResponse.countries[0]);
        }));
    });
    describe('test createCountry()', () => {
        it('should create a country with supplied name', () => __awaiter(void 0, void 0, void 0, function* () {
            const createCountrySpy = jest.spyOn(Country, 'findOrCreate');
            createCountrySpy.mockResolvedValue([
                mocked.mockReturnedCountryData, mocked.mockReturnedCountryData._options.isNewRecord,
            ]);
            const result = yield country_service_1.countryService.createCountry('Kenya');
            expect(createCountrySpy).toHaveBeenCalled();
            expect(result).toEqual({
                country: Object.assign({}, mocked.mockReturnedCountryData.get()), isNewCountry: true,
            });
        }));
    });
    describe('test updateCountryName()', () => {
        const countryDetails = {
            id: 1,
            name: 'Kenya',
            status: 'Active',
            createdAt: '2019-04-01T12:07:13.002Z',
            updatedAt: '2019-04-01T12:07:13.002Z',
        };
        it('should update country name', () => __awaiter(void 0, void 0, void 0, function* () {
            const plainResponse = {
                get: ({ plain } = {}) => {
                    if (plain) {
                        return countryDetails;
                    }
                },
            };
            const findOneSpy = jest.spyOn(Country, 'findByPk')
                .mockResolvedValue(plainResponse);
            jest.spyOn(Country, 'update').mockImplementation((data, options) => ([
                null, [{ get: () => (Object.assign({ id: options.where.id }, data)) }],
            ]));
            const result = yield country_service_1.countryService.updateCountryName(1, 'New Kenya');
            expect(result).toHaveProperty('name', 'New Kenya');
            expect(findOneSpy).toHaveBeenCalled();
        }));
        it('should return an error when the name already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const plainResponse = {
                get: ({ plain }) => {
                    if (plain) {
                        return countryDetails;
                    }
                },
            };
            const findOneSpy = jest.spyOn(Country, 'findByPk')
                .mockResolvedValue(plainResponse);
            jest.spyOn(Country, 'update').mockRejectedValue(new Error());
            const result = yield country_service_1.countryService.updateCountryName(2, 'New Kenya');
            expect(result).toHaveProperty('message', 'Country name already exists');
            expect(findOneSpy).toHaveBeenCalled();
        }));
        it('should return an error when the is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const plainResponse = {
                get: ({ plain }) => {
                    if (plain)
                        return undefined;
                },
            };
            const findOneSpy = jest.spyOn(Country, 'findByPk')
                .mockResolvedValue(plainResponse);
            const result = yield country_service_1.countryService.updateCountryName(2, 'New Kenya');
            expect(result).toHaveProperty('message', 'Country does not exist');
            expect(findOneSpy).toHaveBeenCalled();
        }));
    });
    describe('test deleteCountryName', () => {
        it('should delete a country', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                get: () => ({
                    status: 'active',
                    name: 'Kenya',
                    id: 1,
                }),
                id: 1,
            };
            const findOneSpy = jest.spyOn(Country, 'findOne')
                .mockResolvedValue(mockResponse);
            jest.spyOn(Country, 'update').mockResolvedValue([1, [mockResponse]]);
            const result = yield country_service_1.countryService.deleteCountryByNameOrId(null, 'Kenya');
            expect(findOneSpy).toHaveBeenCalled();
            expect(result).not.toBeNull();
            expect(result).toEqual(true);
        }));
    });
    describe('test findDeletedCountry', () => {
        beforeAll(() => {
            jest.spyOn(Country, 'scope').mockReturnValue({
                findOne: jest.fn(),
            });
        });
        it('should find a country that is deleted and return it', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Country.scope(), 'findOne').mockReturnValue(countryHelperMock_1.deletedCountryMock);
            const returnedCountry = yield country_service_1.countryService.findDeletedCountry('Kenya');
            expect(Country.scope).toHaveBeenCalledWith('all');
            expect(returnedCountry).toEqual(countryHelperMock_1.deletedCountryMock);
        }));
        describe('test findIfCountryIsListedGlobally', () => {
            let getSpy;
            beforeEach(() => {
                getSpy = jest.spyOn(request_promise_native_1.default, 'get');
                jest.resetAllMocks();
            });
            it('should return a country that is listed globally', () => __awaiter(void 0, void 0, void 0, function* () {
                getSpy.mockResolvedValue(__mocks__1.mockReturnedCountryData);
                const result = yield country_service_1.countryService.findIfCountryIsListedGlobally('Kenya');
                expect(request_promise_native_1.default.get).toHaveBeenCalled();
                expect(result).toEqual(__mocks__1.mockReturnedCountryData);
            }));
            it('should return an error object if country was not found', () => __awaiter(void 0, void 0, void 0, function* () {
                getSpy.mockRejectedValue(__mocks__1.mockCountryError);
                const result = yield country_service_1.countryService.findIfCountryIsListedGlobally('abuja');
                expect(request_promise_native_1.default.get).toHaveBeenCalled();
                expect(result).toEqual(__mocks__1.mockCountryError);
            }));
        });
    });
});
//# sourceMappingURL=CountryService.spec.js.map