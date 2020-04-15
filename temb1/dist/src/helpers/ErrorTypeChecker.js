"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
class ErrorTypeChecker {
    static checkSequelizeValidationError(error, message) {
        if (error instanceof sequelize_1.default.ValidationError) {
            return { message, statusCode: 400 };
        }
        return error;
    }
}
exports.default = ErrorTypeChecker;
//# sourceMappingURL=ErrorTypeChecker.js.map