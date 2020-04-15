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
const cab_1 = __importDefault(require("../../database/models/cab"));
const providerHelper_1 = __importDefault(require("../../helpers/providerHelper"));
const base_service_1 = require("../shared/base.service");
const database_1 = __importDefault(require("../../database"));
class CabService extends base_service_1.BaseService {
    constructor(cab = database_1.default.getRepository(cab_1.default)) {
        super(cab);
    }
    findOrCreateCab(regNumber, capacity, model, providerId, color) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                where: { regNumber },
                defaults: {
                    regNumber, capacity, model, providerId, color,
                },
            };
            const [cab, isNewRecord] = yield this.model.findOrCreate(payload);
            return { isNewRecord, cab: cab.get() };
        });
    }
    findByRegNumber(regNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const cabDetails = yield this.findOneByProp({ prop: 'regNumber', value: regNumber });
            return cabDetails;
        });
    }
    getById(pk) { return this.findById(pk); }
    getCabs(pageable = providerHelper_1.default.defaultPageable, where = {}) {
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
    updateCab(cabId, cabUpdateObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldCabDetails = yield this.getById(cabId);
                if (!oldCabDetails)
                    return { message: 'Update Failed. Cab does not exist' };
                const updatedCab = yield this.update(cabId, Object.assign({}, cabUpdateObject));
                return updatedCab;
            }
            catch (error) {
                throw new Error('Could not update cab details');
            }
        });
    }
    deleteCab(cabId) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = yield this.model.destroy({
                where: { id: cabId },
            });
            return responseData;
        });
    }
}
exports.cabService = new CabService();
exports.default = CabService;
//# sourceMappingURL=cab.service.js.map