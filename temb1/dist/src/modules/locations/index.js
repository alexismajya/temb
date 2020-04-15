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
const express_1 = __importDefault(require("express"));
const location_controller_1 = require("./location.controller");
const middlewares_1 = __importDefault(require("../../middlewares"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const location_service_1 = require("./location.service");
const database_1 = __importStar(require("../../database"));
const { GeneralValidator, } = middlewares_1.default;
const locationRouter = express_1.default.Router();
exports.locationService = new location_service_1.LocationService(database_1.default.getRepository(database_1.Location), bugsnagHelper_1.default);
const locationController = new location_controller_1.LocationController(exports.locationService, bugsnagHelper_1.default);
locationRouter.get('/locations/:id', GeneralValidator.validateQueryParams, locationController.getLocation.bind(locationController));
exports.default = locationRouter;
//# sourceMappingURL=index.js.map