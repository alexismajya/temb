"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RoleManagementController_1 = __importDefault(require("./RoleManagementController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const HomebaseValidator_1 = __importDefault(require("../../middlewares/HomebaseValidator"));
const roleManagementRouter = express_1.default.Router();
const { TokenValidator, UserValidator } = middlewares_1.default;
const userRoleHandler = TokenValidator.validateRole.bind(TokenValidator);
roleManagementRouter.post('/roles/user', userRoleHandler, UserValidator.validateAssignRole, HomebaseValidator_1.default.validateHomeBaseExists, RoleManagementController_1.default.assignRoleToUser);
roleManagementRouter.get('/roles/user', userRoleHandler, UserValidator.getUserRoles, RoleManagementController_1.default.readUserRole);
roleManagementRouter.post('/roles', userRoleHandler, UserValidator.validateNewRole, RoleManagementController_1.default.newRole);
roleManagementRouter.get('/roles', userRoleHandler, RoleManagementController_1.default.readRoles);
roleManagementRouter.delete('/roles/user/:userId', userRoleHandler, RoleManagementController_1.default.removeUserToRole);
exports.default = roleManagementRouter;
//# sourceMappingURL=index.js.map