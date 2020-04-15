"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const SlackDialogModels_1 = require("../../../modules/slack/SlackModels/SlackDialogModels");
const index_1 = __importDefault(require("./index"));
const Validators_1 = __importDefault(require("./Validators"));
class ManagerFormValidator {
    static validateReasons(reason, field) {
        const regex = /(\w)+/g;
        if (!reason || !regex.test(reason.trim())) {
            return [new SlackDialogModels_1.SlackDialogError(field, 'Invalid input')];
        }
        return [];
    }
    static validateDate(date, fieldName) {
        const sanitizedDate = date.trim().replace(/\s\s+/g, ' ');
        const sdDate = moment_1.default(sanitizedDate, 'MM-DD-YYYY');
        const errors = [];
        if (!sdDate.isValid()) {
            errors.push(new SlackDialogModels_1.SlackDialogError(fieldName, 'Date provided is not valid. It must be in Day/Month/Year format. See hint.'));
        }
        return errors;
    }
    static compareDate(startDate, endDate) {
        const sdDate = moment_1.default(startDate, 'MM-DD-YYYY');
        const edDate = moment_1.default(endDate, 'MM-DD-YYYY');
        const isAfter = edDate.isAfter(sdDate);
        const errors = [];
        const isValid = sdDate.isValid() && edDate.isValid();
        if (isValid && !isAfter) {
            errors.push(new SlackDialogModels_1.SlackDialogError('endDate', 'End date cannot less than start date'));
        }
        return errors;
    }
    static validateEngagementDate(startDate, endDate) {
        return ManagerFormValidator.validateDate(startDate, 'startDate')
            .concat(ManagerFormValidator.validateDate(endDate, 'endDate'))
            .concat(ManagerFormValidator.compareDate(startDate, endDate));
    }
    static validateStatus(routeRequest, statusText) {
        const { status } = routeRequest;
        return status.toLowerCase() === statusText;
    }
    static approveRequestFormValidation(payload) {
        const errors = [];
        const checkIfEmpty = Validators_1.default.validateDialogSubmission(payload);
        errors.push(...checkIfEmpty);
        if (payload.submission.routeName) {
            const err = index_1.default.validateApproveRoutesDetails(payload);
            errors.push(...err);
        }
        return errors;
    }
}
exports.default = ManagerFormValidator;
//# sourceMappingURL=managerFormValidator.js.map