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
const errorHandler_1 = __importDefault(require("./errorHandler"));
class SequelizePaginationHelper {
    constructor(collection, filter, itemsPerPage = 10) {
        this.items = collection;
        this.filter = filter;
        this.itemsPerPage = Number(itemsPerPage);
    }
    static isDirectionValid(direction) {
        return ['asc', 'desc'].includes(direction);
    }
    static parseSortParam(items) {
        if (!(items.includes('desc') || items.includes('asc'))) {
            errorHandler_1.default.throwErrorIfNull(null, SequelizePaginationHelper.sortErrorMessage, 400);
        }
        const isDirectionValid = SequelizePaginationHelper.isDirectionValid(items[0]);
        return {
            direction: (isDirectionValid) ? items[0] : items[1],
            predicate: (!isDirectionValid) ? items[0] : items[1],
        };
    }
    static deserializeSort(sortParam) {
        if (!sortParam)
            return;
        const sort = sortParam.split(',');
        const len = sort.length;
        if (len === 1 && !SequelizePaginationHelper.isDirectionValid(sortParam)) {
            return [{ predicate: sortParam, direction: 'desc' }];
        }
        if (len % 2 !== 0) {
            errorHandler_1.default.throwErrorIfNull(null, SequelizePaginationHelper.sortErrorMessage, 400);
        }
        const deserialize = [];
        while (sort.length) {
            const items = sort.splice(0, 2);
            const data = SequelizePaginationHelper.parseSortParam(items);
            deserialize.push(data);
        }
        return deserialize;
    }
    getTotalPages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.totalItems) {
                this.totalItems = this.filter
                    ? yield this.items.count(this.filter)
                    : yield this.items.count();
            }
            const total = Math.ceil(this.totalItems / this.itemsPerPage);
            return total || 1;
        });
    }
    getPageInfo(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalPages = yield this.getTotalPages();
            const pageNo = yield this.getPageNo(page);
            const { totalItems, itemsPerPage } = this;
            return {
                totalPages, pageNo, totalItems, itemsPerPage
            };
        });
    }
    getPageNo(pageNo = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalPages = yield this.getTotalPages();
            const pageNumber = Number(pageNo) || 1;
            return Math.min(pageNumber, totalPages);
        });
    }
    getPageItems(pageNo = 1, moreParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const $pageNo = yield this.getPageNo(pageNo);
            const paginationConstraint = {
                offset: ($pageNo - 1) * this.itemsPerPage,
                limit: this.itemsPerPage
            };
            const filter = Object.assign(Object.assign({}, this.filter), moreParams);
            const rawData = yield this.items.findAll(Object.assign(Object.assign({}, filter), paginationConstraint));
            const $pageMeta = yield this.getPageInfo($pageNo);
            const data = rawData.map(SequelizePaginationHelper.deserializeObject);
            return {
                data,
                pageMeta: $pageMeta
            };
        });
    }
    static deserializeObject(data) {
        const value = data ? (data.dataValues || data) : data;
        Object.keys(value).forEach((key) => {
            value[key] = value[key] ? (value[key].dataValues || value[key]) : value[key];
        });
        return value;
    }
}
exports.default = SequelizePaginationHelper;
SequelizePaginationHelper.sortErrorMessage = 'Invalid sort provided. '
    + 'It must be in the format: sort=<predicate>,<direction>, '
    + 'where direction must be either [asc, desc] e.g. sort=id,asc';
//# sourceMappingURL=sequelizePaginationHelper.js.map