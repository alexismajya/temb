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
const database_1 = __importDefault(require("../../src/database"));
const { models: { User, Provider, Driver, RouteRequest, TripRequest, Department, Country, RouteUseRecord, BatchUseRecord, } } = database_1.default;
exports.createModel = (Model, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Model.create(payload);
    return result.get({ plain: true });
});
exports.createUser = (userPayload) => __awaiter(void 0, void 0, void 0, function* () { return exports.createModel(User, userPayload); });
exports.createProvider = (providerPayload) => __awaiter(void 0, void 0, void 0, function* () { return exports.createModel(Provider, providerPayload); });
exports.createDriver = (driverPayload) => __awaiter(void 0, void 0, void 0, function* () { return exports.createModel(Driver, driverPayload); });
exports.createRouteRequest = (requestPayload) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.createModel(RouteRequest, requestPayload);
});
exports.createTripRequests = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield TripRequest.bulkCreate(payload);
    return result;
});
exports.createDepartment = (data) => __awaiter(void 0, void 0, void 0, function* () { return exports.createModel(Department, data); });
exports.createCountry = (data) => __awaiter(void 0, void 0, void 0, function* () { return exports.createModel(Country, data); });
exports.createRouteUseRecords = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield RouteUseRecord.bulkCreate(payload);
    return data;
});
exports.createBatchUseRecords = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield BatchUseRecord.bulkCreate(payload);
    return data;
});
//# sourceMappingURL=helpers.js.map