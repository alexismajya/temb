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
const responseHelper_1 = __importDefault(require("../helpers/responseHelper"));
const errorHandler_1 = __importDefault(require("../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../helpers/bugsnagHelper"));
const constants_1 = require("../helpers/constants");
const teamDetails_service_1 = require("../modules/teamDetails/teamDetails.service");
const JoiHelper_1 = __importDefault(require("../helpers/JoiHelper"));
const ValidationSchemas_1 = __importDefault(require("./ValidationSchemas"));
const { readDepartmentRecords } = ValidationSchemas_1.default;
const { MISSING_TEAM_URL, INVALID_TEAM_URL } = constants_1.messages;
class GeneralValidator {
    static validateQueryParams(req, res, next) {
        const validQuery = JoiHelper_1.default.validateSubmission(req.query, readDepartmentRecords.query);
        if (validQuery.errorMessage) {
            return responseHelper_1.default.sendResponse(res, 400, false, validQuery);
        }
        req.query = validQuery;
        next();
    }
    static validateNumber(num) {
        const numRegex = /^[1-9][0-9]*$/;
        return numRegex.test(num);
    }
    static disallowNumericsAsValuesOnly(value) {
        const result = GeneralValidator.validateNumber(value);
        if (result) {
            return false;
        }
        return true;
    }
    static validatePhoneNo(num) {
        const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
        return regex.test(num);
    }
    static validateIdParam(req, res, next) {
        const { params: { id } } = req;
        if (!GeneralValidator.validateNumber(id)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a positive integer value'
            });
        }
        return next();
    }
    static validateHomebaseId(req, res, next) {
        const { headers: { homebaseid } } = req;
        if (!homebaseid || !GeneralValidator.validateNumber(homebaseid)) {
            return res.status(400).json({
                success: false,
                message: 'homebaseid is required in the header and must be a postive interger value'
            });
        }
        return next();
    }
    static validateProp(prop, propName) {
        if (!prop || prop.trim().length < 1) {
            return [`Please Provide a ${propName}`];
        }
        return [];
    }
    static validateObjectKeyValues(body) {
        return Object.entries(body)
            .reduce((errors, data) => {
            const [key, value] = data;
            if (!value || `${value}`.trim().length < 1) {
                errors.push(`${key} cannot be empty`);
            }
            return errors;
        }, []);
    }
    static validateAllProvidedReqBody(req, res, next) {
        const errors = GeneralValidator.validateObjectKeyValues(req.body);
        return errors.length < 1
            ? next()
            : responseHelper_1.default.sendResponse(res, 400, false, errors);
    }
    static validateTeamUrl(teamUrl) {
        const teamUrlRegex = /^(https?:\/\/)?(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*(slack\.com)$/;
        return teamUrlRegex.test(teamUrl);
    }
    static validateTeamUrlInRequestBody(req, res, next) {
        const { body: { teamUrl } } = req;
        if (teamUrl && GeneralValidator.validateTeamUrl(teamUrl.trim())) {
            return next();
        }
        const message = 'Please pass the teamUrl in the request body, e.g: "teamUrl: dvs.slack.com"';
        return responseHelper_1.default.sendResponse(res, 400, false, message);
    }
    static isTripStatus(status) {
        return ['Confirmed', 'Pending'].includes(status);
    }
    static isEmpty(value) {
        return (typeof value === 'undefined' || value.trim === '' || value.length === 0);
    }
    static validateTripFilterParameters(req, res, next) {
        const { status } = req.query;
        const message = 'Status of trips are either Confirmed or Pending';
        if (!GeneralValidator.isEmpty(status)
            && !GeneralValidator.isTripStatus(status)) {
            return responseHelper_1.default.sendResponse(res, 400, false, message);
        }
        return next();
    }
    static validateSlackUrl(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamUrl = req.header('teamUrl');
                errorHandler_1.default.throwErrorIfNull(teamUrl, MISSING_TEAM_URL, 400);
                const teamDetails = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
                errorHandler_1.default.throwErrorIfNull(teamDetails, INVALID_TEAM_URL, 400);
                res.locals = { botToken: teamDetails.botToken };
                return next();
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static joiValidation(req, res, next, data, schema, id = false, query = false) {
        const validate = JoiHelper_1.default.validateSubmission(data, schema);
        if (validate.errorMessage) {
            const { errorMessage } = validate, rest = __rest(validate, ["errorMessage"]);
            return errorHandler_1.default.sendErrorResponse({
                statusCode: 400,
                message: errorMessage,
                error: Object.assign({}, rest)
            }, res);
        }
        if (id) {
            delete validate.id;
            req.body = validate;
            return next();
        }
        if (query) {
            req.query = validate;
            return next();
        }
        req.body = validate;
        return next();
    }
}
exports.default = GeneralValidator;
//# sourceMappingURL=GeneralValidator.js.map