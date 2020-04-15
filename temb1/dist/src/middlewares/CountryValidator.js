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
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
const CountryHelper_1 = __importDefault(require("../helpers/CountryHelper"));
const ValidationSchemas_1 = require("./ValidationSchemas");
const responseHelper_1 = __importDefault(require("../helpers/responseHelper"));
class CountryValidator {
    static validateCountryReqBody(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.countrySchema);
    }
    static validateCountryExistence(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.action) {
                const { body: { name } } = req;
                const message = `Country named: '${name}' is not listed globally`;
                const countryExists = yield CountryHelper_1.default.checkCountry(name);
                if (countryExists === false) {
                    return responseHelper_1.default.sendResponse(res, 404, false, message);
                }
            }
            return next();
        });
    }
    static validateNamedCountryExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            if (!req.query.action) {
                const { body: { name, id } } = req;
                const countryExists = yield CountryHelper_1.default.checkIfCountryExists(name, id);
                message = `Country with name: '${name}' does not exist`;
                if (!req.body.name) {
                    message = `Country with id: '${id}' does not exist`;
                }
                if (countryExists == null) {
                    return responseHelper_1.default.sendResponse(res, 404, false, message);
                }
                return next();
            }
            return next();
        });
    }
    static setToActiveIfDeleted(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { name } } = req;
            const country = yield CountryHelper_1.default.validateIfCountryIsDeleted(name);
            if (country !== null) {
                country.status = 'Active';
                yield country.save();
            }
            return next();
        });
    }
    static validateIfCountryNameIsTaken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { newName } } = req;
            const emptyName = GeneralValidator_1.default.isEmpty(newName);
            if (!emptyName) {
                let countryExists;
                let message;
                countryExists = yield CountryHelper_1.default.checkIfCountryExists(newName);
                if (!countryExists) {
                    countryExists = yield CountryHelper_1.default.checkCountry(newName);
                    if (countryExists) {
                        return next();
                    }
                    message = `The country name: '${newName}' is not listed globally`;
                }
                else {
                    message = `The country name: '${newName}' is already taken`;
                }
                return responseHelper_1.default.sendResponse(res, 400, false, message);
            }
            return next();
        });
    }
    static validateUpdateReqBody(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.updateCountrySchema);
    }
}
exports.default = CountryValidator;
//# sourceMappingURL=CountryValidator.js.map