"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("../helpers/errorHandler"));
const JoiHelper_1 = __importDefault(require("../helpers/JoiHelper"));
const supportedMethods = ['get', 'post', 'patch', 'delete', 'put'];
const isEmpty = (value = null) => {
    let empty = true;
    if ((value && value !== '') && (typeof value === 'string' || typeof value === 'object')) {
        empty = false;
    }
    return empty;
};
const validationOptions = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
    convert: true,
};
exports.validateProperties = (req, schema, reqProperty = 'body') => {
    const validatedData = JoiHelper_1.default.validateSubmission(req[reqProperty], schema[reqProperty], validationOptions);
    const { errorMessage } = validatedData, errors = __rest(validatedData, ["errorMessage"]);
    if (errorMessage) {
        Object.getOwnPropertyNames(errors).map((error) => {
            errors[error] = errors[error].replace(/['"]/g, '');
            return error;
        });
        return {
            errorMessage,
            errors: Object.assign({}, errors),
            success: false,
        };
    }
    return { success: true };
};
exports.default = (schema = {}) => (req, res, next) => {
    const method = req.method.toLowerCase();
    if (supportedMethods.includes(method)
        && !isEmpty(schema)) {
        try {
            Object.getOwnPropertyNames(schema).forEach((property) => {
                const { errorMessage, errors, success } = exports.validateProperties(req, schema, property);
                if (!success) {
                    const errorInstance = new Error(errorMessage);
                    errorInstance.errors = errors;
                    throw errorInstance;
                }
            });
            return next();
        }
        catch (errorInstance) {
            return errorHandler_1.default.sendErrorResponse({
                error: Object.assign({}, errorInstance.errors),
                statusCode: 400,
                message: errorInstance.message,
            }, res);
        }
    }
    return errorHandler_1.default.sendErrorResponse({
        statusCode: 405,
        message: 'Http method Not Allowed'
    }, res);
};
//# sourceMappingURL=mainValidor.js.map