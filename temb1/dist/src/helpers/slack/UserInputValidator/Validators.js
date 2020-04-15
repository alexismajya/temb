"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const Joi = __importStar(require("@hapi/joi"));
const SlackDialogModels_1 = require("../../../modules/slack/SlackModels/SlackDialogModels");
const InputValidator_1 = __importDefault(require("./InputValidator"));
const dateHelper_1 = __importDefault(require("../../dateHelper"));
const regexObject = {
    checkNumbersAndLetters: {
        regex: /^[a-zA-Z\d]+$/g,
        error: 'Only numbers and letters are allowed.'
    },
    checkNumber: {
        regex: /^\+?[0-9]+$/,
        error: 'Only numbers are allowed. '
    },
    checkWord: {
        regex: /^[A-Za-z0-9- ,]+$/,
        error: 'Only alphabets, dashes and spaces are allowed.'
    },
    checkUsername: {
        regex: /[a-zA-Z]$/,
        error: 'Invalid username.'
    },
    checkPhoneNumber: {
        regex: /^\+?[0-9]{6,16}$/,
        error: 'Invalid phone number!'
    },
    checkNumberPlate: {
        regex: /[A-Z0-9\s]$/,
        error: 'Invalid cab registration number!'
    }
};
class Validators {
    static validateRegex(type, param, fieldName) {
        const { [type]: { regex, error } } = regexObject;
        let testString = param;
        if (type === 'checkNumberPlate') {
            testString = param ? param.toUpperCase() : '';
        }
        if (!testString || !regex.test(testString)) {
            return [new SlackDialogModels_1.SlackDialogError(fieldName, error)];
        }
        return [];
    }
    static checkMinLengthNumber(minLength, number, name) {
        const numLength = number.trim().length;
        if (numLength < minLength) {
            return [new SlackDialogModels_1.SlackDialogError(name, `Minimum length is ${minLength} digits`)];
        }
        return [];
    }
    static checkDateTimeIsHoursAfterNow(noOfHours, date, fieldName) {
        const userDateInput = moment_1.default(date, 'DD/MM/YYYY HH:mm');
        const afterTime = moment_1.default().add(noOfHours, 'hours');
        if (userDateInput.isAfter(afterTime)) {
            return [];
        }
        return [new SlackDialogModels_1.SlackDialogError(fieldName, `${fieldName} must be at least ${noOfHours} hours from current time.`)];
    }
    static validateEmptyAndSpaces(param, name) {
        if (InputValidator_1.default.isEmptySpace(param)) {
            return [new SlackDialogModels_1.SlackDialogError(name, 'Spaces are not allowed')];
        }
        return [];
    }
    static checkEmpty(param, fieldName) {
        if (typeof param === 'string' && param.trim().length < 1) {
            return [new SlackDialogModels_1.SlackDialogError(fieldName, 'This field cannot be empty')];
        }
        return [];
    }
    static checkOriginAnDestination(pickup, destination, pickupName, destinationName) {
        if (pickup.toLowerCase() === destination.toLowerCase() && pickup !== 'Others') {
            return [
                new SlackDialogModels_1.SlackDialogError(pickupName, 'Pickup location and Destination cannot be the same.'),
                new SlackDialogModels_1.SlackDialogError(destinationName, 'Pickup location and Destination cannot be the same.')
            ];
        }
        return [];
    }
    static checkDate(date, tzOffset, fieldName = 'date_time') {
        if (Validators.checkDateTimeFormat(date)) {
            const diff = dateHelper_1.default.dateChecker(date, tzOffset);
            if (diff < 0) {
                return [new SlackDialogModels_1.SlackDialogError(fieldName, 'Date cannot be in the past.')];
            }
        }
        return [];
    }
    static checkDateFormat(date, fieldName) {
        if (!dateHelper_1.default.validateDate(date)) {
            return [new SlackDialogModels_1.SlackDialogError(fieldName, 'Time format must be in Day/Month/Year format. See hint.')];
        }
        return [];
    }
    static checkDateTimeFormat(date, fieldName = 'date_time') {
        if (!dateHelper_1.default.validateDateTime(date)) {
            return [new SlackDialogModels_1.SlackDialogError(fieldName, 'Time format must be in Day/Month/Year format. See hint.')];
        }
        return [];
    }
    static checkLocationsWithoutOthersField(pickupLocation, destination) {
        const message = 'Pickup and Destination cannot be the same.';
        if (pickupLocation.toLowerCase() === destination.toLowerCase()) {
            return [new SlackDialogModels_1.SlackDialogError('pickup', message),
                new SlackDialogModels_1.SlackDialogError('destination', message)];
        }
        return [];
    }
    static isDateFormatValid(date) {
        const validDate = date.includes('-') ? date.split('-') : '';
        if (validDate.length) {
            const [from, to] = validDate;
            const momentFromTime = moment_1.default(from, 'HH:mm');
            const momentToTime = moment_1.default(to, 'HH:mm');
            return momentFromTime.isValid() && momentToTime.isValid();
        }
    }
    static checkTimeFormat(time, field) {
        const errors = [];
        if (!dateHelper_1.default.validateTime(time)) {
            errors.push(new SlackDialogModels_1.SlackDialogError(field, 'Invalid time'));
        }
        return errors;
    }
    static validateDialogSubmission(payload) {
        const { submission } = payload;
        const inputs = Object.keys(submission).map((key) => {
            const invalidInputs = Validators.checkEmpty(submission[key], key);
            if (invalidInputs.length) {
                const [error] = invalidInputs;
                return error;
            }
            return false;
        }).filter((items) => items !== false);
        return inputs;
    }
    static validateSubmission(submission, schema) {
        const result = Joi.validate(submission, schema, {
            abortEarly: false,
            convert: true,
        });
        if (result.error) {
            const error = new Error('validation failed');
            error.errors = result.error;
            throw error;
        }
        return result.value;
    }
    static checkDuplicatePhoneNo(riderPhoneNo, travelTeamPhoneNo) {
        const message = 'Passenger and travel team phone number cannot be the same.';
        if (riderPhoneNo === travelTeamPhoneNo) {
            return [new SlackDialogModels_1.SlackDialogError('riderPhoneNo', message),
                new SlackDialogModels_1.SlackDialogError('travelTeamPhoneNo', message)];
        }
        return [];
    }
}
exports.default = Validators;
//# sourceMappingURL=Validators.js.map