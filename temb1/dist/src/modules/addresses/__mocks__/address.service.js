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
const database_1 = require("../../../database");
const sequelize_1 = require("sequelize");
const address_service_1 = __importDefault(require("../address.service"));
const location_service_1 = require("../../locations/__mocks__/location.service");
const logger_1 = require("../../shared/logging/__mocks__/logger");
const __mocks__1 = require("../../../database/__mocks__");
class MockAddress extends __mocks__1.MockRepository {
    constructor(addresses = []) {
        super(database_1.Address, addresses);
    }
    findOrCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const where = options.where;
                    const testAddress = where['address'][sequelize_1.Op.iLike] || '';
                    const existing = this.data
                        .find((a) => a.address.includes(testAddress.replace(/[\$%]/g, '')));
                    if (existing) {
                        resolve([this.wrapInModel(existing), false]);
                    }
                    const newLoc = yield this.create(options.defaults);
                    resolve([this.wrapInModel(newLoc), true]);
                }
                catch (err) {
                    reject(new Error('error creating new address'));
                }
            }));
        });
    }
}
exports.mockAddressRepo = new MockAddress();
exports.mockAddressService = new address_service_1.default(exports.mockAddressRepo, location_service_1.mockLocationService, logger_1.mockLogger);
//# sourceMappingURL=address.service.js.map