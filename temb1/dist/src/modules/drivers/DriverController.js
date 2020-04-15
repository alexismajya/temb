"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper_1 = __importStar(require("../../helpers/responseHelper"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const driver_service_1 = require("./driver.service");
const providerHelper_1 = __importDefault(require("../../helpers/providerHelper"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const routeBatch_service_1 = require("../routeBatches/routeBatch.service");
const slackEvents_1 = require("../slack/events/slackEvents");
class DriverController {
    static addProviderDriver(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const data = yield driver_service_1.driverService.create(body);
                if (data.errors) {
                    return responseHelper_1.default.sendResponse(res, 400, false, data.errors[0].message);
                }
                const { _options: { isNewRecord }, dataValues } = data;
                if (isNewRecord) {
                    return responseHelper_1.default.sendResponse(res, 201, true, 'Driver added successfully', dataValues);
                }
                return responseHelper_1.default.sendResponse(res, 409, false, `Driver with  driver Number ${body.driverNumber} already exists`);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return responseHelper_1.default.sendResponse(res, 500, false, 'An error occurred in the creation of the driver');
            }
        });
    }
    static deleteDriver(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { locals: { driver } } = res;
            const { slackUrl } = req.body;
            const routes = yield routeBatch_service_1.routeBatchService
                .findActiveRouteWithDriverOrCabId({ driverId: driver.id });
            yield driver_service_1.driverService.deleteDriver(driver);
            if (routes[0]) {
                yield slackEvents_1.SlackEvents.raise(slackEvents_1.slackEventNames.UPDATE_ROUTE_DRIVER, driver, routes, slackUrl);
            }
            return responseHelper_1.default.sendResponse(res, 200, true, 'Driver successfully deleted');
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params: { driverId }, body } = req;
                const driver = yield driver_service_1.driverService.driverUpdate(driverId, body);
                if (driver.message) {
                    return responseHelper_1.default.sendResponse(res, 404, false, driver.message);
                }
                return responseHelper_1.default.sendResponse(res, 200, true, 'Driver updated successfully', driver);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static getDrivers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req;
                const payload = providerHelper_1.default.getProviderDetailsFromReq(query);
                const { pageable, where } = payload;
                const result = yield driver_service_1.driverService.getDrivers(pageable, where);
                const message = responseHelper_1.getPaginationMessage(result.pageMeta);
                return responseHelper_1.default.sendResponse(res, 200, true, message, result);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
}
exports.default = DriverController;
//# sourceMappingURL=DriverController.js.map