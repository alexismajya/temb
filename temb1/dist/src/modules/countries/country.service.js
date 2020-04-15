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
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const base_service_1 = require("./../shared/base.service");
const sequelize_1 = require("sequelize");
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const country_1 = __importDefault(require("../../database/models/country"));
const database_1 = __importDefault(require("../../database"));
class CountryService extends base_service_1.BaseService {
    constructor(country = database_1.default.getRepository(country_1.default)) {
        super(country);
    }
    createCountry(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const [country, isNewCountry] = yield this.model.findOrCreate({
                where: { name: { [sequelize_1.Op.iLike]: `${name.trim()}%` } },
                defaults: { name },
            });
            return {
                isNewCountry,
                country: country.get(),
            };
        });
    }
    findCountry(name, id = -1) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield this.model.findOne({
                where: { [sequelize_1.Op.or]: [{ id }, { name: { [sequelize_1.Op.iLike]: `${name.trim()}` } }] },
                raw: true,
            });
            return country;
        });
    }
    getAllCountries(size, page, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.getPaginated({
                page,
                limit: size,
                defaultOptions: {
                    where: { name: { [sequelize_1.Op.iLike]: `${name}%` } },
                    order: [['id', 'ASC']],
                },
            });
            return {
                rows: data,
                count: data.length,
            };
        });
    }
    getCountryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield this.findById(id);
            return country;
        });
    }
    updateCountryName(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const country = yield this.findById(id);
                if (!country)
                    return { message: 'Country does not exist' };
                const updatedCountry = yield this.update(id, { name });
                return updatedCountry;
            }
            catch (error) {
                return { message: 'Country name already exists' };
            }
        });
    }
    deleteCountryByNameOrId(id = -1, name = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield this.model.findOne({
                where: { [sequelize_1.Op.or]: [{ id }, { name: { [sequelize_1.Op.iLike]: `${name}` } }] },
                raw: true,
            });
            errorHandler_1.default.throwErrorIfNull(country, 'Country provided was not found', 404);
            yield this.update(country.id, { status: 'Inactive' });
            return true;
        });
    }
    findDeletedCountry(name = '', status = 'Inactive') {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield country_1.default.scope('all').findOne({
                where: {
                    [sequelize_1.Op.and]: [
                        { status },
                        { name: name.trim() },
                    ],
                },
            });
            return country;
        });
    }
    findIfCountryIsListedGlobally(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = `https://restcountries.eu/rest/v2/name/${name}`;
            try {
                const countryData = yield request_promise_native_1.default.get(uri);
                return countryData;
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.countryService = new CountryService();
exports.default = CountryService;
//# sourceMappingURL=country.service.js.map