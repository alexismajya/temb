"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProviderController_1 = __importDefault(require("./ProviderController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const HomeBaseFilterValidator_1 = __importDefault(require("../../middlewares/HomeBaseFilterValidator"));
const { GeneralValidator, ProviderValidator, CabsValidator } = middlewares_1.default;
const providerRouter = express_1.default.Router();
providerRouter.use('/providers', HomeBaseFilterValidator_1.default.validateHomeBaseAccess);
providerRouter.get('/providers', GeneralValidator.validateQueryParams, ProviderController_1.default.getAllProviders);
providerRouter.get('/providers/viableOptions', ProviderController_1.default.getViableProviders);
providerRouter.patch('/providers/:id', ProviderValidator.verifyProviderUpdate, ProviderValidator.validateProvider, ProviderController_1.default.updateProvider);
providerRouter.delete('/providers/:id', CabsValidator.validateDeleteCabIdParam, ProviderController_1.default.deleteProvider);
providerRouter.post('/providers', ProviderValidator.validateNewProvider, ProviderValidator.validateProvider, ProviderController_1.default.addProvider);
exports.default = providerRouter;
//# sourceMappingURL=index.js.map