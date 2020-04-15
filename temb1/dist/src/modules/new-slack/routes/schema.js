"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const validationSchemasExetension_1 = require("../../../middlewares/validationSchemasExetension");
exports.joinRouteSchema = joi_1.default.object().keys({
    manager: joi_1.default.required(),
    workHours: joi_1.default.string().required().regex(validationSchemasExetension_1.startAndEndTime).error(() => ({
        message: 'Invalid time',
    })),
});
//# sourceMappingURL=schema.js.map