"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const joi_date_1 = __importDefault(require("@hapi/joi-date"));
const moment_1 = __importDefault(require("moment"));
const joi_extensions_1 = require("./joi.extensions");
const validationSchemasExetension_1 = require("../../../middlewares/validationSchemasExetension");
const joiWithGT = joi_1.default.extend(joi_date_1.default).extend(joi_extensions_1.greaterThan);
exports.tripPaymentSchema = joi_1.default.object().keys({
    price: joi_1.default.number().precision(2).min(0).strict()
});
exports.tripReasonSchema = joi_1.default.object().keys({
    reason: joi_1.default.string().trim().required()
});
exports.customDateError = (errors, timezone, format = 'DD/MM/YYYY HH:mm', keys = 'Date and Time') => errors.map((error) => {
    const limit = moment_1.default(error.context.limit).tz(timezone).format(format);
    switch (error.type) {
        case 'date.min':
            Object.assign(error, { message: `${keys} cannot be less than ${limit}.` });
            break;
        case 'date.max':
            Object.assign(error, { message: `${keys} cannot be greater than ${limit}.` });
            break;
        case 'date.isoDate':
            Object.assign(error, { message: `${keys} must be in the format ${format}` });
            break;
        default:
            break;
    }
    return error;
});
const getDateAndTime = (timezone) => {
    const fmt = 'YYYY-MM-DD';
    const now = () => moment_1.default().tz(timezone);
    const latest = now().add(90, 'days').format(fmt);
    const today = now().format(fmt);
    const timeLimit = now().add(30, 'minutes').format('HH:mm');
    return {
        date: joi_1.default.date().min(today).max(latest).raw()
            .error((errors) => exports.customDateError(errors, timezone, 'MMMM Do, YYYY', 'Date'), { self: true }),
        time: joiWithGT.string().regex(/^(2[0-3]|[01][0-9]):[0-5][0-9]$/).when('date', {
            is: today,
            then: joiWithGT.string().greaterThan(timeLimit),
        }).error(() => ({
            message: 'Invalid time'
        })),
    };
};
const customDestinationError = (errors) => errors.map((error) => {
    if (error.type === 'any.invalid') {
        Object.assign(error, { message: 'Destination cannot be the same as origin' });
    }
    return error;
});
exports.customOthersError = (field) => (errors) => errors.map((error) => {
    switch (error.type) {
        case 'string.base':
            Object.assign(error, { message: `Others (${field}) must be a valid address string` });
            break;
        case 'string.min':
            Object.assign(error, {
                message: `Others (${field}) must be at least ${error.context.limit} characters long`
            });
        case 'string.max':
            Object.assign(error, {
                message: `Others (${field}) must be not be more than ${error.context.limit} characters long`
            });
        default:
            break;
    }
    return error;
});
const destinationValidator = (pickUp) => joi_1.default.string().required().invalid(pickUp)
    .error(customDestinationError, { self: true });
exports.createUserDestinationSchema = (pickUp) => joi_1.default.object().keys({
    destination: destinationValidator(pickUp),
    othersDestination: joi_1.default.string().when('destination', {
        is: 'Others',
        then: destinationValidator(pickUp).min(10).max(50).error(exports.customOthersError('Destination')),
        otherwise: joi_1.default.string().valid(null)
    })
});
exports.getDateAndTimeSchema = (timezone) => joi_1.default.object().keys(Object.assign({}, getDateAndTime(timezone)));
exports.getTripPickupSchema = (timezone) => joi_1.default.object().keys(Object.assign(Object.assign({}, getDateAndTime(timezone)), { pickup: joi_1.default.string().required(), othersPickup: joi_1.default.string().when('pickup', {
        is: 'Others',
        then: joi_1.default.string().required().min(5).max(50)
            .error(exports.customOthersError('Pickup')),
        otherwise: joi_1.default.string().valid(null),
    }) }));
exports.getTravelTripSchema = (timezone) => exports.getDateAndTimeSchema(timezone)
    .append({
    pickup: joi_1.default.string().required(),
    destination: joi_1.default.string().required(),
    reason: joi_1.default.string().required(),
});
exports.contactDetailsSchema = joi_1.default.object().keys({
    rider: joi_1.default.string().required(),
    department: joi_1.default.string().required(),
    passengers: joi_1.default.number().optional(),
    riderPhoneNo: joi_1.default.string().required().regex(validationSchemasExetension_1.phoneNoRegex).error(() => ({
        message: 'Invalid rider phone number'
    })),
    travelTeamPhoneNo: joi_1.default.string()
        .required()
        .regex(validationSchemasExetension_1.phoneNoRegex)
        .error(() => ({
        message: 'Invalid travel team phone number'
    }))
});
const flightDetailsError = (errors) => errors.map((error) => {
    switch (error.type) {
        case 'any.invalid':
            Object.assign(error, { message: 'Pickup and Destination cannot be the same.' });
        default:
            break;
    }
    return error;
});
exports.getFlightDetailsSchema = (timezone) => exports.getDateAndTimeSchema(timezone)
    .append({
    flightNumber: joi_1.default.string().required(),
    pickup: joi_1.default.string().required(),
    destination: joi_1.default.string().invalid(joi_1.default.ref('pickup')).required()
        .error(flightDetailsError, { self: true }),
    reason: joi_1.default.string().required()
});
//# sourceMappingURL=schemas.js.map