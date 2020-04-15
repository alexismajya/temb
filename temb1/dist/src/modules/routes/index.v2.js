"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const RouteController_1 = __importDefault(require("./RouteController"));
const { GeneralValidator, TokenValidator } = middlewares_1.default;
const routesV2Router = express_1.default.Router();
routesV2Router.use('/routes', TokenValidator.attachJwtSecretKey.bind(TokenValidator), TokenValidator.authenticateToken.bind(TokenValidator));
routesV2Router.get('/routes', GeneralValidator.validateQueryParams, RouteController_1.default.getRoutes);
exports.default = routesV2Router;
//# sourceMappingURL=index.v2.js.map