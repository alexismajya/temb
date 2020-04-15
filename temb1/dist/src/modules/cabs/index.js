"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../../middlewares"));
const CabsController_1 = __importDefault(require("./CabsController"));
const { CabsValidator, GeneralValidator, ProviderValidator, } = middlewares_1.default;
const cabsRouter = express_1.Router();
cabsRouter.post('/cabs', CabsValidator.validateAllInputs, ProviderValidator.validateProviderExistence, CabsController_1.default.createCab);
cabsRouter.get('/cabs', GeneralValidator.validateQueryParams, CabsController_1.default.getAllCabs);
cabsRouter.put('/cabs/:id', GeneralValidator.validateIdParam, CabsValidator.validateCabUpdateBody, CabsController_1.default.updateCabDetails);
cabsRouter.delete('/cabs/:id', CabsValidator.validateDeleteCabIdParam, CabsController_1.default.deleteCab);
exports.default = cabsRouter;
//# sourceMappingURL=index.js.map