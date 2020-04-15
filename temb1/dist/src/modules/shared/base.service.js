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
Object.defineProperty(exports, "__esModule", { value: true });
class RootService {
    constructor(model) {
        this.model = model;
        this.defaultPaginationLimit = 10;
        this.findOneByProp = (option, include) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOne({ include, where: this.createWhereOptions(option) });
            return result ? result.get({ plain: true }) : null;
        });
        this.findManyByProp = (option, include) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findAll({ include, where: this.createWhereOptions(option) });
            return result.map((item) => item.get({ plain: true }));
        });
        this.findAll = (options) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findAll(options);
            return result.map((e) => e.get({ plain: true }));
        });
        this.createWhereOptions = (option) => ({
            [String(option.prop)]: option.value
        });
    }
    add(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.create(model);
            return result ? result.get({ plain: true }) : null;
        });
    }
    getPaginated(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageOptions = yield this.getPaginationOptions(options);
            const result = yield this.model.findAll(pageOptions.dbOptions);
            return new PagedResult(result.map((entry) => entry.get()), pageOptions.meta);
        });
    }
    shouldReturnUpdated(returning) {
        return returning && returning.returning;
    }
    getPaginationOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { where = {}, include = [], order = [], group = undefined, subQuery = false, } = options.defaultOptions || {};
            const count = yield this.model.count({ where });
            const { limit = this.defaultPaginationLimit } = options;
            const totalPages = Math.ceil(count / limit) || 1;
            const currentPage = this.getValidPageNumber(options.page, totalPages);
            const offset = (currentPage - 1) * limit;
            return {
                dbOptions: { where, include, order, offset, limit, group, subQuery },
                meta: { totalPages, limit, count, page: currentPage },
            };
        });
    }
    getValidPageNumber(page, totalPages) {
        let thePage = page || 1;
        thePage = (thePage > totalPages)
            ? totalPages : ((thePage <= 0) ? 1 : thePage);
        return thePage;
    }
}
exports.RootService = RootService;
class BaseService extends RootService {
    constructor(model) {
        super(model);
        this.findById = (id, include, attributes) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByPk(id, { include, attributes });
            return result ? result.get({ plain: true }) : null;
        });
    }
    update(id, data, returning) {
        return __awaiter(this, void 0, void 0, function* () {
            const [, [result]] = yield this.model.update(Object.assign({}, data), {
                where: { id },
                returning: true,
            });
            if (!this.shouldReturnUpdated(returning))
                return result.get();
            const updatedResult = yield this.findById(id, returning.include);
            return updatedResult;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.destroy({
                where: { id },
            });
        });
    }
}
exports.BaseService = BaseService;
class PagedResult {
    constructor(data, pageMeta) {
        this.data = data;
        this.pageMeta = pageMeta;
    }
}
exports.PagedResult = PagedResult;
//# sourceMappingURL=base.service.js.map