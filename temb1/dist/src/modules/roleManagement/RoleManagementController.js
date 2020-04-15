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
const role_service_1 = require("./role.service");
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
class RoleManagementController {
    static newRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: { roleName: name } } = req;
                const role = yield role_service_1.roleService.createNewRole(name.trim());
                const message = 'Role has been created successfully';
                responseHelper_1.default.sendResponse(res, 201, true, message, role);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static readRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield role_service_1.roleService.getRoles();
                const message = 'All available roles';
                responseHelper_1.default.sendResponse(res, 200, true, message, roles);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static readUserRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query: { email } } = req;
                const roles = yield role_service_1.roleService.getUserRoles(email);
                const message = 'User roles';
                responseHelper_1.default.sendResponse(res, 200, true, message, roles);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static assignRoleToUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: { email, roleName, homebaseId } } = req;
                yield role_service_1.roleService.createUserRole(email, roleName, homebaseId);
                const message = 'Role was successfully assigned to the user';
                responseHelper_1.default.sendResponse(res, 201, true, message, '');
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static removeUserToRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params: { userId } } = req;
                yield role_service_1.roleService.deleteUserRole(userId);
                const message = 'User succesfully removed from this role';
                responseHelper_1.default.sendResponse(res, 201, true, message);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
}
exports.default = RoleManagementController;
//# sourceMappingURL=RoleManagementController.js.map