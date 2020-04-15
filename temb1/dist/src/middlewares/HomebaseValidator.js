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
const responseHelper_1 = __importDefault(require("../helpers/responseHelper"));
const homebase_service_1 = require("../modules/homebases/homebase.service");
const CountryHelper_1 = __importDefault(require("../helpers/CountryHelper"));
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
const ValidationSchemas_1 = require("./ValidationSchemas");
const HomeBaseHelper_1 = __importDefault(require("../helpers/HomeBaseHelper"));
class HomebaseValidator {
    static validateCountryExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { countryId } } = req;
            if (countryId) {
                const message = `The country with Id: '${countryId}' does not exist`;
                const countryExists = yield CountryHelper_1.default.checkIfCountryExistsById(countryId);
                if (!countryExists) {
                    return responseHelper_1.default.sendResponse(res, 404, false, message);
                }
            }
            return next();
        });
    }
    static validateHomeBase(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.newHomeBaseSchema);
    }
    static validateHomeBaseIdQueryParam(req, res, next) {
        return GeneralValidator_1.default.validateIdParam(req, res, next);
    }
    static validateUpdateHomeBase(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.updateHomeBaseSchema);
    }
    static validateHomeBaseExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params: { id }, body: { homebaseId } } = req;
            const verifyId = homebaseId || id;
            const homeBaseExists = yield HomeBaseHelper_1.default.checkIfHomeBaseExists(verifyId);
            if (!homeBaseExists) {
                const message = `The HomeBase with Id: '${verifyId}' does not exist`;
                return responseHelper_1.default.sendResponse(res, 404, false, message);
            }
            return next();
        });
    }
    static validHomeBaseEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { opsEmail, countryId } = req.body;
            const response = yield homebase_service_1.homebaseService
                .findOneByProp({ prop: 'opsEmail', value: opsEmail });
            if (response === null || response.countryId === countryId) {
                return next();
            }
            const message = 'opsEmail already belongs to another homebase ';
            return responseHelper_1.default.sendResponse(res, 409, false, message);
        });
    }
}
exports.default = HomebaseValidator;
//# sourceMappingURL=HomebaseValidator.js.map