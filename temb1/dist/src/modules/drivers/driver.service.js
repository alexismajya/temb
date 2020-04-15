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
const base_service_1 = require("../shared/base.service");
const database_1 = __importDefault(require("../../database"));
const driver_1 = __importDefault(require("../../database/models/driver"));
const providerHelper_1 = __importDefault(require("../../helpers/providerHelper"));
const { models: { User } } = database_1.default;
class DriverService extends base_service_1.BaseService {
    constructor() {
        super(driver_1.default);
    }
    create(driverObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { driverNumber } = driverObject;
                const [driver] = yield this.model.findOrCreate({
                    where: { driverNumber: { [sequelize_1.Op.like]: `${driverNumber}%` } },
                    defaults: Object.assign({}, driverObject),
                });
                return driver;
            }
            catch (e) {
                return e;
            }
        });
    }
    getDrivers(pageable = providerHelper_1.default.defaultPageable, where = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageMeta: { totalPages, limit, count, page }, data } = yield this.getPaginated({
                page: pageable.page,
                limit: pageable.size,
                defaultOptions: { where },
            });
            return {
                data,
                pageMeta: {
                    totalPages,
                    pageNo: page,
                    totalItems: count,
                    itemsPerPage: limit,
                },
            };
        });
    }
    getDriverById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const driver = yield this.findById(id);
            return driver;
        });
    }
    deleteDriver(driver) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.destroy({
                where: {
                    id: driver.id,
                },
            });
            return result;
        });
    }
    driverUpdate(driverId, driverDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldDriverDetails = yield this.findById(driverId);
                if (!oldDriverDetails)
                    return { message: 'Update Failed. Driver does not exist' };
                const updatedDriver = yield this.update(driverId, Object.assign({}, driverDetails));
                return updatedDriver;
            }
            catch (err) {
                throw new Error('could not update the driver details');
            }
        });
    }
    static exists(email, driverPhoneNo, driverNumber, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subQuery = id
                ? `(SELECT * FROM "Drivers" WHERE "id"!='${id}') otherDrivers` : '"Drivers"';
            const query = `
        SELECT COUNT(*) !=0 as count  FROM
        ${subQuery}
         WHERE "driverPhoneNo" ='${driverPhoneNo}' OR "email" ='${email}'
          OR "driverNumber" ='${driverNumber}';`;
            const [[{ count }]] = yield database_1.default.query(query);
            return count;
        });
    }
    static findOneDriver(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const driver = yield driver_1.default.findOne(Object.assign(Object.assign({}, options), { include: [{ model: User, attributes: ['slackId'], as: 'user' }] }));
            return driver;
        });
    }
}
exports.driverService = new DriverService();
exports.default = DriverService;
//# sourceMappingURL=driver.service.js.map