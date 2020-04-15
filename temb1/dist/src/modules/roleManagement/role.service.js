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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importStar(require("../../database"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const base_service_1 = require("../shared/base.service");
const user_service_1 = __importDefault(require("../users/user.service"));
const Notifications_1 = __importDefault(require("../slack/SlackPrompts/Notifications"));
const dotenv_extended_1 = __importDefault(require("dotenv-extended"));
dotenv_extended_1.default.load();
const botToken = process.env.SLACK_BOT_OAUTH_TOKEN;
class RoleService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(database_1.Role)) {
        super(model);
    }
    createNewRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const [role, created] = yield this.createOrFindRole(name);
            if (created) {
                return role;
            }
            errorHandler_1.default.throwErrorIfNull(false, 'Role already exists', 409);
        });
    }
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield this.findAll({});
            errorHandler_1.default.throwErrorIfNull(roles, 'No Existing Roles');
            return roles;
        });
    }
    getUserRoles(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.User.findOne({ where: { email } });
            const roles = yield this.findUserRoles(user.id);
            errorHandler_1.default.throwErrorIfNull(roles[0], 'User has no role');
            return roles;
        });
    }
    getRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.findOneByProp({ prop: 'name', value: name });
            errorHandler_1.default.throwErrorIfNull(role, 'Role not found');
            return role;
        });
    }
    createUserRole(email, roleName, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user, role] = yield Promise.all([
                user_service_1.default.getUser(email),
                this.getRole(roleName),
            ]);
            try {
                yield database_1.UserRole.create({ homebaseId, userId: user.id, roleId: role.id });
                const text = `Dear ${user.name}, you have been assigned the ${roleName} role on Tembea`;
                yield this.notifyUser(user, text);
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
                errorHandler_1.default.throwErrorIfNull('', 'This Role is already assigned to this user', 409);
            }
            return true;
        });
    }
    createOrFindRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.model.findOrCreate({ where: { name } });
            return role;
        });
    }
    findUserRoles(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.UserRole.findAll({
                where: { userId },
                include: [{ model: database_1.Homebase }, { model: database_1.Role }],
            });
            return result;
        });
    }
    findOrCreateUserRole(userId, roleId, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.UserRole.findOrCreate({ where: { userId, roleId, homebaseId } });
            return result;
        });
    }
    deleteUserRole(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.UserRole.destroy({ where: { userId } });
            const user = yield user_service_1.default.getUserById(userId);
            const text = `Dear ${user.name}, your role on Tembea has been revoked`;
            yield this.notifyUser(user, text);
            return result;
        });
    }
    notifyUser(user, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slackId } = user;
                const directMessageId = yield Notifications_1.default.getDMChannelId(slackId, botToken);
                const message = Notifications_1.default.createDirectMessage(directMessageId, text);
                yield Notifications_1.default.sendNotification(message, botToken);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
}
exports.default = RoleService;
exports.roleService = new RoleService();
//# sourceMappingURL=role.service.js.map