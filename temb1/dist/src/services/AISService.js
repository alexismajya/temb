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
const cache_1 = __importDefault(require("../modules/shared/cache"));
const environment_1 = __importDefault(require("../config/environment"));
const AISHelper_1 = require("../helpers/AISHelper");
const bugsnagHelper_1 = __importDefault(require("../helpers/bugsnagHelper"));
class AISService {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.headers = {
            'api-token': apiKey
        };
    }
    getUserDetails(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = `${this.baseUrl}/users`;
            const options = { qs: { email }, headers: this.headers };
            try {
                if (email.indexOf('andela.com') === -1)
                    return {};
                const key = `AIS_DATA_${email.split('@')[0]}`;
                let result = yield cache_1.default.fetch(key);
                if (result)
                    return result;
                const aisData = yield request_promise_native_1.default.get(uri, options);
                const { values } = JSON.parse(aisData);
                ([result] = values);
                const notOnAis = !environment_1.default.NODE_ENV.includes('production') && !result;
                const notOnProduction = !environment_1.default.NODE_ENV.includes('production');
                if (notOnAis) {
                    result = AISHelper_1.AisData(email);
                    result.placement = yield AISHelper_1.partnerData[Math.floor(Math.random() * AISHelper_1.partnerData.length)];
                }
                if (notOnProduction) {
                    result.placement = yield AISHelper_1.partnerData[Math.floor(Math.random() * AISHelper_1.partnerData.length)];
                }
                yield cache_1.default.saveObject(key, result);
                return result;
            }
            catch (error) {
                bugsnagHelper_1.default.log(`failed to fetch user details from AIS, reason: ${error.message}`);
                return {};
            }
        });
    }
}
exports.AISService = AISService;
const aisService = new AISService(environment_1.default.AIS_API_KEY, environment_1.default.AIS_BASE_URL);
exports.default = aisService;
//# sourceMappingURL=AISService.js.map