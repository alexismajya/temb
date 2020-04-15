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
const bugsnagHelper_1 = __importDefault(require("../bugsnagHelper"));
class UpdateSlackMessageHelper {
    static updateMessage(state, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { response_url: responseUrl } = JSON.parse(state);
                return UpdateSlackMessageHelper.sendMessage(responseUrl, data);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static sendMessage(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    url,
                    method: 'POST',
                    json: true,
                    body: data,
                    headers: { 'content-type': 'application/json', }
                };
                const response = yield request_promise_native_1.default(options);
                return response;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static deleteMessage(responseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    url: responseUrl,
                    method: 'DELETE',
                    resolveWithFullResponse: true
                };
                const response = yield request_promise_native_1.default(options);
                return response;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static newUpdateMessage(responseUrl, newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return UpdateSlackMessageHelper.sendMessage(responseUrl, newMessage);
        });
    }
}
exports.default = UpdateSlackMessageHelper;
//# sourceMappingURL=updatePastMessageHelper.js.map