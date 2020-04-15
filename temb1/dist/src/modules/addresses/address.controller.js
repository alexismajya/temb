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
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const address_service_1 = require("./address.service");
const constants_1 = require("../../helpers/constants");
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
class AddressController {
    constructor(addressService = address_service_1.addressService, logger = bugsnagHelper_1.default) {
        this.addressService = addressService;
        this.logger = logger;
    }
    addNewAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { longitude, latitude, address } = req.body;
                const newLongitude = Number(longitude);
                const newLatitude = Number(latitude);
                const newAddress = yield this.addressService.createNewAddress(newLongitude, newLatitude, address);
                let message = 'Address has been successfully created';
                let status = 201;
                const addressData = {
                    address: {
                        address: newAddress.address,
                        longitude: newAddress.longitude,
                        latitude: newAddress.latitude,
                    },
                };
                if (!newAddress.isNewAddress) {
                    message = 'Address already exists';
                    status = 400;
                }
                return responseHelper_1.default.sendResponse(res, status, newAddress.isNewAddress, message, addressData);
            }
            catch (error) {
                this.logger.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    updateAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newLongitude, newLatitude, newAddress, address } = req.body;
                const longitude = Number(newLongitude);
                const latitude = Number(newLatitude);
                const addressData = yield this.addressService.updateAddress(address, longitude, latitude, newAddress);
                const data = {
                    address: {
                        address: addressData.address,
                        longitude: addressData.location.longitude,
                        latitude: addressData.location.latitude,
                    },
                };
                const message = 'Address record updated';
                return responseHelper_1.default.sendResponse(res, 200, true, message, data);
            }
            catch (error) {
                this.logger.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    getAddresses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const size = req.query.size || constants_1.DEFAULT_SIZE;
                const data = yield this.addressService.getAddressesFromDB(size, page);
                const { count, rows, totalPages: actualPagesCount } = data;
                if (rows.length <= 0 || page > actualPagesCount) {
                    throw new errorHandler_1.default('There are no records on this page.', 404);
                }
                const totalPages = Math.ceil(count / size);
                const message = `${page} of ${totalPages} page(s).`;
                const pageData = { pageMeta: { page, totalPages, totalResults: count } };
                const addressData = { pageData, data };
                return responseHelper_1.default.sendResponse(res, 200, true, message, addressData);
            }
            catch (error) {
                this.logger.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    getSingleAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params: { id } } = req;
                const address = yield this.addressService.findAddressById(id);
                return res.status(200).json(address);
            }
            catch (error) {
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
}
exports.AddressController = AddressController;
const addressController = new AddressController();
exports.default = addressController;
//# sourceMappingURL=address.controller.js.map