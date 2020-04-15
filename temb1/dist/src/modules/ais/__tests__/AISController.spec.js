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
const AISController_1 = __importDefault(require("../AISController"));
const AISService_1 = __importDefault(require("../../../services/AISService"));
const AISData_mock_1 = __importDefault(require("../__mocks__/AISData.mock"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
describe('AISController', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            query: {
                email: 'test@test.com'
            }
        };
        res = {
            status: jest.fn(() => ({
                json: jest.fn(() => { })
            })).mockReturnValue({ json: jest.fn() })
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('/getUserDetails', () => {
        it('should return user data from AIS', () => __awaiter(void 0, void 0, void 0, function* () {
            AISService_1.default.getUserDetails = jest.fn().mockResolvedValue(AISData_mock_1.default);
            yield AISController_1.default.getUserDataByEmail(req, res);
            expect(res.status).toBeCalledTimes(1);
            expect(res.status).toBeCalledWith(200);
            expect(res.status().json).toHaveBeenCalledWith({ aisUserData: AISData_mock_1.default, success: 'true' });
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            AISService_1.default.getUserDetails = jest.fn().mockRejectedValue(new Error('Failing for a test'));
            errorHandler_1.default.sendErrorResponse = jest.fn().mockReturnValue({});
            bugsnagHelper_1.default.log = jest.fn().mockReturnValue({});
            yield AISController_1.default.getUserDataByEmail(req, res);
            expect(errorHandler_1.default.sendErrorResponse).toBeCalledTimes(1);
            expect(bugsnagHelper_1.default.log).toBeCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=AISController.spec.js.map