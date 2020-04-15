"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const joi_date_1 = __importDefault(require("@hapi/joi-date"));
const extendedJoi = joi_1.default.extend(joi_date_1.default);
exports.teamUrlRegex = /^(https?:\/\/)?(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*(slack\.com)$/;
exports.nameRegex = /^[A-Za-z ,.'-]+$/;
exports.numberRegex = /^\+?[0-9]+$/;
exports.timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
exports.startAndEndTime = /^\d{1,2}\s{0,2}(([:]\s{0,2}\d{1,2}\s{0,2})?)\s{0,2}(-)\s{0,2}\d{1,2}\s{0,2}(([:]\s{0,2}\d{1,2}\s{0,2})?)$/;
exports.requiredEmail = joi_1.default.string().trim().email().required();
exports.requiredCountry = joi_1.default.string().trim().required().regex(/^([a-zA-Z]+\s)*[a-zA-Z]+$/);
exports.dateRegex = /^\d{4}-\d{2}-\d{2}$/;
exports.Stringregex = /([A-Z])\w+/;
exports.headers = joi_1.default.object().keys({
    homebaseid: joi_1.default.number().min(1),
}).pattern(/^.+$/, joi_1.default.optional());
exports.phoneNoRegex = /^\+[1-9]\d{6,14}$/;
exports.readDepartmentRecords = {
    query: joi_1.default.object().keys({
        page: joi_1.default.number().min(1),
        size: joi_1.default.number().min(1),
        id: joi_1.default.number().min(1),
        providerId: joi_1.default.number().min(1),
        sort: joi_1.default.string(),
        status: joi_1.default.string().valid('Active', 'Inactive'),
        name: joi_1.default.string().replace(/[^a-z0-9\s]/gi, ''),
        country: joi_1.default.string().replace(/[^a-z0-9\s]/gi, ''),
        onRoute: joi_1.default.boolean()
    }),
    headers: exports.headers,
};
const whenConfirm = (type) => joi_1.default.number().when('action', {
    is: 'confirm',
    then: type === 'number' ? joi_1.default.number().required() : joi_1.default.string().trim().required()
});
const whenDecline = joi_1.default.string().when('action', {
    is: 'decline', then: joi_1.default.any().forbidden()
});
const whenConfirmOrDecline = whenConfirm('number').concat(whenDecline);
exports.getTripsSchema = joi_1.default.object().keys({
    page: joi_1.default.number(),
    size: joi_1.default.number(),
    status: joi_1.default.string().trim().valid('Confirmed', 'Pending', 'Approved', 'Completed', 'DeclinedByManager', 'DeclinedByOps', 'InTransit', 'Cancelled'),
    searchterm: joi_1.default.string().empty('').default('').optional()
});
exports.tripUpdateSchema = joi_1.default.object().keys({
    action: joi_1.default.string(),
    tripId: joi_1.default.number().required(),
    comment: joi_1.default.string().trim().required(),
    slackUrl: joi_1.default.string().trim().required().regex(exports.teamUrlRegex),
    providerId: whenConfirmOrDecline
});
exports.longitude = joi_1.default.number().min(-180).max(180).required();
exports.latitude = joi_1.default.number().min(-86).max(86).required();
exports.addressSchema = joi_1.default.object().keys({
    address: joi_1.default.string().trim().required().replace(/[^a-z0-9\s,]/gi, ''),
    location: joi_1.default.object().keys({ longitude: exports.longitude, latitude: exports.latitude }).required().min(2)
        .max(2),
}).required().min(2)
    .max(2);
exports.exportToDocument = {
    query: joi_1.default.object().keys({
        table: joi_1.default.string()
            .valid('routes', 'departments', 'tripItinerary', 'pendingRequests', 'routeAnalysis')
            .required(),
        sort: joi_1.default.string(),
        department: joi_1.default.string(),
        dateFilters: joi_1.default.string(),
    }),
    headers: exports.headers,
};
exports.from = extendedJoi.date().format('YYYY-MM-DD').iso().label('from')
    .required();
exports.to = extendedJoi.date().format('YYYY-MM-DD').iso().min(joi_1.default.ref('from'));
//# sourceMappingURL=validationSchemasExetension.js.map