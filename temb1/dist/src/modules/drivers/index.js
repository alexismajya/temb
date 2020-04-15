"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DriverController_1 = __importDefault(require("./DriverController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const { ProviderValidator, DriversValidator, GeneralValidator } = middlewares_1.default;
const driverRouter = express_1.default.Router();
driverRouter.post('/drivers', ProviderValidator.validateDriverRequestBody, DriversValidator.validateUserExistenceById, ProviderValidator.validateProviderExistence, DriverController_1.default.addProviderDriver);
driverRouter.delete('/drivers/:driverId', DriversValidator.validateProviderDriverIdParams, DriversValidator.validateIsProviderDriver, DriverController_1.default.deleteDriver);
driverRouter.put('/drivers/:driverId', DriversValidator.validateProviderDriverIdParams, DriversValidator.validateIsProviderDriver, DriversValidator.validateDriverUpdateBody, DriversValidator.validateUserExistenceById, DriversValidator.validatePhoneNoAndNumberAlreadyExists, DriverController_1.default.update);
driverRouter.get('/drivers', GeneralValidator.validateQueryParams, DriverController_1.default.getDrivers);
exports.default = driverRouter;
//# sourceMappingURL=index.js.map