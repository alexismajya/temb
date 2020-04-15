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
const sequelize_1 = __importDefault(require("sequelize"));
const route_service_1 = require("./../routes/route.service");
const base_service_1 = require("../shared/base.service");
const route_batch_1 = __importDefault(require("../../database/models/route-batch"));
const RouteServiceHelper_1 = __importDefault(require("../../helpers/RouteServiceHelper"));
const database_1 = require("../../database");
const constants_1 = require("../../helpers/constants");
const { Op, fn } = sequelize_1.default;
class RouteBatchService extends base_service_1.BaseService {
    constructor() {
        super(route_batch_1.default);
    }
    createRouteBatch(batchDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const batch = yield this.model.create(batchDetails);
            return batch;
        });
    }
    getById(id, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const batch = yield this.findById(id, include);
            return batch;
        });
    }
    getRouteBatches(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const batches = yield this.findAll({
                where: {
                    status: { [Op.eq]: `${filter.status}` },
                    cabId: { [Op.ne]: null },
                    driverId: { [Op.ne]: null },
                },
            });
            return batches;
        });
    }
    updateRouteBatch(id, data, returning) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield this.update(id, data, returning);
            return route;
        });
    }
    getRouteBatchByPk(id, withFks = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                return null;
            let include;
            if (withFks) {
                include = ['riders', ...route_service_1.routeService.defaultInclude()];
            }
            const batch = yield this.getById(id, include);
            return batch;
        });
    }
    getPagedAvailableRouteBatches(homebaseId, page, where, size = constants_1.SLACK_DEFAULT_SIZE) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPaginated({
                page,
                limit: size,
                defaultOptions: {
                    order: [['id', 'asc']],
                    include: ['riders', 'cabDetails', 'route', ...route_service_1.routeService.updateDefaultInclude(where)],
                    where: {
                        [Op.and]: [
                            { homebaseId }, { status: where.status }, { cabId: { [Op.ne]: null } },
                            { driverId: { [Op.ne]: null } },
                        ],
                    },
                },
            });
        });
    }
    getRoutes(pageable = route_service_1.routeService.defaultPageable(), where = {}, homebaseId = 1, isV2 = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, size, sort } = pageable;
            let order;
            let filter;
            if (sort) {
                order = [...route_service_1.routeService.convertToSequelizeOrderByClause(sort)];
            }
            if (where && where.status)
                filter = { where: { homebaseId, status: where.status } };
            else {
                filter = { where: { homebaseId } };
            }
            const { data, pageMeta: { totalPages, limit, count, page: actualPage, } } = yield this.getPaginated({
                page, limit: size, defaultOptions: Object.assign(Object.assign({}, filter), { order, include: ['riders',
                        ...route_service_1.routeService.updateDefaultInclude(where)], attributes: [[fn('COUNT', sequelize_1.default.col('riders.routeBatchId')), 'inUse'],
                        ...route_service_1.routeService.defaultRouteDetails], group: [...route_service_1.routeService.defaultRouteGroupBy()] }),
            });
            const routes = isV2 ? data : data.map(RouteServiceHelper_1.default.serializeRouteBatch);
            return { routes, pageMeta: { totalPages, page: actualPage, totalResults: count, pageSize: limit,
                } };
        });
    }
    deleteRouteBatch(routeBatchId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.destroy({ where: { id: routeBatchId } });
        });
    }
    findActiveRouteWithDriverOrCabId(driverIdOrCabId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findAll({
                where: Object.assign({ status: 'Active' }, driverIdOrCabId),
                include: [
                    {
                        model: database_1.Route,
                        as: 'route',
                        include: [{
                                model: database_1.Address,
                                as: 'destination',
                            }],
                    },
                ],
            });
            return result;
        });
    }
}
exports.routeBatchService = new RouteBatchService();
exports.default = RouteBatchService;
//# sourceMappingURL=routeBatch.service.js.map