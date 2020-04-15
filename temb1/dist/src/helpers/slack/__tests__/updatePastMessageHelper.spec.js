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
const updatePastMessageHelper_1 = __importDefault(require("../updatePastMessageHelper"));
jest.mock('request');
describe('UpdateSlackMessageHelper', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('should should send a request and update a Slack message', () => __awaiter(void 0, void 0, void 0, function* () {
        const testUrl = 'http://tembea-staging.andela.com/api/v1/slack/command';
        const payload = { state: JSON.stringify({ response_url: testUrl }) };
        const data = { text: 'Noted' };
        const options = {
            url: testUrl,
            method: 'POST',
            json: true,
            body: data,
            headers: { 'content-type': 'application/json', }
        };
        yield updatePastMessageHelper_1.default.updateMessage(payload.state, data);
        expect(request_promise_native_1.default).toHaveBeenCalledWith(options);
    }));
    it('should send request to delete slack messages using the response_url', () => __awaiter(void 0, void 0, void 0, function* () {
        const responseUrl = 'https://webhook.com/slack/';
        const options = {
            url: responseUrl,
            method: 'DELETE',
            resolveWithFullResponse: true
        };
        request_promise_native_1.default.delete = jest.fn().mockResolvedValue({ ok: true });
        yield updatePastMessageHelper_1.default.deleteMessage(responseUrl);
        expect(request_promise_native_1.default).toBeCalledWith(options);
    }));
});
//# sourceMappingURL=updatePastMessageHelper.spec.js.map