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
const WebClientSingleton_1 = __importDefault(require("../../utils/WebClientSingleton"));
const sendDialogTryCatch_1 = __importDefault(require("../sendDialogTryCatch"));
const bugsnagHelper_1 = __importDefault(require("../bugsnagHelper"));
const getWebClientMock = (mock) => ({
    dialog: { open: mock }
});
describe('sendDialogTryCatch', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it('should open dialog', () => __awaiter(void 0, void 0, void 0, function* () {
        const open = jest.fn().mockResolvedValue({ status: true });
        jest.spyOn(WebClientSingleton_1.default, 'getWebClient')
            .mockReturnValue(getWebClientMock(open));
        yield sendDialogTryCatch_1.default();
        expect(open).toHaveBeenCalled();
    }));
    it('should handle error', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('There was a problem processing your request');
        const open = jest.fn().mockRejectedValue(error);
        jest.spyOn(WebClientSingleton_1.default, 'getWebClient')
            .mockReturnValue(getWebClientMock(open));
        jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue();
        try {
            yield sendDialogTryCatch_1.default();
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }
        catch (e) {
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith(error);
            expect(e).toEqual(error);
        }
    }));
});
//# sourceMappingURL=sendDialogTryCatch.spec.js.map