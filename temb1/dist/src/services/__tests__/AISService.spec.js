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
const AISService_1 = __importDefault(require("../AISService"));
const cache_1 = __importDefault(require("../../modules/shared/cache"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
describe('AISService', () => {
    const mockUser = {
        id: '-FAKeid_',
        email: 'test.user@andela.com',
        first_name: 'Test',
        last_name: 'User',
        name: 'Test User'
    };
    const mockAISData = {
        values: [
            mockUser
        ]
    };
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should get user details', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(request_promise_native_1.default, 'get').mockResolvedValueOnce(JSON.stringify(mockAISData));
        const result = yield AISService_1.default.getUserDetails('test.user@andela.com');
        expect(result).toHaveProperty('placement');
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('first_name');
        expect(result).toHaveProperty('last_name');
        expect(result).toHaveProperty('name');
    }));
    it('should fetch from cache if it data is there', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(JSON.stringify(mockAISData));
        jest.spyOn(request_promise_native_1.default, 'get').mockResolvedValue(JSON.stringify(mockAISData));
        jest.spyOn(cache_1.default, 'saveObject').mockResolvedValue({});
        yield AISService_1.default.getUserDetails('test.user@andela.com');
        expect(cache_1.default.fetch).toBeCalledTimes(1);
        expect(request_promise_native_1.default.get).toBeCalledTimes(0);
    }));
    it('should throw a rebranded error', () => __awaiter(void 0, void 0, void 0, function* () {
        const errMessage = 'I failed :(';
        jest.spyOn(cache_1.default, 'fetch').mockRejectedValue(new Error(errMessage));
        jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue();
        yield AISService_1.default.getUserDetails('test.user@andela.com');
        expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
    }));
    it('should get user details without AIS profile', () => __awaiter(void 0, void 0, void 0, function* () {
        const aisData = '{ "values": [], "total": 0 }';
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(null);
        jest.spyOn(request_promise_native_1.default, 'get').mockResolvedValue(aisData);
        jest.spyOn(JSON, 'parse');
        const result = yield AISService_1.default.getUserDetails('someone@andela.com');
        expect(result.success).toEqual('true');
        expect(result).toHaveProperty('aisUserData');
        expect(result.aisUserData.first_name).toEqual('someone');
        expect(result.aisUserData.last_name).toEqual(undefined);
    }));
});
//# sourceMappingURL=AISService.spec.js.map