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
const moment_1 = __importDefault(require("moment"));
const async_1 = require("async");
const constants_1 = require("../helpers/constants");
const database_1 = __importDefault(require("../database"));
const sequelizePaginationHelper_1 = __importDefault(require("../helpers/sequelizePaginationHelper"));
const removeDataValues_1 = __importDefault(require("../helpers/removeDataValues"));
const batchUseRecord_service_1 = require("../modules/batchUseRecords/batchUseRecord.service");
const route_service_1 = require("../modules/routes/route.service");
const { models: { RouteUseRecord, RouteBatch, Cab, Route, Driver, Address, BatchUseRecord } } = database_1.default;
const routeRecordInclude = {
    include: [{
            model: RouteBatch,
            as: 'batch',
            paranoid: false,
            where: {},
            include: [
                'riders',
                {
                    model: Route,
                    as: 'route',
                    attributes: ['name', 'imageUrl'],
                    include: [
                        { model: Address, as: 'destination', attributes: ['address'] },
                        Object.assign({}, route_service_1.homebaseInfo)
                    ]
                },
                {
                    model: Cab,
                    as: 'cabDetails',
                    attributes: ['regNumber', 'model']
                },
                {
                    model: Driver,
                    as: 'driver',
                    attributes: ['driverName', 'driverPhoneNo', 'driverNumber', 'email']
                }
            ],
        }]
};
class RouteUseRecordService {
    static get defaultPageable() {
        return {
            page: 1, size: constants_1.MAX_INT
        };
    }
    static getByPk(id, withFks = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                include: withFks
                    ? [{
                            model: RouteBatch,
                            as: 'batch',
                            include: ['riders', 'route']
                        }] : null
            };
            const record = yield RouteUseRecord.findByPk(id, filter);
            return removeDataValues_1.default.removeDataValues(record);
        });
    }
    static create(batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = moment_1.default.utc().toISOString();
            const result = yield RouteUseRecord.create({
                batchId,
                batchUseDate: date,
            });
            return result.dataValues;
        });
    }
    static getAll(pageable = RouteUseRecordService.defaultPageable, where = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, size } = pageable;
            let order;
            let filter;
            if (where) {
                filter = { where: Object.assign({}, where) };
            }
            const paginatedRoutes = new sequelizePaginationHelper_1.default(RouteUseRecord, filter, size);
            paginatedRoutes.filter = Object.assign(Object.assign({}, filter), { subQuery: false, order, include: ['batch'] });
            const { data, pageMeta } = yield paginatedRoutes.getPageItems(page);
            return Object.assign({ data }, pageMeta);
        });
    }
    static updateUsageStatistics(batchRecordId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield batchUseRecord_service_1.batchUseRecordService.getBatchUseRecord(undefined, { batchRecordId });
            let confirmedUsers = 0;
            let unConfirmedUsers = 0;
            let skippedUsers = 0;
            let pendingUsers = 0;
            data.map((userRecord) => __awaiter(this, void 0, void 0, function* () {
                if (userRecord.userAttendStatus === 'Confirmed') {
                    confirmedUsers += 1;
                }
                if (userRecord.userAttendStatus === 'Skip') {
                    skippedUsers += 1;
                }
                if (userRecord.userAttendStatus === 'NotConfirmed') {
                    unConfirmedUsers += 1;
                }
                if (userRecord.userAttendStatus === 'Pending') {
                    pendingUsers += 1;
                }
                return '';
            }));
            yield RouteUseRecordService.updateRouteUseRecord(batchRecordId, {
                unConfirmedUsers, confirmedUsers, skippedUsers, pendingUsers
            });
        });
    }
    static updateRouteUseRecord(recordId, updateObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield RouteUseRecord.update(Object.assign({}, updateObject), {
                returning: true,
                where: { id: recordId }
            });
            return result;
        });
    }
    static getRouteTripRecords(pageable, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, size } = pageable;
            const paginationConstraint = {
                offset: (page - 1) * size,
                limit: size
            };
            if (homebaseId)
                routeRecordInclude.include[0].where.homebaseId = homebaseId;
            const allRouteRecords = yield RouteUseRecord.findAll(Object.assign({}, routeRecordInclude));
            const paginatedRouteRecords = yield RouteUseRecord.findAll(Object.assign(Object.assign({}, paginationConstraint), routeRecordInclude));
            const paginationMeta = {
                totalPages: Math.ceil(allRouteRecords.length / size),
                pageNo: page,
                totalItems: allRouteRecords.length,
                itemsPerPage: size
            };
            return {
                data: removeDataValues_1.default.removeDataValues(paginatedRouteRecords),
                pageMeta: Object.assign({}, paginationMeta)
            };
        });
    }
    static getAdditionalInfo(routeTripsData) {
        return new Promise((resolve) => {
            let results = [];
            async_1.each(routeTripsData, (record, callback) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const editableRecord = Object.assign({}, record);
                    const data = yield BatchUseRecord.findOne({
                        where: { batchRecordId: editableRecord.batch.id }
                    });
                    const { rating } = data.get();
                    const { confirmedUsers, unConfirmedUsers, skippedUsers, pendingUsers } = editableRecord;
                    const totalUsers = confirmedUsers + unConfirmedUsers + skippedUsers + pendingUsers;
                    const utilization = ((confirmedUsers / totalUsers) * 100).toFixed(0);
                    editableRecord.utilization = utilization >= 0 ? utilization : '0';
                    editableRecord.averageRating = rating;
                    results = [...results, editableRecord];
                    callback();
                }
                catch (error) {
                    callback();
                }
            }), () => { if (results.length !== 0) {
                resolve(results);
            }
            else {
                resolve([]);
            } });
        });
    }
}
exports.default = RouteUseRecordService;
//# sourceMappingURL=RouteUseRecordService.js.map