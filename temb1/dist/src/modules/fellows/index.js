"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../../middlewares"));
const FellowsController_1 = __importDefault(require("./FellowsController"));
const HomeBaseFilterValidator_1 = __importDefault(require("../../middlewares/HomeBaseFilterValidator"));
const { GeneralValidator, HomebaseFilterValidator } = middlewares_1.default;
const fellowsRouter = express_1.Router();
fellowsRouter.get('/fellows/activity', GeneralValidator.validateQueryParams, HomeBaseFilterValidator_1.default.validateHomeBaseAccess, FellowsController_1.default.getFellowRouteActivity);
fellowsRouter.get('/fellows', GeneralValidator.validateQueryParams, HomebaseFilterValidator.validateHomeBaseAccess, FellowsController_1.default.getAllFellows);
exports.default = fellowsRouter;
//# sourceMappingURL=index.js.map