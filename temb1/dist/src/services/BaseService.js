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
const providerHelper_1 = __importDefault(require("../helpers/providerHelper"));
const sequelizePaginationHelper_1 = __importDefault(require("../helpers/sequelizePaginationHelper"));
class BaseService {
    constructor(model) {
        this.model = model;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByPk(id);
            return result;
        });
    }
    findOne(attribute) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOne({ where: attribute });
            return result;
        });
    }
    delete(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceId = (typeof resource === 'object') ? resource.id : resource;
            const result = yield this.model.destroy({
                where: { id: resourceId }
            });
            return result;
        });
    }
    getPaginatedItems(pageable = providerHelper_1.default.defaultPageable, where = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = [];
            const { page, size } = pageable;
            let filter;
            if (where && where.providerId)
                filter = { where: { providerId: where.providerId } };
            const paginatedDrivers = new sequelizePaginationHelper_1.default(this.model, filter, size);
            const { data, pageMeta } = yield paginatedDrivers.getPageItems(page);
            const { totalPages } = pageMeta;
            if (page <= totalPages) {
                items = data.map(providerHelper_1.default.serializeDetails);
            }
            return { data: items, pageMeta };
        });
    }
}
exports.default = BaseService;
//# sourceMappingURL=BaseService.js.map