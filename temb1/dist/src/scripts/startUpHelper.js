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
const bugsnagHelper_1 = __importDefault(require("../helpers/bugsnagHelper"));
const database_1 = __importDefault(require("../database"));
const role_service_1 = require("../modules/roleManagement/role.service");
const cache_1 = __importDefault(require("../modules/shared/cache"));
const route_events_handlers_1 = __importDefault(require("../modules/events/route-events.handlers"));
const trip_events_handlers_1 = __importDefault(require("../modules/events/trip-events.handlers"));
const travel_events_handlers_1 = __importDefault(require("../modules/events/travel-events.handlers"));
const reports_events_handlers_1 = require("../modules/events/reports-events.handlers");
const feedback_event_handlers_1 = require("../modules/events/feedback.event.handlers");
const { models: { User } } = database_1.default;
class StartUpHelper {
    static ensureSuperAdminExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const email = process.env.SUPER_ADMIN_EMAIL;
            const slackId = process.env.SUPER_ADMIN_SLACK_ID;
            const userName = StartUpHelper.getUserNameFromEmail(email);
            const { APPRENTICESHIP_SUPER_ADMIN_EMAIL: email2, APPRENTICESHIP_SUPER_ADMIN_SLACK_ID: slackId2 } = process.env;
            try {
                const user1Promise = User.findOrCreate({
                    where: { email },
                    defaults: { slackId, name: userName }
                });
                const user2Promise = User.findOrCreate({
                    where: { email: email2 },
                    defaults: { slackId: slackId2, name: StartUpHelper.getUserNameFromEmail(email2) }
                });
                const [[user], [user2]] = yield Promise.all([user1Promise, user2Promise]);
                const [role] = yield role_service_1.roleService.createOrFindRole('Super Admin');
                yield Promise.all([
                    role_service_1.roleService.findOrCreateUserRole(user.id, role.id, user.homebaseId),
                    role_service_1.roleService.findOrCreateUserRole(user2.id, role.id, user2.homebaseId)
                ]);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static flushStaleCache() {
        return __awaiter(this, void 0, void 0, function* () {
            cache_1.default.flush();
        });
    }
    static getUserNameFromEmail(email) {
        let firstName;
        [firstName] = email.split('@');
        const getIndex = firstName.indexOf('.');
        if (getIndex === -1) {
            return firstName.charAt(0).toUpperCase() + firstName.slice(1);
        }
        const fullName = email.split('@')[0].split('.');
        [firstName] = fullName;
        const firstNameCapitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        const lastName = fullName[fullName.length - 1];
        const lastNameCapitalized = lastName.charAt(0).toUpperCase() + lastName.slice(1);
        return `${firstNameCapitalized} ${lastNameCapitalized}`;
    }
    static registerEventHandlers() {
        route_events_handlers_1.default.init();
        trip_events_handlers_1.default.init();
        travel_events_handlers_1.default.init();
        reports_events_handlers_1.reportEventHandler.init();
        feedback_event_handlers_1.feedbackEventHandler.init();
    }
}
exports.default = StartUpHelper;
//# sourceMappingURL=startUpHelper.js.map