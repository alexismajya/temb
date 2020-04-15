"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const validationSchemasExetension_1 = require("./validationSchemasExetension");
exports.userUpdateSchema = joi_1.default.object().keys({
    slackUrl: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.teamUrlRegex),
    email: joi_1.default.string().trim().email().required(),
    newEmail: joi_1.default.string().trim().email(),
    newName: joi_1.default.string().trim().regex(validationSchemasExetension_1.nameRegex),
    newPhoneNo: joi_1.default.string().trim().regex(validationSchemasExetension_1.phoneNoRegex)
}).or('newEmail', 'newName', 'newPhoneNo');
exports.deleteUserSchema = joi_1.default.object().keys({
    email: validationSchemasExetension_1.requiredEmail
});
exports.newUserSchema = joi_1.default.object().keys({
    slackUrl: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.teamUrlRegex),
    email: validationSchemasExetension_1.requiredEmail
});
const ViableProviderSchema = joi_1.default.object().keys({
    id: joi_1.default.number().required(),
    name: joi_1.default.string().trim().required(),
    providerUserId: joi_1.default.number().required(),
    isDirectMessage: joi_1.default.boolean().required(),
    channelId: joi_1.default.string().allow(null).optional(),
    vehicles: joi_1.default.array(),
    drivers: joi_1.default.array(),
    homebaseId: joi_1.default.number(),
    user: joi_1.default.object().keys({
        name: joi_1.default.string().trim(),
        phoneNo: joi_1.default.string().trim().allow(null).optional()
            .regex(validationSchemasExetension_1.phoneNoRegex),
        email: joi_1.default.string().trim().email(),
        slackId: joi_1.default.string().trim()
    })
});
exports.newRouteSchema = joi_1.default.object().keys({
    routeName: joi_1.default.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
    destination: joi_1.default.object().keys({
        address: joi_1.default.string().trim().required().replace(/[^a-z0-9\s,]/gi, ''),
        coordinates: joi_1.default.object().keys({
            lng: validationSchemasExetension_1.longitude,
            lat: validationSchemasExetension_1.latitude
        }).required(),
    }).required(),
    teamUrl: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.teamUrlRegex),
    destinationInputField: joi_1.default.string().trim(),
    provider: ViableProviderSchema.required(),
    takeOffTime: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.timeRegex),
    capacity: joi_1.default.number().required().min(1)
});
exports.updateRouteSchema = joi_1.default.object().keys({
    teamUrl: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.teamUrlRegex),
    status: joi_1.default.string().trim().valid('Inactive', 'Active'),
    batch: joi_1.default.string().trim(),
    capacity: joi_1.default.number().min(1),
    takeOff: joi_1.default.string().trim().regex(validationSchemasExetension_1.timeRegex),
    providerId: joi_1.default.number().min(1),
    regNumber: joi_1.default.string().trim().replace(/[^a-z0-9\s]/gi, ''),
    name: joi_1.default.string().trim().replace(/[^a-z0-9\s]/gi, '')
});
exports.declineRouteRequestSchema = joi_1.default.object().keys({
    newOpsStatus: joi_1.default.string().trim().valid('approve', 'decline').required(),
    comment: joi_1.default.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
    teamUrl: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.teamUrlRegex),
});
exports.approveRouteRequestSchema = joi_1.default.object().keys({
    teamUrl: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.teamUrlRegex),
    newOpsStatus: joi_1.default.string().trim().valid('approve', 'decline').required(),
    comment: joi_1.default.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
    routeName: joi_1.default.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
    takeOff: joi_1.default.string().trim().regex(validationSchemasExetension_1.timeRegex).required(),
    provider: ViableProviderSchema.required()
});
exports.deleteRouteSchema = joi_1.default.object().keys({
    teamUrl: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.teamUrlRegex)
});
exports.assignRoleSchema = joi_1.default.object().keys({
    email: validationSchemasExetension_1.requiredEmail,
    roleName: joi_1.default.string().trim().required(),
    homebaseId: joi_1.default.number().required()
});
exports.getRoleSchema = joi_1.default.object().keys({ email: validationSchemasExetension_1.requiredEmail });
exports.newRoleSchema = joi_1.default.object().keys({
    roleName: joi_1.default.string().trim().required().replace(/[^a-z0-9\s]/gi, '')
});
exports.updateProviderSchema = joi_1.default.object().keys({
    id: joi_1.default.number().required(),
    name: joi_1.default.string().trim(),
    email: joi_1.default.string().trim().email()
}).or('name', 'email');
exports.newProviderSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().email().required(),
    name: joi_1.default.string().trim().required(),
    notificationChannel: joi_1.default.string().required(),
    channelId: joi_1.default.string().allow(null, '').optional(),
    phoneNo: joi_1.default.string().required().regex(validationSchemasExetension_1.phoneNoRegex),
});
exports.newHomeBaseSchema = joi_1.default.object().keys({
    homebaseName: joi_1.default.string().trim().required(),
    countryId: joi_1.default.number().required(),
    channel: joi_1.default.string().trim().required(),
    address: validationSchemasExetension_1.addressSchema,
    currency: joi_1.default.string().trim().required(),
    opsEmail: joi_1.default.string().trim().email().required(),
    travelEmail: joi_1.default.string().trim().email().required(),
}).min(7).max(7);
exports.updateHomeBaseSchema = joi_1.default.object().keys({
    countryId: joi_1.default.number().optional(),
    homebaseName: joi_1.default.string().trim().optional(),
    channel: joi_1.default.string().trim().optional(),
    currency: joi_1.default.string().trim().optional(),
    opsEmail: joi_1.default.string().trim().email().optional(),
    travelEmail: joi_1.default.string().trim().email().optional()
}).min(1);
exports.newDriverSchema = joi_1.default.object().keys({
    driverPhoneNo: joi_1.default.string().required().regex(validationSchemasExetension_1.phoneNoRegex),
    driverName: joi_1.default.string().trim().required(),
    driverNumber: joi_1.default.string().trim().required().min(3),
    providerId: joi_1.default.number().required(),
    email: joi_1.default.string().trim().email(),
    userId: joi_1.default.number()
});
exports.updateDriverSchema = joi_1.default.object().keys({
    driverPhoneNo: joi_1.default.string().regex(validationSchemasExetension_1.phoneNoRegex),
    driverName: joi_1.default.string().trim(),
    driverNumber: joi_1.default.string().trim().min(3),
    email: joi_1.default.string().trim().email(),
    userId: joi_1.default.number().optional()
}).min(1);
exports.addDepartment = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().trim().required().replace(/[^a-z\s-]/gi, ''),
        email: validationSchemasExetension_1.requiredEmail,
        slackUrl: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.teamUrlRegex),
        homebaseId: joi_1.default.number().required()
    })
};
exports.updateDepartment = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().trim().replace(/[^a-z\s-]/gi, '').required(),
        headEmail: joi_1.default.string().trim().email().required(),
    }).min(1).max(2),
    params: joi_1.default.object().keys({ id: joi_1.default.number() }),
};
exports.deleteDepartmentOrCountry = {
    body: joi_1.default.object().keys({
        id: joi_1.default.number().min(1),
        name: joi_1.default.string().trim().replace(/[^a-z0-9\s-]/gi, '')
    }).min(1).max(2)
};
exports.countrySchema = joi_1.default.object().keys({ name: validationSchemasExetension_1.requiredCountry });
exports.updateCountrySchema = joi_1.default.object().keys({
    name: validationSchemasExetension_1.requiredCountry,
    newName: validationSchemasExetension_1.requiredCountry
});
exports.newCabSchema = joi_1.default.object().keys({
    regNumber: joi_1.default.string().trim().replace(/[^a-z0-9\s]/gi, '').required(),
    providerId: joi_1.default.number().required().min(1),
    capacity: joi_1.default.number().min(1).required(),
    model: joi_1.default.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
    color: joi_1.default.string().trim().replace(/[^a-z\s-]/gi, '')
});
exports.updateCabSchema = joi_1.default.object().keys({
    id: joi_1.default.number().min(1).required(),
    regNumber: joi_1.default.string().trim().replace(/[^a-z0-9\s]/gi, '').required(),
    capacity: joi_1.default.number().min(1),
    model: joi_1.default.string().trim().replace(/[^a-z0-9\s]/gi, '')
}).min(1);
exports.newAddressSchema = joi_1.default.object().keys({
    longitude: joi_1.default.number().min(-180).max(180).required(),
    latitude: joi_1.default.number().min(-86).max(86).required(),
    address: joi_1.default.string().trim().required().replace(/[^a-z0-9\s,]/gi, '')
});
exports.updateAddressSchema = joi_1.default.object().keys({
    newLongitude: joi_1.default.number().min(-180).max(180),
    newLatitude: joi_1.default.number().min(-86).max(86),
    address: joi_1.default.string().trim().required().replace(/[^a-z0-9\s,]/gi, ''),
    newAddress: joi_1.default.string().trim().replace(/[^a-z0-9\s,]/gi, '')
}).or('newLongitude', 'newLatitude', 'newAddress');
exports.fetchDepartmentTrips = {
    body: joi_1.default.object().keys({
        startDate: joi_1.default.string().required().regex(validationSchemasExetension_1.dateRegex)
            .error(() => 'StartDate must be in the format YYYY-MM-DD and is required'),
        endDate: joi_1.default.string().required().regex(validationSchemasExetension_1.dateRegex)
            .error(() => 'endDate must be in the format YYYY-MM-DD and is required'),
        departments: joi_1.default.array().required()
    }),
    query: joi_1.default.object().keys({
        tripType: joi_1.default.string().valid('Embassy Visit', 'Airport Transfer', 'Regular Trip')
            .regex(validationSchemasExetension_1.Stringregex).required()
            .error(() => 'tripType must be either Embassy Visit, Airport Transfer or Regular Trip'),
    }),
    headers: joi_1.default.object().keys({
        homebaseid: joi_1.default.number().min(1).required(),
    }).pattern(/^.+$/, joi_1.default.optional())
};
exports.travelTripSchema = joi_1.default.object().keys({
    startDate: joi_1.default.date().iso().label('start Date').required(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate'))
        .label('end Date')
        .required(),
    departmentList: joi_1.default.array().items(joi_1.default.string().trim().label('Departments')).min(1).allow(null)
        .optional()
});
exports.dateRangeSchema = joi_1.default.object().keys({ from: validationSchemasExetension_1.from, to: validationSchemasExetension_1.to }).and('from', 'to').required();
const routeRequestUsage = { query: exports.dateRangeSchema };
exports.default = {
    phoneNoRegex: validationSchemasExetension_1.phoneNoRegex,
    readDepartmentRecords: validationSchemasExetension_1.readDepartmentRecords,
    getTripsSchema: validationSchemasExetension_1.getTripsSchema,
    tripUpdateSchema: validationSchemasExetension_1.tripUpdateSchema,
    userUpdateSchema: exports.userUpdateSchema,
    newUserSchema: exports.newUserSchema,
    newRouteSchema: exports.newRouteSchema,
    updateRouteSchema: exports.updateRouteSchema,
    declineRouteRequestSchema: exports.declineRouteRequestSchema,
    approveRouteRequestSchema: exports.approveRouteRequestSchema,
    deleteRouteSchema: exports.deleteRouteSchema,
    assignRoleSchema: exports.assignRoleSchema,
    getRoleSchema: exports.getRoleSchema,
    newRoleSchema: exports.newRoleSchema,
    updateProviderSchema: exports.updateProviderSchema,
    newProviderSchema: exports.newProviderSchema,
    newHomeBaseSchema: exports.newHomeBaseSchema,
    updateHomeBaseSchema: exports.updateHomeBaseSchema,
    newDriverSchema: exports.newDriverSchema,
    updateDriverSchema: exports.updateDriverSchema,
    updateDepartment: exports.updateDepartment,
    addDepartment: exports.addDepartment,
    deleteDepartmentOrCountry: exports.deleteDepartmentOrCountry,
    countrySchema: exports.countrySchema,
    updateCountrySchema: exports.updateCountrySchema,
    newCabSchema: exports.newCabSchema,
    updateCabSchema: exports.updateCabSchema,
    newAddressSchema: exports.newAddressSchema,
    updateAddressSchema: exports.updateAddressSchema,
    fetchDepartmentTrips: exports.fetchDepartmentTrips,
    travelTripSchema: exports.travelTripSchema,
    dateRangeSchema: exports.dateRangeSchema,
    routeRequestUsage,
    exportToDocument: validationSchemasExetension_1.exportToDocument,
};
//# sourceMappingURL=ValidationSchemas.js.map