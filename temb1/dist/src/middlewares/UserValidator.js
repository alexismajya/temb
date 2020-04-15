"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationSchemas_1 = require("./ValidationSchemas");
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
class UserValidator {
    static validateUpdateBody(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.userUpdateSchema);
    }
    static validateNewBody(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.newUserSchema);
    }
    static validateAssignRole(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.assignRoleSchema);
    }
    static getUserRoles(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.query, ValidationSchemas_1.getRoleSchema, false, true);
    }
    static validateNewRole(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.newRoleSchema);
    }
    static validateDeleteUser(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.params, ValidationSchemas_1.deleteUserSchema);
    }
}
exports.default = UserValidator;
//# sourceMappingURL=UserValidator.js.map