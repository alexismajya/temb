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
const ValidationSchemas_1 = require("./ValidationSchemas");
class CabsValidator {
    static validateAllInputs(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.newCabSchema);
    }
    static validateCabUpdateBody(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return GeneralValidator_1.default
                .joiValidation(req, res, next, Object.assign(Object.assign({}, req.params), req.body), ValidationSchemas_1.updateCabSchema, true);
        });
    }
    static validateDeleteCabIdParam(req, res, next) {
        return GeneralValidator_1.default.validateIdParam(req, res, next);
    }
}
exports.default = CabsValidator;
//# sourceMappingURL=CabsValidator.js.map