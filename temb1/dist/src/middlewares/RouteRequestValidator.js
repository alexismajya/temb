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
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
const ValidationSchemas_1 = require("./ValidationSchemas");
const JoiHelper_1 = __importDefault(require("../helpers/JoiHelper"));
class RouteRequestValidator {
    static validateParams(req, res, next) {
        if (!/^[1-9]\d*$/.test(req.params.requestId)) {
            return responseHelper_1.default.sendResponse(res, 400, false, 'Request Id can only be a number');
        }
        return next();
    }
    static validateRequestBody(req, res, next) {
        const { newOpsStatus } = req.body;
        if (newOpsStatus && newOpsStatus === 'approve') {
            return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.approveRouteRequestSchema);
        }
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.declineRouteRequestSchema);
    }
    static validateRatingsStartEndDateAndLocalCountry(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationResponse = JoiHelper_1.default.validateSubmission(req.query, ValidationSchemas_1.dateRangeSchema);
            if (validationResponse.errorMessage) {
                return responseHelper_1.default.sendResponse(res, 400, false, validationResponse);
            }
            next();
        });
    }
}
exports.default = RouteRequestValidator;
//# sourceMappingURL=RouteRequestValidator.js.map