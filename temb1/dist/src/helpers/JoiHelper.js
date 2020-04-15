"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("@hapi/joi"));
class JoiHelper {
    static validateSubmission(submission, schema, validationOptions = {
        abortEarly: false,
        convert: true,
    }) {
        const { error, value } = Joi.validate(submission, schema, validationOptions);
        if (error) {
            return JoiHelper.handleError(error.details);
        }
        return value;
    }
    static handleError(errorDetails) {
        const errorObject = { errorMessage: 'Validation error occurred, see error object for details' };
        errorDetails.forEach(({ message, type, context, context: { label } }) => {
            switch (type) {
                case 'any.required':
                    errorObject[`${label}`] = `Please provide ${label}`;
                    break;
                case 'any.allowOnly':
                    errorObject[`${label}`] = `only ${context.valids} are allowed`;
                    break;
                case 'number.base':
                    errorObject[`${label}`] = `${label} should be a number`;
                    break;
                case 'number.min':
                    errorObject[`${label}`] = `${label} should not be less than ${context.limit}`;
                    break;
                case 'number.max':
                    errorObject[`${label}`] = `${label} should not be greater than ${context.limit}`;
                    break;
                case 'string.email':
                    errorObject[`${label}`] = 'please provide a valid email address';
                    break;
                case 'string.regex.base':
                    errorObject[`${label}`] = `please provide a valid ${label}`;
                    break;
                default: errorObject[`${label}`] = `${message}`;
            }
        });
        return errorObject;
    }
}
exports.default = JoiHelper;
//# sourceMappingURL=JoiHelper.js.map