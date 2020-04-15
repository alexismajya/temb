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
const utils_1 = __importDefault(require("../../utils"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const role_service_1 = require("../roleManagement/role.service");
const user_service_1 = __importDefault(require("../users/user.service"));
const RolesHelper_1 = __importDefault(require("../../helpers/RolesHelper"));
class AuthenticationController {
    static verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { currentUser: { UserInfo } } = req;
                const user = yield user_service_1.default.getUserByEmail(UserInfo.email, true);
                const roleNames = utils_1.default.mapThroughArrayOfObjectsByKey(user.roles, 'name');
                const roles = yield role_service_1.roleService.findUserRoles(user.id);
                const LocationsAndRoles = RolesHelper_1.default.mapLocationsAndRoles(roles);
                const userInfo = Object.assign(Object.assign(Object.assign({}, UserInfo), { roles: roleNames }), LocationsAndRoles);
                const token = yield utils_1.default.generateToken('180m', { userInfo });
                return responseHelper_1.default.sendResponse(res, 200, true, 'Authentication Successful', {
                    isAuthorized: true,
                    userInfo,
                    token,
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                if (error instanceof errorHandler_1.default) {
                    return responseHelper_1.default.sendResponse(res, 401, false, 'User is not Authorized', {
                        isAuthorized: false
                    });
                }
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
}
exports.default = AuthenticationController;
//# sourceMappingURL=AuthenticationController.js.map