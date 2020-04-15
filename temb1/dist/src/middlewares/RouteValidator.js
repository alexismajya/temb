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
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper_1 = __importDefault(require("../helpers/responseHelper"));
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
const RouteHelper_1 = __importDefault(require("../helpers/RouteHelper"));
const JoiHelper_1 = __importDefault(require("../helpers/JoiHelper"));
const ValidationSchemas_1 = require("./ValidationSchemas");
class RouteValidator {
    static validateNewRoute(req, res, next) {
        if (req.query) {
            const { action, batchId } = req.query;
            if (action === 'duplicate' && parseInt(batchId, 10))
                return next();
        }
        const validateRoute = JoiHelper_1.default.validateSubmission(req.body, ValidationSchemas_1.newRouteSchema);
        if (validateRoute.errorMessage) {
            return responseHelper_1.default.sendResponse(res, 400, false, validateRoute);
        }
        req.body = validateRoute;
        next();
    }
    static validateIdParam(res, id, name, next) {
        if (!id || !GeneralValidator_1.default.validateNumber(id)) {
            const message = `Please provide a positive integer value for ${name}`;
            return responseHelper_1.default.sendResponse(res, 400, false, message);
        }
        return next();
    }
    static validateRouteIdParam(req, res, next) {
        const { params: { routeBatchId, routeId, userId }, route: { path } } = req;
        if (path === '/routes/:routeBatchId')
            RouteValidator.validateIdParam(res, routeBatchId, 'routeBatchId', next);
        if (path === '/routes/:routeId')
            RouteValidator.validateIdParam(res, routeId, 'routeId', next);
        if (path === '/routes/fellows/:userId') {
            RouteValidator.validateIdParam(res, userId, 'userId', next);
        }
    }
    static validateDelete(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.deleteRouteSchema);
    }
    static validateDestinationAddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.action) {
                const { address } = req.body.destination;
                const message = 'Address already exists';
                const addressExists = yield RouteHelper_1.default.checkThatAddressAlreadyExists(address);
                if (addressExists) {
                    return responseHelper_1.default.sendResponse(res, 400, false, message);
                }
                return next();
            }
            return next();
        });
    }
    static validateDestinationCoordinates(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.action) {
                const { destination: { coordinates } } = req.body;
                const message = 'Provided coordinates belong to an existing address';
                const locationExists = yield RouteHelper_1.default.checkThatLocationAlreadyExists(coordinates);
                if (locationExists) {
                    return responseHelper_1.default.sendResponse(res, 400, false, message);
                }
                return next();
            }
            return next();
        });
    }
    static validateRouteUpdate(req, res, next) {
        return GeneralValidator_1.default.joiValidation(req, res, next, req.body, ValidationSchemas_1.updateRouteSchema);
    }
    static validateRouteBatchUpdateFields(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { validateNumber } = GeneralValidator_1.default;
            const { body: { batch, name, inUse, regNumber, providerId } } = req;
            let errors = [];
            const [cabExists, cabDetails] = yield RouteHelper_1.default.checkThatVehicleRegNumberExists(regNumber);
            const [routeExists, route] = yield RouteHelper_1.default.checkThatRouteNameExists(name);
            const [providerExists] = yield RouteHelper_1.default.checkThatProviderIdExists(providerId);
            errors = [...errors, (inUse && !validateNumber(inUse)) && 'inUse should be a positive integer'];
            errors = [...errors, (regNumber && !cabExists) && `No cab with reg number '${regNumber}' exists in the db`];
            errors = [...errors, (name && !routeExists) && `The route '${name}' does not exist in the db`];
            errors = [...errors, (providerId && !providerExists) && `The provider with id '${providerId}' does not exist in the db`];
            errors = errors.filter((e) => !!e);
            if (errors.length)
                return responseHelper_1.default.sendResponse(res, 400, false, errors);
            req.body.cabId = regNumber && cabDetails.id;
            req.body.routeId = name && route.id;
            req.body.batch = batch;
            next();
        });
    }
    static validateDateInputForRouteRiderStatistics(req, res, next) {
        return GeneralValidator_1.default
            .joiValidation(req, res, next, req.query, ValidationSchemas_1.dateRangeSchema);
    }
}
exports.default = RouteValidator;
//# sourceMappingURL=RouteValidator.js.map