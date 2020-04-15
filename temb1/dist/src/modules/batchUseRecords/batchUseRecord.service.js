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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../helpers/constants");
const database_1 = __importStar(require("../../database"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const base_service_1 = require("../shared/base.service");
const { models: { RouteUseRecord, RouteBatch, Route, User, }, } = database_1.default;
const batchDefaultInclude = {
    model: RouteUseRecord,
    as: 'batchRecord',
    include: [{
            model: RouteBatch,
            as: 'batch',
            include: ['cabDetails', {
                    model: Route, as: 'route', include: ['destination'],
                }],
        }],
};
class BatchUseRecordService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(database_1.BatchUseRecord)) {
        super(model);
        this.serializeBatchRecord = (batchData) => {
            const { id, userId, batchRecordId, userAttendStatus, reasonForSkip, rating, createdAt, updatedAt, user: { name, slackId, email, routeBatchId, }, } = batchData;
            return {
                id,
                userId,
                batchRecordId,
                userAttendStatus,
                reasonForSkip,
                rating,
                createdAt,
                updatedAt,
                user: { name, slackId, email, routeBatchId, id: userId },
                routeUseRecord: Object.assign({}, this.serializeRouteBatch(batchData.batchRecord)),
            };
        };
        this.serializePaginatedData = this.serializePaginatedData.bind(this);
        this.serializeRouteBatch = this.serializeRouteBatch.bind(this);
    }
    getRoutesUsage(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM "RouteUseRecords" as routeuse_record,
    "RouteBatches" as batches, "Routes" as routes
    WHERE routeuse_record."batchId"=batches.id AND routes.id=batches."routeId"
    AND routeuse_record."batchUseDate">='${from}' AND routeuse_record."createdAt"<='${to}'`;
            const results = yield database_1.default.query(query);
            return results[1];
        });
    }
    get defaultPageable() {
        return { page: 1, size: constants_1.MAX_INT };
    }
    createSingleRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const batchUseRecord = yield this.model.create(data);
            return batchUseRecord.get();
        });
    }
    createBatchUseRecord(batchRecord, users) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    const { data: existingUser } = yield this.getBatchUseRecord(undefined, { userId: user.id, batchRecordId: batchRecord.id });
                    if (existingUser.length > 0)
                        return true;
                    const batchUseRecord = yield this.model.create({
                        userId: user.id,
                        batchRecordId: batchRecord.id,
                    });
                    return batchUseRecord.get();
                })));
                return result;
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
            }
        });
    }
    getBatchUseRecord(pageable = this.defaultPageable, where = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, size } = pageable;
            let filter;
            const criteria = Object.assign({}, where);
            delete criteria.homebaseId;
            if (where) {
                filter = { where: Object.assign({}, criteria) };
            }
            const { data, pageMeta: { totalPages, limit, count, page: returnedPage, } } = yield this.getPaginated({
                page,
                limit: size,
                defaultOptions: Object.assign(Object.assign({}, filter), { order: [['id', 'ASC']], include: [
                        {
                            model: User,
                            as: 'user',
                            where: where && where.homebaseId ? { homebaseId: where.homebaseId } : {},
                        }, batchDefaultInclude
                    ] }),
            });
            return this.serializePaginatedData({
                data,
                pageMeta: { totalPages, pageNo: returnedPage, totalItems: count, itemsPerPage: limit },
            });
        });
    }
    getUserRouteRecord(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalTrips = yield this.model.count({
                where: {
                    userId: id,
                },
            });
            const tripsTaken = yield this.model.count({
                where: {
                    userId: id, userAttendStatus: 'Confirmed',
                },
            });
            return { totalTrips, tripsTaken, userId: id };
        });
    }
    updateBatchUseRecord(recordId, updateObject) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.update(recordId, updateObject, { returning: true }); });
    }
    serializeRouteBatch(batchRecord) {
        if (!batchRecord)
            return {};
        const { id, batchUseDate, batch: { id: batchId, takeOff, status, comments, routeId, cabId, cabDetails: { driverName, driverPhoneNo, regNumber, }, route: { name, destination: { locationId, address }, }, }, } = batchRecord;
        return {
            id,
            routeId,
            departureDate: `${batchUseDate} ${takeOff}`,
            batch: {
                batchId, takeOff, status, comments,
            },
            cabDetails: {
                cabId, driverName, driverPhoneNo, regNumber,
            },
            route: {
                routeId, name, destination: { locationId, address },
            },
        };
    }
    serializePaginatedData(paginatedData) {
        const newData = Object.assign({}, paginatedData);
        const { data, pageMeta } = newData;
        const result = data.map(this.serializeBatchRecord);
        newData.data = result;
        newData.pageMeta = pageMeta;
        return newData;
    }
}
exports.batchUseRecordService = new BatchUseRecordService();
exports.default = exports.batchUseRecordService;
//# sourceMappingURL=batchUseRecord.service.js.map