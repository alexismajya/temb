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
const cab_service_1 = require("./cab.service");
const responseHelper_1 = __importStar(require("../../helpers/responseHelper"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const providerHelper_1 = __importDefault(require("../../helpers/providerHelper"));
const slackEvents_1 = require("../slack/events/slackEvents");
const routeBatch_service_1 = require("../routeBatches/routeBatch.service");
class CabsController {
    static createCab(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: { regNumber, capacity, model, providerId, color, } } = req;
                const { cab, isNewRecord } = yield cab_service_1.cabService.findOrCreateCab(regNumber, capacity, model, providerId, color);
                if (isNewRecord) {
                    return res.status(201).json({
                        success: true,
                        message: 'You have successfully created a cab',
                        cab,
                    });
                }
                const recordConflictError = {
                    message: 'Cab with this registration number already exists',
                    statusCode: 409
                };
                errorHandler_1.default.sendErrorResponse(recordConflictError, res);
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
                errorHandler_1.default.sendErrorResponse({ message: 'Oops! Something went terribly wrong' }, res);
            }
        });
    }
    static getAllCabs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pageable, where } = providerHelper_1.default.getProviderDetailsFromReq(req.query);
                const payload = yield cab_service_1.cabService.getCabs(pageable, where);
                const message = responseHelper_1.getPaginationMessage(payload.pageMeta);
                return responseHelper_1.default.sendResponse(res, 200, true, message, payload);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static updateCabDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params: { id }, body } = req;
            const { regNumber } = body;
            try {
                const findCab = yield cab_service_1.cabService.findByRegNumber(regNumber);
                if (findCab !== null && findCab.id !== parseInt(id, 10)) {
                    return res.status(409).send({
                        success: false, message: 'Cab with registration number already exists'
                    });
                }
                const cab = yield cab_service_1.cabService.updateCab(id, body);
                if (cab.message) {
                    return res.status(404).send({ success: false, message: cab.message });
                }
                res.status(200).send({
                    success: true, message: 'Cab details updated successfully', data: cab
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static deleteCab(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params: { id }, body: { slackUrl } } = req;
                const cab = yield cab_service_1.cabService.findById(id);
                const routeBatchData = yield routeBatch_service_1.routeBatchService
                    .findActiveRouteWithDriverOrCabId({ cabId: id });
                const dbResponse = yield cab_service_1.cabService.deleteCab(id);
                if (routeBatchData && routeBatchData.length) {
                    slackEvents_1.SlackEvents.raise(slackEvents_1.slackEventNames
                        .SEND_PROVIDER_VEHICLE_REMOVAL_NOTIFICATION, cab, routeBatchData, slackUrl);
                }
                if (dbResponse > 0) {
                    const message = 'Cab successfully deleted';
                    return responseHelper_1.default.sendResponse(res, 200, true, message);
                }
                const doesNotExist = { message: 'Cab does not exist', statusCode: 404 };
                errorHandler_1.default.sendErrorResponse(doesNotExist, res);
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
                const serverError = {
                    message: 'Server Error. Could not complete the request',
                    statusCode: 500
                };
                errorHandler_1.default.sendErrorResponse(serverError, res);
            }
        });
    }
}
exports.default = CabsController;
//# sourceMappingURL=CabsController.js.map