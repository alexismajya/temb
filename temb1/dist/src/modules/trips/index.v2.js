"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../../middlewares"));
const TripsController_1 = __importDefault(require("./TripsController"));
const HomeBaseFilterValidator_1 = __importDefault(require("../../middlewares/HomeBaseFilterValidator"));
const mainValidor_1 = __importDefault(require("../../middlewares/mainValidor"));
const schemas_1 = require("./schemas");
const { TokenValidator, GeneralValidator, } = middlewares_1.default;
const tripsV2Router = express_1.Router();
tripsV2Router.use('/trips', TokenValidator.attachJwtSecretKey.bind(TokenValidator), TokenValidator.authenticateToken.bind(TokenValidator));
tripsV2Router.get('/trips/routetrips', HomeBaseFilterValidator_1.default.validateHomeBaseAccess, GeneralValidator.validateQueryParams, TripsController_1.default.getRouteTrips);
tripsV2Router.post('/providers/confirm', mainValidor_1.default(schemas_1.confirmTripSchema), TripsController_1.default.providerConfirm);
exports.default = tripsV2Router;
//# sourceMappingURL=index.v2.js.map