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
const Validators_1 = __importDefault(require("../../../../helpers/slack/UserInputValidator/Validators"));
const managerFormValidator_1 = __importDefault(require("../../../../helpers/slack/UserInputValidator/managerFormValidator"));
const dateHelper_1 = __importDefault(require("../../../../helpers/dateHelper"));
const SlackDialogModels_1 = require("../../SlackModels/SlackDialogModels");
const cache_1 = __importDefault(require("../../../shared/cache"));
class FormValidators {
    static validateWorkHours(workHours) {
        const errors = [];
        const validHours = workHours.includes('-') ? workHours.split('-') : false;
        if (!validHours) {
            errors.push(new SlackDialogModels_1.SlackDialogError('workHours', 'Work hours should be in the format hh:mm - hh:mm. See hint.'));
        }
        else {
            errors.push(...this.validateHours(validHours));
        }
        return errors;
    }
    static validateHours(validHours) {
        const errors = [];
        let [from, to] = validHours;
        from = dateHelper_1.default.validateTime(from.trim());
        to = dateHelper_1.default.validateTime(to.trim());
        if (!(to && from)) {
            errors.push(new SlackDialogModels_1.SlackDialogError('workHours', 'Invalid time.'));
        }
        return errors;
    }
    static validateFellowDetailsForm({ submission: { workHours }, user: { id } }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [startDate, endDate, partnerName] = yield cache_1.default.fetch(`userDetails${id}`);
            const start = dateHelper_1.default.changeDateTimeFormat(startDate);
            const end = dateHelper_1.default.changeDateTimeFormat(endDate);
            const errors = [];
            errors.push(...Validators_1.default.checkEmpty(partnerName, 'partnerName'), ...this.validateWorkHours(workHours), ...managerFormValidator_1.default.validateEngagementDate(start, end));
            return errors;
        });
    }
}
exports.default = FormValidators;
//# sourceMappingURL=JoinRouteFormValidators.js.map