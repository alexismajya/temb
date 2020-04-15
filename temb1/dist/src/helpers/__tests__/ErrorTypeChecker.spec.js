"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const ErrorTypeChecker_1 = __importDefault(require("../ErrorTypeChecker"));
describe('ErrorTypeChecker', () => {
    it('should return custom message and status code incase of sequelize error', () => {
        const error = new sequelize_1.default.ValidationError();
        const result = ErrorTypeChecker_1.default.checkSequelizeValidationError(error, 'Name already Taken');
        expect(result.message).toEqual('Name already Taken');
        expect(result.statusCode).toEqual(400);
    });
    it('should return error is not instance of sequelize Validation error', () => {
        const error = new Error('Something Went wrong');
        const result = ErrorTypeChecker_1.default.checkSequelizeValidationError(error, 'Name already Taken');
        expect(error).toEqual(result);
    });
});
//# sourceMappingURL=ErrorTypeChecker.spec.js.map