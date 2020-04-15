"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_controller_1 = __importDefault(require("./address.controller"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const { AddressValidator, GeneralValidator } = middlewares_1.default;
const addressRouter = express_1.default.Router();
addressRouter.post('/addresses', AddressValidator.validateAddressBody, AddressValidator.validateaddress, address_controller_1.default.addNewAddress.bind(address_controller_1.default));
addressRouter.put('/addresses', AddressValidator.validateAddressUpdateBody, AddressValidator.validateUpdateaddress, address_controller_1.default.updateAddress.bind(address_controller_1.default));
addressRouter.get('/addresses', GeneralValidator.validateQueryParams, address_controller_1.default.getAddresses.bind(address_controller_1.default));
addressRouter.get('/addresses/:id', GeneralValidator.validateIdParam, address_controller_1.default.getSingleAddress.bind(address_controller_1.default));
exports.default = addressRouter;
//# sourceMappingURL=index.js.map