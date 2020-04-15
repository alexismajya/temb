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
const provider_service_1 = require("../../../providers/provider.service");
const user_service_1 = __importDefault(require("../../../users/user.service"));
class ProvidersHelper {
    static toProviderLabelPairValues(providers) {
        return providers.map((val) => ({
            label: `${val.name}`,
            value: val.id
        }));
    }
    static getProviderUserDetails(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { providerUserId, name: providerName } = yield provider_service_1.providerService.getProviderById(providerId);
            const { slackId: providerUserSlackId } = yield user_service_1.default.getUserById(providerUserId);
            return { providerUserSlackId, providerName };
        });
    }
}
exports.default = ProvidersHelper;
//# sourceMappingURL=ProvidersHelper.js.map