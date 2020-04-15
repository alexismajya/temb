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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
const driver_service_1 = __importStar(require("../modules/drivers/driver.service"));
const ValidationSchemas_1 = require("./ValidationSchemas");
const responseHelper_1 = __importDefault(require("../helpers/responseHelper"));
const errorHandler_1 = __importDefault(require("../helpers/errorHandler"));
const user_service_1 = __importDefault(require("../modules/users/user.service"));
class DriversValidator {
    static validateProviderDriverIdParams(req, res, next) {
        const { params } = req;
        const validationErrors = DriversValidator.validateParams(params);
        if (validationErrors.length > 0) {
            const error = {
                message: validationErrors,
                statusCode: 400
            };
            return errorHandler_1.default.sendErrorResponse(error, res);
        }
        return next();
    }
    static validateParams(params) {
        const errors = [];
        Object.keys(params).map((key) => {
            if (key && !GeneralValidator_1.default.validateNumber(params[key])) {
                const message = `${key} must be a positive integer`;
                errors.push(message);
            }
            return true;
        });
        return errors;
    }
    static validateIsProviderDriver(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params: { driverId } } = req;
            try {
                const driver = yield driver_service_1.driverService.getDriverById(driverId);
                errorHandler_1.default.throwErrorIfNull(driver, `Driver with id ${driverId} does not exist`);
                res.locals = { driver };
            }
            catch (error) {
                return errorHandler_1.default.sendErrorResponse(error, res);
            }
            next();
        });
    }
    static validateDriverUpdateBody(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.updateDriverSchema);
        });
    }
    static validatePhoneNoAndNumberAlreadyExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { driverPhoneNo, driverNumber, email } = req.body;
            const { params: { driverId } } = req;
            const existing = yield driver_service_1.default.exists(email, driverPhoneNo, driverNumber, driverId);
            if (existing) {
                return responseHelper_1.default.sendResponse(res, 400, false, 'Driver with this driver number, email or phone number exists');
            }
            return next();
        });
    }
    static validateUserExistenceById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { userId, email }, headers: { teamurl } } = req;
            let userByEmail;
            if (email)
                userByEmail = yield user_service_1.default.getUserByEmail(email);
            if (!userId) {
                try {
                    const user = userByEmail || (yield user_service_1.default.createUserByEmail(teamurl, email));
                    req.body.userId = user.id;
                    return next();
                }
                catch (error) {
                    req.body.userId = null;
                    return next();
                }
            }
            const user = yield user_service_1.default.getUserById(userId);
            if (user)
                return next();
            return responseHelper_1.default.sendResponse(res, 404, false, 'User not Found');
        });
    }
}
exports.default = DriversValidator;
//# sourceMappingURL=DriversValidator.js.map