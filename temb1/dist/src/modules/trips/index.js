"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../../middlewares"));
const TripsController_1 = __importDefault(require("./TripsController"));
const HomeBaseFilterValidator_1 = __importDefault(require("../../middlewares/HomeBaseFilterValidator"));
const { TripValidator, GeneralValidator, } = middlewares_1.default;
const tripsRouter = express_1.Router();
tripsRouter.get('/trips', TripValidator.validateGetTripsParam, HomeBaseFilterValidator_1.default.validateHomeBaseAccess, TripsController_1.default.getTrips);
tripsRouter.put('/trips/:tripId', TripValidator.validateAll, TripsController_1.default.updateTrip);
tripsRouter.post('/trips/travel', HomeBaseFilterValidator_1.default.validateHomeBaseAccess, TripValidator.validateTravelTrip, TripsController_1.default.getTravelTrips);
tripsRouter.get('/trips/routetrips', HomeBaseFilterValidator_1.default.validateHomeBaseAccess, GeneralValidator.validateQueryParams, TripsController_1.default.getRouteTrips);
exports.default = tripsRouter;
//# sourceMappingURL=index.js.map