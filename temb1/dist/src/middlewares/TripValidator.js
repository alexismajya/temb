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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
const errorHandler_1 = __importDefault(require("../helpers/errorHandler"));
const trip_service_1 = __importDefault(require("../modules/trips/trip.service"));
const ValidationSchemas_1 = __importStar(require("./ValidationSchemas"));
const JoiHelper_1 = __importDefault(require("../helpers/JoiHelper"));
const responseHelper_1 = __importDefault(require("../helpers/responseHelper"));
const TripHelper_1 = __importDefault(require("../helpers/TripHelper"));
const { getTripsSchema, tripUpdateSchema } = ValidationSchemas_1.default;
class TripValidator {
    static validateAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query: { action }, params: { tripId } } = req;
            const validateParams = JoiHelper_1.default
                .validateSubmission(Object.assign(Object.assign({}, req.body), { tripId, action }), tripUpdateSchema);
            if (validateParams.errorMessage) {
                return errorHandler_1.default.sendErrorResponse({ statusCode: 400, message: validateParams }, res);
            }
            const regex = /https?:\/\//i;
            req.body = validateParams;
            delete req.body.action;
            delete req.body.tripId;
            req.body.slackUrl = req.body.slackUrl.replace(regex, '').trim();
            const isTrip = yield trip_service_1.default.checkExistence(tripId);
            if (!isTrip) {
                return errorHandler_1.default.sendErrorResponse({ statusCode: 404, message: 'Trip Does not exist' }, res);
            }
            next();
        });
    }
    static validateGetTripsParam(req, res, next) {
        const errors = [];
        const { query: { status, page, size, searchterm } } = req;
        const validateParams = JoiHelper_1.default.validateSubmission({
            status, page, size, searchterm
        }, getTripsSchema);
        if (validateParams.errorMessage) {
            return responseHelper_1.default.sendResponse(res, 400, false, 'Validation Error', { errors: validateParams });
        }
        const departureTime = TripHelper_1.default.cleanDateQueryParam(req.query, 'departureTime');
        const requestedOn = TripHelper_1.default.cleanDateQueryParam(req.query, 'requestedOn');
        const param = { departureTime, requestedOn };
        errors.push(...TripValidator.validateDateParam(param, 'departureTime'));
        errors.push(...TripValidator.validateDateParam(param, 'requestedOn'));
        TripValidator.extracted(departureTime, errors, 'departureTime');
        TripValidator.extracted(requestedOn, errors, 'requestedOn');
        if (errors.length) {
            return responseHelper_1.default.sendResponse(res, 400, false, 'Validation Error', { errors });
        }
        return next();
    }
    static extracted(requestedOn, errors, field) {
        if (requestedOn) {
            const { after, before } = requestedOn;
            errors.push(...TripValidator.validateTime(after, before, field));
        }
    }
    static validateTime(after, before, field) {
        let message;
        const errors = [];
        message = TripValidator.validateTimeFormat(after, `${field} 'after'`);
        if (message) {
            errors.push(message);
        }
        message = TripValidator.validateTimeFormat(before, `${field} 'before'`);
        if (message) {
            errors.push(message);
        }
        if (!TripValidator.validateTimeOrder(after, before)) {
            errors.push(`${field} 'before' date cannot be less than 'after' date`);
        }
        return errors;
    }
    static validateTimeFormat(time, field) {
        const formattedTime = moment_1.default(time || '', 'YYYY-MM-DD');
        if (time && !formattedTime.isValid()) {
            return (`${field} date is not valid. It should be in the format 'YYYY-MM-DD'`);
        }
    }
    static validateTimeOrder(dateFrom, dateTo) {
        const from = moment_1.default(dateFrom, 'YYYY-MM-DD');
        const to = moment_1.default(dateTo, 'YYYY-MM-DD');
        const isAfter = to.isAfter(from);
        const isValid = from.isValid() && to.isValid();
        if (!dateFrom || !dateTo) {
            return true;
        }
        return isValid && isAfter;
    }
    static validateDateParam(data, field) {
        const dateFormat = `must be in the format ${field}=before:YYYY-MM-DD;after:YYYY-MM-DD`;
        const invalidKeys = Object.keys(data[field] || {})
            .filter((key) => key !== 'after' && key !== 'before');
        if (invalidKeys.length) {
            return [(`Invalid format, ${field} ${dateFormat}`)];
        }
        return [];
    }
    static validateTravelTrip(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.travelTripSchema);
    }
}
exports.default = TripValidator;
//# sourceMappingURL=TripValidator.js.map