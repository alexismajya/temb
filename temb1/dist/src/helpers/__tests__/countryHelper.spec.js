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
const country_service_1 = require("../../modules/countries/country.service");
const CountryHelper_1 = __importDefault(require("../CountryHelper"));
const countryHelperMock_1 = require("../__mocks__/countryHelperMock");
describe('CountryHelper', () => {
    let countrySpy;
    let name;
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('checkIfCountryExists', () => {
        beforeEach(() => {
            countrySpy = jest.spyOn(country_service_1.countryService, 'findCountry');
            name = 'Kenya';
        });
        it('test when a value is returned by findCountry', () => __awaiter(void 0, void 0, void 0, function* () {
            countrySpy.mockResolvedValue(countryHelperMock_1.countryMock);
            const result = yield CountryHelper_1.default.checkIfCountryExists(name);
            expect(countrySpy).toHaveBeenCalledWith(name, -1);
            expect(result).not.toBeNull();
        }));
        it('test when a null is returned by findCountry', () => __awaiter(void 0, void 0, void 0, function* () {
            countrySpy.mockResolvedValue(null);
            const result = yield CountryHelper_1.default.checkIfCountryExists(name);
            expect(countrySpy).toHaveBeenCalledWith(name, -1);
            expect(result).toBeNull();
        }));
    });
    describe('validateString', () => {
        const validString = 'Kenya';
        const inValidString = 'Kenya#';
        const isValid = CountryHelper_1.default.validateString(validString);
        const isInvalid = CountryHelper_1.default.validateString(inValidString);
        expect(isValid).toBe(true);
        expect(isInvalid).toBe(false);
    });
    describe('validateIfCountryIsDeleted', () => {
        it('validates if country is deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            const countryName = 'Kenya';
            const findDeletedCountrySpy = jest.spyOn(country_service_1.countryService, 'findDeletedCountry');
            findDeletedCountrySpy.mockResolvedValue(countryHelperMock_1.deletedCountryMock);
            const result = yield CountryHelper_1.default.validateIfCountryIsDeleted(countryName);
            expect(findDeletedCountrySpy).toHaveBeenCalledWith(countryName);
            expect(result).toEqual(countryHelperMock_1.deletedCountryMock);
        }));
    });
    describe('checkCountry', () => {
        let findCountrySpy;
        beforeEach(() => {
            jest.resetAllMocks();
            findCountrySpy = jest.spyOn(country_service_1.countryService, 'findIfCountryIsListedGlobally');
        });
        it('returns false if country does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            findCountrySpy.mockResolvedValue(countryHelperMock_1.mockError);
            const result = yield CountryHelper_1.default.checkCountry('Kenya');
            expect(result).toEqual(false);
        }));
        it('returns true if country exists', () => __awaiter(void 0, void 0, void 0, function* () {
            findCountrySpy.mockResolvedValue(countryHelperMock_1.countryMock);
            const result = yield CountryHelper_1.default.checkCountry('Kenya');
            expect(result).toEqual(true);
        }));
        it('returns true if API is down', () => __awaiter(void 0, void 0, void 0, function* () {
            findCountrySpy.mockResolvedValue(countryHelperMock_1.mockAPIFail);
            const result = yield CountryHelper_1.default.checkCountry('Kenya');
            expect(result).toEqual(true);
        }));
    });
    describe('checkIfCountryExistsById', () => {
        it('should check if country exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const countryId = 1;
            const getCountryByIdSpy = jest.spyOn(country_service_1.countryService, 'getCountryById');
            getCountryByIdSpy.mockResolvedValue(countryHelperMock_1.countryMock);
            const result = yield CountryHelper_1.default.checkIfCountryExistsById(countryId);
            expect(getCountryByIdSpy).toHaveBeenCalledWith(countryId);
            expect(typeof result).toBe('object');
        }));
        it('should throw error if countryId not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const getCountryByIdSpy = jest.spyOn(country_service_1.countryService, 'getCountryById');
            getCountryByIdSpy.mockResolvedValue(countryHelperMock_1.countryMock);
            const result = yield CountryHelper_1.default.checkIfCountryExistsById();
            expect(typeof result).toBe('object');
        }));
    });
});
//# sourceMappingURL=countryHelper.spec.js.map