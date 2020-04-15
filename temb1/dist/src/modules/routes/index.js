"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RouteController_1 = __importDefault(require("./RouteController"));
const RouteUsageController_1 = __importDefault(require("./RouteUsageController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const ValidationSchemas_1 = __importDefault(require("../../middlewares/ValidationSchemas"));
const { GeneralValidator, RouteValidator, RouteRequestValidator, mainValidator, } = middlewares_1.default;
const routesRouter = express_1.default.Router();
routesRouter.get('/routes', GeneralValidator.validateQueryParams, RouteController_1.default.getRoutes);
routesRouter.get('/routes/ratings', RouteRequestValidator.validateRatingsStartEndDateAndLocalCountry, RouteUsageController_1.default.getRouteRatings);
routesRouter.post('/routes', RouteValidator.validateNewRoute, RouteController_1.default.createRoute);
routesRouter.put('/routes/:routeId', RouteValidator.validateRouteIdParam, RouteValidator.validateRouteUpdate, RouteValidator.validateRouteBatchUpdateFields, RouteController_1.default.updateRouteBatch);
routesRouter.get('/routes/requests', RouteController_1.default.getAll);
routesRouter.put('/routes/requests/:requestId/status', RouteRequestValidator.validateRequestBody, RouteRequestValidator.validateParams, RouteController_1.default.updateRouteRequestStatus);
routesRouter.delete('/routes/:routeBatchId', RouteValidator.validateDelete, RouteValidator.validateRouteIdParam, RouteController_1.default.deleteRouteBatch);
routesRouter.get('/routes/:id', GeneralValidator.validateIdParam, RouteController_1.default.getOne);
routesRouter.delete('/routes/fellows/:userId', RouteValidator.validateDelete, RouteValidator.validateRouteIdParam, RouteController_1.default.deleteFellowFromRoute);
routesRouter.get('/routes/status/usage', mainValidator(ValidationSchemas_1.default.routeRequestUsage), RouteUsageController_1.default.getRouteUsage);
routesRouter.get('/routes/ratings', RouteUsageController_1.default.getRouteRatings);
routesRouter.get('/routes/statistics/riders', GeneralValidator.validateHomebaseId, RouteValidator.validateDateInputForRouteRiderStatistics, RouteController_1.default.getRouteStatistics);
exports.default = routesRouter;
//# sourceMappingURL=index.js.map