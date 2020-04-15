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
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const country_service_1 = require("./country.service");
const constants_1 = require("../../helpers/constants");
class CountryController {
    static addCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { name } } = req;
            try {
                const { country, isNewCountry } = yield country_service_1.countryService.createCountry(name);
                if (isNewCountry) {
                    return res.status(201).json({
                        success: true,
                        message: 'Country created successfully',
                        country
                    });
                }
                return res.status(409).json({
                    success: false,
                    message: 'Country Already Exists',
                });
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
                errorHandler_1.default.sendErrorResponse(err, res);
            }
        });
    }
    static updateCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, newName } = req.body;
            try {
                let country = yield country_service_1.countryService.findCountry(name);
                if (country) {
                    const countryId = country.id;
                    country = yield country_service_1.countryService.updateCountryName(countryId, newName);
                    return res.status(200)
                        .json({
                        success: true,
                        message: 'Country updated successfully',
                        country
                    });
                }
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
                errorHandler_1.default.sendErrorResponse(err, res);
            }
        });
    }
    static deleteCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: { id, name } } = req;
                const success = yield country_service_1.countryService.deleteCountryByNameOrId(id, name);
                if (success) {
                    return res.status(200).json({
                        success,
                        message: 'The country has been deleted'
                    });
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static getAllCountries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const size = req.query.size || constants_1.DEFAULT_SIZE;
                const name = req.query.name || '';
                const countries = yield country_service_1.countryService.getAllCountries(size, page, name);
                const { count, rows } = countries;
                if (rows <= 0) {
                    throw new errorHandler_1.default('There are no countries on this page.', 404);
                }
                const totalPages = Math.ceil(count / size);
                return res.status(200).json({
                    success: true,
                    message: `${page} of ${totalPages} page(s).`,
                    pageMeta: {
                        totalPages,
                        totalResults: count,
                        page,
                        size
                    },
                    countries: rows,
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
}
exports.default = CountryController;
//# sourceMappingURL=countriesController.js.map