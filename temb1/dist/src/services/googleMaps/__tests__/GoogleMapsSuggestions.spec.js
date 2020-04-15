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
const GoogleMapsSuggestions_1 = __importDefault(require("../GoogleMapsSuggestions"));
const GoogleMapsSuggestionsMock_1 = __importDefault(require("../__mocks__/GoogleMapsSuggestionsMock"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
describe('GoogleMapSuggestions Helper', () => {
    it('should get suggestions for an input address', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = [
            { location: 'location1' },
            { location: 'location2' }
        ];
        request_promise_native_1.default.get = jest.fn().mockResolvedValue(JSON.stringify(response));
        const result = yield GoogleMapsSuggestions_1.default.getPlacesAutoComplete(GoogleMapsSuggestionsMock_1.default);
        expect(result).toEqual(response);
    }));
    it('should throw an error when reponse has error_message', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = {
            error_message: 'Error found'
        };
        request_promise_native_1.default.get = jest.fn().mockResolvedValue(JSON.stringify(response));
        bugsnagHelper_1.default.log = jest.fn().mockReturnValue({});
        yield GoogleMapsSuggestions_1.default.getPlacesAutoComplete('xxxx');
        expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=GoogleMapsSuggestions.spec.js.map