"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const validationSchemasExetension_1 = require("../../middlewares/validationSchemasExetension");
exports.confirmTripSchema = {
    body: joi_1.default.object().keys({
        teamId: joi_1.default.string().trim().required(),
        providerId: joi_1.default.number().integer().positive().required(),
        tripId: joi_1.default.number().integer().positive().required(),
        driverName: joi_1.default.string().min(3).max(25).required(),
        driverPhoneNo: joi_1.default.string().trim().required().regex(validationSchemasExetension_1.phoneNoRegex),
        vehicleModel: joi_1.default.string().trim().min(3).max(50).required(),
        vehicleRegNo: joi_1.default.string().trim().min(3).max(50).required(),
        vehicleColor: joi_1.default.string().trim().replace(/[^a-z0-9\s]/gi, ''),
    }),
};
//# sourceMappingURL=schemas.js.map