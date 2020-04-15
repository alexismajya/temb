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
const address_service_1 = require("../modules/addresses/address.service");
const ValidationSchemas_1 = require("./ValidationSchemas");
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
const responseHelper_1 = __importDefault(require("../helpers/responseHelper"));
class AddressValidator {
    static validateAddressBody(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.newAddressSchema);
    }
    static validateAddressUpdateBody(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.updateAddressSchema);
    }
    static validateaddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address } = req.body;
            const place = yield address_service_1.addressService.findAddress(address);
            if (place) {
                const message = 'Address already exists';
                return responseHelper_1.default.sendResponse(res, 400, false, message);
            }
            return next();
        });
    }
    static validateUpdateaddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address } = req.body;
            const place = yield address_service_1.addressService.findAddress(address);
            if (!place) {
                const message = 'Address does not exist';
                return responseHelper_1.default.sendResponse(res, 404, false, message);
            }
            return next();
        });
    }
}
exports.default = AddressValidator;
//# sourceMappingURL=AddressValidator.js.map