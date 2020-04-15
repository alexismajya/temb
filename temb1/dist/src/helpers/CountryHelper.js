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
Object.defineProperty(exports, "__esModule", { value: true });
const country_service_1 = require("../modules/countries/country.service");
class CountryHelper {
    static checkIfCountryExists(countryName = '', id = -1) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield country_service_1.countryService.findCountry(countryName, id);
            if (country == null) {
                return null;
            }
            return country;
        });
    }
    static checkIfCountryExistsById(countryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield country_service_1.countryService.getCountryById(countryId);
            if (country == null) {
                return null;
            }
            return country;
        });
    }
    static validateString(str) {
        const strRegex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
        return strRegex.test(str);
    }
    static validateIfCountryIsDeleted(countryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield country_service_1.countryService.findDeletedCountry(countryName);
            return country;
        });
    }
    static checkCountry(countryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield country_service_1.countryService.findIfCountryIsListedGlobally(countryName);
            const { error, name } = result;
            if (name === 'RequestError') {
                return true;
            }
            return !error;
        });
    }
}
exports.default = CountryHelper;
//# sourceMappingURL=CountryHelper.js.map