"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserValidator_1 = __importDefault(require("../UserValidator"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
let nextMock;
let resMock;
let reqMock;
let res;
describe('UserValidator', () => {
    beforeEach(() => {
        nextMock = jest.fn();
        resMock = jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockImplementation();
        reqMock = {
            body: {
                email: 'johnsmith',
                roleName: 'admin'
            }
        };
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('validateAssignRole Method', () => {
        it('should call sendResponse method', () => {
            UserValidator_1.default.validateAssignRole(reqMock, res, nextMock);
            expect(resMock).toHaveBeenCalledTimes(1);
            expect(nextMock).not.toHaveBeenCalled();
        });
    });
    describe('getUserRoles', () => {
        it('should call sendResponse method', () => {
            UserValidator_1.default.getUserRoles({ query: { email: 'abc' } }, res, nextMock);
            expect(resMock).toHaveBeenCalledTimes(1);
            expect(nextMock).not.toHaveBeenCalled();
        });
    });
    describe('validateNewRole', () => {
        it('should call sendResponse method', () => {
            UserValidator_1.default.validateNewRole({ body: { roleName: '' } }, res, nextMock);
            expect(resMock).toHaveBeenCalledTimes(1);
            expect(nextMock).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=UserValidator.spec.js.map