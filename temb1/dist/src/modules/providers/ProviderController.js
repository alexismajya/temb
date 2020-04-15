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
const sequelize_1 = require("sequelize");
const provider_service_1 = require("./provider.service");
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const constants_1 = require("../../helpers/constants");
const providerHelper_1 = __importDefault(require("../../helpers/providerHelper"));
const ErrorTypeChecker_1 = __importDefault(require("../../helpers/ErrorTypeChecker"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const utils_1 = __importDefault(require("../../utils"));
class ProviderController {
    static addProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { headers: { homebaseid, origin }, body: data } = req;
            let [code, success, message, provider] = [201, true, 'Provider created successfully', null];
            try {
                if (provider_service_1.providerService.isDmOrChannel(data.notificationChannel)) {
                    Object.assign(data, { verified: true });
                }
                const result = yield provider_service_1.providerService.createProvider(Object.assign(Object.assign({}, data), { homebaseId: homebaseid }));
                yield provider_service_1.providerService.verify(result, { origin });
                provider = result;
            }
            catch (err) {
                code = 400;
                success = false;
                if (ProviderController.isPhoneNumberOrEmailError(err)) {
                    message = 'Phone number or email already exists';
                }
                else {
                    message = 'failed to create provider, provider probably exists already';
                }
                bugsnagHelper_1.default.log(err);
            }
            responseHelper_1.default.sendResponse(res, code, success, message, provider);
        });
    }
    static getAllProviders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, size, name } = req.query;
                const { headers: { homebaseid } } = req;
                page = page || 1;
                size = size || constants_1.DEFAULT_SIZE;
                name = name && name.trim();
                const where = name ? {
                    name: { [sequelize_1.Op.iLike]: `%${name}%` }
                } : null;
                const pageable = { page, size };
                const providersData = yield provider_service_1.providerService.getProviders(pageable, where, homebaseid);
                const { data, pageMeta: { totalPages, pageNo, totalItems: totalResults, itemsPerPage: pageSize } } = providersData;
                const message = `${pageNo} of ${totalPages} page(s).`;
                const pageData = providerHelper_1.default.paginateData(totalPages, page, totalResults, pageSize, data, 'providers');
                return responseHelper_1.default.sendResponse(res, 200, true, message, pageData);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static updateProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, params: { id } } = req;
                const data = yield provider_service_1.providerService.updateProvider(Object.assign({}, body), id);
                if (data.message) {
                    return responseHelper_1.default.sendResponse(res, 404, false, data.message || 'Provider doesnt exist');
                }
                return responseHelper_1.default.sendResponse(res, 200, true, 'Provider Details updated Successfully', data);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                const { message, statusCode } = ErrorTypeChecker_1.default.checkSequelizeValidationError(error, `The name ${req.body.name} is already taken`);
                return responseHelper_1.default.sendResponse(res, statusCode || 500, false, message || `Unable to update details ${error}`);
            }
        });
    }
    static deleteProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            try {
                const { params: { id } } = req;
                const result = yield provider_service_1.providerService.deleteProvider(id);
                message = 'Provider does not exist';
                if (result > 0) {
                    message = 'Provider deleted successfully';
                    return responseHelper_1.default.sendResponse(res, 200, true, message);
                }
                return responseHelper_1.default.sendResponse(res, 404, false, message);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                const serverError = {
                    message: 'Server Error. Could not complete the request',
                    statusCode: 500
                };
                errorHandler_1.default.sendErrorResponse(serverError, res);
            }
        });
    }
    static getViableProviders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { headers: { homebaseid } } = req;
            const providers = yield provider_service_1.providerService.getViableProviders(homebaseid);
            if (!providers[0])
                return responseHelper_1.default.sendResponse(res, 404, false, 'No viable provider exists');
            return responseHelper_1.default.sendResponse(res, 200, true, 'List of viable providers', providers);
        });
    }
    static activateProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { token } } = req;
            let [statusCode, message, success, body] = [200, 'Provider activated Successfully', true, null];
            try {
                const decoded = utils_1.default.verifyToken(token, 'TEMBEA_PUBLIC_KEY');
                const { id } = decoded;
                body = yield provider_service_1.providerService.activateProviderById({ verified: true }, id);
            }
            catch (error) {
                statusCode = 400;
                success = false;
                message = error.message;
                if (ProviderController.isTokenValidationError(error)) {
                    message = 'Sorry, token is not valid or has been expired. Request to validate your account '
                        + 'again';
                }
                bugsnagHelper_1.default.log(error);
            }
            responseHelper_1.default.sendResponse(res, statusCode, success, message, body);
        });
    }
    static isPhoneNumberOrEmailError(err) {
        return err.errors && (err.errors[0].path === 'phoneNo' || err.errors[0].path === 'email');
    }
}
exports.default = ProviderController;
//# sourceMappingURL=ProviderController.js.map