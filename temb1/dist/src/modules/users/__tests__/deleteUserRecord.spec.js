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
const database_1 = __importDefault(require("../../../database"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const user_service_1 = __importDefault(require("../user.service"));
const { models: { User } } = database_1.default;
const mockdata = { id: 1, name: 'test1', email: 'deleteEmail@gmail.com' };
describe('Delete user', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should run getUser method and return  a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const findUserMock = jest.spyOn(User, 'findOne');
        findUserMock.mockResolvedValue({ mockdata });
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation(() => { });
        const findUser = jest.spyOn(user_service_1.default, 'getUser').mockResolvedValue(mockdata);
        const result = yield user_service_1.default.getUser('deleteEmail@gmail.com');
        expect(result).toEqual(mockdata);
        expect(httpMock).toHaveBeenCalledTimes(0);
        expect(findUser).toHaveBeenCalledTimes(1);
    }));
    it('should run getUser method and throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockErr = new Error('User not found');
        const findUserMock = jest.spyOn(User, 'findOne');
        findUserMock.mockRejectedValue(mockErr);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation(() => { });
        const findUser = jest.spyOn(user_service_1.default, 'getUser').mockResolvedValue(mockErr);
        const result = yield user_service_1.default.getUser('unknownEmail@gmail.com');
        expect(result).toEqual(mockErr);
        expect(httpMock).toHaveBeenCalledTimes(0);
        expect(findUser).toHaveBeenCalledTimes(1);
    }));
    describe('deleteUser', () => {
        it('should delete user', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(User, 'destroy').mockResolvedValue([]);
            const user = yield user_service_1.default.deleteUser(1);
            expect(user).toEqual([]);
        }));
    });
});
//# sourceMappingURL=deleteUserRecord.spec.js.map