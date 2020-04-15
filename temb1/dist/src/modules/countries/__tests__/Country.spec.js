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
const countriesController_1 = __importDefault(require("../countriesController"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const country_service_1 = require("../country.service");
const mocks = __importStar(require("../__mocks__"));
describe('CountryController', () => {
    const res = {
        status: () => ({
            json: () => { }
        })
    };
    const err = 'an error';
    jest.spyOn(res, 'status');
    beforeEach(() => {
        jest.spyOn(bugsnagHelper_1.default, 'log');
        jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('addCountry()', () => {
        const req = {
            body: { name: 'Kenya' }
        };
        const createCountrySpy = jest.spyOn(country_service_1.countryService, 'createCountry');
        it('should return errors', () => __awaiter(void 0, void 0, void 0, function* () {
            createCountrySpy.mockImplementation(() => Promise.reject(new Error(err)));
            yield countriesController_1.default.addCountry(req, res);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
        }));
        it('should create a country', () => __awaiter(void 0, void 0, void 0, function* () {
            createCountrySpy.mockResolvedValue(mocks.mockNewCountry);
            yield countriesController_1.default.addCountry(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
        }));
        it('should return an error if the country exists', () => __awaiter(void 0, void 0, void 0, function* () {
            createCountrySpy.mockResolvedValue(mocks.mockExistingCountry);
            yield countriesController_1.default.addCountry(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
        }));
    });
    describe('updateCountry()', () => {
        const req = {
            body: { name: 'Kenya', newName: 'Uganda' }
        };
        const findCountrySpy = jest.spyOn(country_service_1.countryService, 'findCountry');
        const updateCountryName = jest.spyOn(country_service_1.countryService, 'updateCountryName');
        it('should return an error', () => __awaiter(void 0, void 0, void 0, function* () {
            findCountrySpy.mockImplementation(() => Promise.reject(new Error(err)));
            yield countriesController_1.default.updateCountry(req, res);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
        }));
        it('should update a country', () => __awaiter(void 0, void 0, void 0, function* () {
            findCountrySpy.mockReturnValue(req.body.name);
            updateCountryName.mockReturnValue(mocks.mockUpdatedData);
            yield countriesController_1.default.updateCountry(req, res);
            expect(updateCountryName).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        }));
    });
    describe('deleteCountry()', () => {
        const req = { body: { name: 'Kenya' } };
        const deleteCountrySpy = jest.spyOn(country_service_1.countryService, 'deleteCountryByNameOrId');
        it('should return an error', () => __awaiter(void 0, void 0, void 0, function* () {
            deleteCountrySpy.mockImplementation(() => Promise.reject(new Error(err)));
            yield countriesController_1.default.deleteCountry(req, res);
            expect(deleteCountrySpy).toHaveBeenCalled();
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
        }));
        it('should delete a country', () => __awaiter(void 0, void 0, void 0, function* () {
            deleteCountrySpy.mockReturnValue([]);
            yield countriesController_1.default.deleteCountry(req, res);
            expect(deleteCountrySpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        }));
    });
    describe('getAllCountries()', () => {
        const req = { query: { page: 1, size: 1, name: '' } };
        const { size, name, page } = req.query;
        const getAllCountriesSpy = jest.spyOn(country_service_1.countryService, 'getAllCountries');
        it('should return an error', () => __awaiter(void 0, void 0, void 0, function* () {
            getAllCountriesSpy.mockImplementation(() => Promise.reject(new Error(err)));
            yield countriesController_1.default.getAllCountries(req, res);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
        }));
        it('should getAllCountries', () => __awaiter(void 0, void 0, void 0, function* () {
            getAllCountriesSpy.mockReturnValue(mocks.mockCountryDetails);
            yield countriesController_1.default.getAllCountries(req, res);
            expect(getAllCountriesSpy).toHaveBeenCalledWith(size, page, name);
            expect(res.status).toHaveBeenCalledWith(200);
        }));
        it('should throw a http error if there are no rows', () => __awaiter(void 0, void 0, void 0, function* () {
            getAllCountriesSpy.mockReturnValue(mocks.mockCountryZeroRow);
            yield countriesController_1.default.getAllCountries(req, res);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=Country.spec.js.map