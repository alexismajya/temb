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
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../../database"));
const constants_1 = require("../../helpers/constants");
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const user_service_1 = __importDefault(require("../users/user.service"));
const RouteServiceHelper_1 = __importDefault(require("../../helpers/RouteServiceHelper"));
const base_service_1 = require("../shared/base.service");
const app_event_service_1 = __importDefault(require("../events/app-event.service"));
const route_events_constants_1 = require("../events/route-events.constants");
const route_1 = __importDefault(require("../../database/models/route"));
const route_batch_1 = __importDefault(require("../../database/models/route-batch"));
const routeBatch_service_1 = require("../routeBatches/routeBatch.service");
const { models: { Cab, Address, User, Driver, Homebase, Country, }, } = database_1.default;
const { Op } = sequelize_1.default;
exports.homebaseInfo = {
    model: Homebase,
    as: 'homebase',
    attributes: ['id', 'name'],
    include: [{ model: Country, as: 'country', attributes: ['name', 'id', 'status'] }],
};
class RouteService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(route_1.default)) {
        super(model);
    }
    sort() {
        return {
            cab: { model: Cab, as: 'cabDetails' },
            route: { model: route_1.default, as: 'route' },
            riders: { model: User, as: 'riders' },
            destination: { model: Address, as: 'destination' },
            homebase: { model: Homebase, as: 'homebase' },
        };
    }
    defaultPageable() {
        return {
            page: 1,
            size: constants_1.MAX_INT,
            sort: [{ predicate: 'id', direction: 'asc' }],
        };
    }
    defaultInclude() {
        return [
            'cabDetails',
            {
                model: Driver,
                as: 'driver',
                include: ['user'],
            },
            {
                model: route_1.default, as: 'route', include: ['destination'],
            },
            Object.assign({}, exports.homebaseInfo)
        ];
    }
    get defaultRouteDetails() {
        return ['id', 'status', 'capacity', 'takeOff', 'batch', 'comments', 'homebaseId'];
    }
    defaultRouteGroupBy() {
        return ['riders.id', 'RouteBatch.id', 'cabDetails.id', 'route.id', 'route->destination.id', 'driver.id',
            'driver->user.id', 'homebase.id', 'homebase->country.name', 'homebase->country.id'];
    }
    createRouteBatch(data, botToken, first = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routeId, capacity, status, takeOff, providerId, } = data;
            const route = yield this.findById(routeId);
            const routeBatchObject = {
                routeId,
                capacity,
                status,
                takeOff,
                providerId,
                batch: yield this.updateBatchLabel({ route, created: first }),
            };
            const routeBatch = yield routeBatch_service_1.routeBatchService.createRouteBatch(routeBatchObject);
            app_event_service_1.default.broadcast({
                name: route_events_constants_1.routeEvents.newRouteBatchCreated,
                data: { botToken, data: routeBatch },
            });
            return routeBatch;
        });
    }
    createRoute(routeDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, imageUrl, destinationId } = routeDetails;
            const batchInfo = { model: route_batch_1.default, as: 'routeBatch' };
            const [route, created] = yield this.model.findOrCreate({
                where: { name: { [Op.iLike]: `${name}%` } },
                defaults: { name, imageUrl, destinationId },
                order: [[batchInfo, 'createdAt', 'DESC']],
                include: [batchInfo],
            });
            return { created, route: route.get() };
        });
    }
    addUserToRoute(routeBatchId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield routeBatch_service_1.routeBatchService.getById(routeBatchId, ['riders']);
            errorHandler_1.default.throwErrorIfNull(route, 'Route route not found');
            if (!RouteServiceHelper_1.default.canJoinRoute(route)) {
                errorHandler_1.default.throwErrorIfNull(null, 'Route capacity has been exhausted', 403);
            }
            const updateUserTable = user_service_1.default.getUserById(userId)
                .then((user) => user_service_1.default.updateUser(user.id, { routeBatchId: route.id }));
            const updateRoute = yield routeBatch_service_1.routeBatchService.updateRouteBatch(route.id, { inUse: route.inUse + 1 });
            yield database_1.default.transaction(() => Promise.all([updateUserTable, updateRoute]));
        });
    }
    getRouteById(id, withFks = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let include;
            if (withFks) {
                include = ['routeBatch'];
            }
            const route = yield this.findById(id, include);
            return route;
        });
    }
    getRouteByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield this.findOneByProp({ prop: 'name', value: name });
            return route;
        });
    }
    updateBatchLabel({ route, created }) {
        return __awaiter(this, void 0, void 0, function* () {
            let batch = 'A';
            if (!created) {
                const fullRoute = yield this.getRouteById(route.id, true);
                ({ batch } = fullRoute.routeBatch[fullRoute.routeBatch.length - 1]);
                const batchDigit = batch.charCodeAt(0) + 1;
                batch = String.fromCharCode(batchDigit);
            }
            return batch;
        });
    }
    convertToSequelizeOrderByClause(sort) {
        return sort.map((item) => {
            const { predicate, direction } = item;
            let order = [predicate, direction];
            if (RouteServiceHelper_1.default.isCabFields(predicate)) {
                order.unshift(this.sort().cab);
            }
            if (predicate === 'destination') {
                order = [this.sort(), this.sort().destination, 'address', direction];
            }
            if (predicate === 'name') {
                order.unshift(this.sort().route);
            }
            return order;
        });
    }
    updateDefaultInclude(where) {
        if (where && where.name) {
            return [
                this.defaultInclude()[0], this.defaultInclude()[1],
                {
                    model: route_1.default,
                    as: 'route',
                    include: ['destination'],
                    where: { name: { [Op.iLike]: `%${where.name}%` } },
                },
                this.defaultInclude()[3],
            ];
        }
        return this.defaultInclude();
    }
    routeRatings(from, to, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const previousMonthStart = moment_1.default().subtract(1, 'months').date(1).format('YYYY-MM-DD');
            const previousMonthEnd = moment_1.default().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
            let query = `
      SELECT BUR.id AS "BatchUseRecordID", BUR.rating, RUR.id AS "RouteRecordID",
      RB.id As "RouteBatchID", RB.batch As "RouteBatchName", R.name As "Route", R.id As "RouteID",
      RUR."batchUseDate" FROM "BatchUseRecords" AS BUR
      INNER JOIN "RouteUseRecords" AS RUR ON BUR."batchRecordId" = RUR.id
      INNER JOIN "RouteBatches" AS RB ON RUR."batchId" = RB.id AND RB."homebaseId" = ${homebaseId}
      INNER JOIN "Routes" AS R ON RB."routeId" = R.id
      WHERE BUR.rating IS NOT NULL
      `;
            const filterByDate = ` AND DATE(RUR."batchUseDate") >= '${from || previousMonthStart}'
    AND DATE(RUR."batchUseDate") <= '${to || previousMonthEnd}'`;
            query += filterByDate;
            const results = yield database_1.default.query(query);
            return results;
        });
    }
}
exports.routeService = new RouteService();
exports.default = RouteService;
//# sourceMappingURL=route.service.js.map