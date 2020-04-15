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
const batch_use_record_1 = __importDefault(require("../../database/models/batch-use-record"));
const route_use_record_1 = __importDefault(require("../../database/models/route-use-record"));
const user_1 = __importDefault(require("../../database/models/user"));
const route_1 = __importDefault(require("../../database/models/route"));
const route_batch_1 = __importDefault(require("../../database/models/route-batch"));
const base_service_1 = require("../shared/base.service");
const database_1 = __importDefault(require("../../database"));
const AISService_1 = __importDefault(require("../../services/AISService"));
class RouteStatistics extends base_service_1.BaseService {
    constructor(batchuserecord = database_1.default.getRepository(batch_use_record_1.default)) {
        super(batchuserecord);
    }
    getFrequentRiders(order, startDate, endDate, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.findAll({
                    attributes: [
                        'userId', 'batchRecordId', [sequelize_1.default.fn('count', sequelize_1.default.col('userId')), 'userCount'],
                    ],
                    where: {
                        userAttendStatus: 'Confirmed',
                        createdAt: { [sequelize_1.default.Op.between]: [startDate, endDate] },
                    },
                    limit: 5,
                    include: [...this.includeUsersOnRouteQuery(homebaseId)],
                    group: [
                        'BatchUseRecord.batchRecordId', 'BatchUseRecord.userId', 'user.id',
                        'batchRecord.id', 'batchRecord->batch.id', 'batchRecord->batch->route.id',
                    ],
                    order: [[sequelize_1.default.fn('count', sequelize_1.default.col('userId')), order]],
                });
                return data;
            }
            catch (error) {
                return error.message;
            }
        });
    }
    includeUsersOnRouteQuery(homebaseId) {
        return [
            {
                model: user_1.default,
                as: 'user',
                attributes: ['name', 'email'],
            },
            {
                model: route_use_record_1.default,
                as: 'batchRecord',
                attributes: ['batchId'],
                include: [
                    {
                        model: route_batch_1.default,
                        as: 'batch',
                        attributes: ['batch'],
                        include: [
                            {
                                model: route_1.default,
                                as: 'route',
                                attributes: ['name'],
                                where: { homebaseId },
                            }
                        ],
                    }
                ],
            }
        ];
    }
    getUserPicture(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            const details = yield AISService_1.default.getUserDetails(email);
            return details && details.picture ? details.picture : defaultProfilePicture;
        });
    }
    addUserPictures(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(payload.map((data) => __awaiter(this, void 0, void 0, function* () {
                const topArray = Object.assign({}, data);
                topArray.picture = yield this.getUserPicture(data.user.email);
                return topArray;
            })));
        });
    }
    getTopAndLeastFrequentRiders(startDate, endDate, homeBaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const top = yield this.getFrequentRiders('DESC', startDate, endDate, homeBaseId);
                const firstFiveMostFrequentRiders = yield this.addUserPictures(top);
                const bottom = yield this.getFrequentRiders('ASC', startDate, endDate, homeBaseId);
                const leastFiveFrequentRiders = yield this.addUserPictures(bottom);
                const data = {
                    firstFiveMostFrequentRiders,
                    leastFiveFrequentRiders,
                };
                return data;
            }
            catch (error) {
                return error.message;
            }
        });
    }
}
exports.routeStatistics = new RouteStatistics();
exports.default = RouteStatistics;
//# sourceMappingURL=route-statistics.service.js.map