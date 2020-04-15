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
const user_service_1 = __importDefault(require("../modules/users/user.service"));
const provider_service_1 = require("../modules/providers/provider.service");
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
const ValidationSchemas_1 = require("./ValidationSchemas");
class ProviderValidator {
    static validateNewProvider(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.newProviderSchema);
    }
    static verifyProviderUpdate(req, res, next) {
        return GeneralValidator_1.default
            .joiValidation(req, res, next, Object.assign(Object.assign({}, req.params), req.body), ValidationSchemas_1.updateProviderSchema, true);
    }
    static validateDriverRequestBody(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.newDriverSchema);
    }
    static validateProviderExistence(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { providerId } } = req;
            const provider = yield provider_service_1.providerService.findByPk(providerId);
            if (!provider) {
                return responseHelper_1.default.sendResponse(res, 404, false, 'Provider doesn\'t exist');
            }
            return next();
        });
    }
    static validateProvider(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { email }, headers: { teamurl } } = req;
            if (provider_service_1.providerService.isDmOrChannel(req.body.notificationChannel)) {
                try {
                    const providerUser = yield user_service_1.default.createUserByEmail(teamurl, email);
                    Object.assign(req.body, { providerUserId: providerUser.id });
                }
                catch (error) {
                    const message = 'The user with specified email does not exist';
                    return responseHelper_1.default.sendResponse(res, 404, false, message);
                }
            }
            return next();
        });
    }
}
exports.default = ProviderValidator;
//# sourceMappingURL=ProviderValidator.js.map