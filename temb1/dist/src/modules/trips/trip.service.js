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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = __importStar(require("../../database"));
const trip_request_viewmodel_1 = require("../../database/viewmodels/trip-request.viewmodel");
const WhereClauseHelper_1 = __importDefault(require("../../helpers/WhereClauseHelper"));
const base_service_1 = require("../shared/base.service");
const SlackPaginationHelper_1 = __importDefault(require("../../helpers/slack/SlackPaginationHelper"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const teamDetails_service_1 = require("../teamDetails/teamDetails.service");
const driver_notifications_1 = __importDefault(require("../slack/SlackPrompts/notifications/DriverNotifications/driver.notifications"));
const TripJobs_1 = __importDefault(require("../../services/jobScheduler/jobs/TripJobs"));
const Notifications_1 = __importDefault(require("../slack/SlackPrompts/Notifications"));
class TripService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(database_1.TripRequest)) {
        super(model);
        this.defaultInclude = [
            { model: database_1.Provider, include: ['user'], raw: true },
            { model: database_1.Homebase, include: ['country'], raw: true },
            { model: database_1.Department, include: ['head'] },
            'cab', 'driver', 'requester', 'origin', 'destination', 'rider', 'approver', 'confirmer',
            'decliner', 'tripDetail',
        ];
    }
    sequelizeWhereClauseOption(filterParams) {
        const { departureTime, requestedOn, currentDay, status: tripStatus, department: departmentName, type: tripType, noCab, searchterm: searchTerm, } = filterParams;
        let where = {};
        if (tripStatus)
            where = { tripStatus };
        if (departmentName)
            where = Object.assign(Object.assign({}, where), { departmentName });
        if (tripType)
            where = Object.assign(Object.assign({}, where), { tripType });
        where = WhereClauseHelper_1.default.getNoCabWhereClause(Boolean(noCab), where);
        if (currentDay) {
            where = Object.assign(Object.assign({}, where), { departureTime: {
                    [sequelize_1.Op.gte]: moment_1.default(moment_1.default(), 'YYYY-MM-DD').toDate(),
                } });
        }
        let dateFilters = this.getDateFilters('departureTime', departureTime || {});
        where = Object.assign(Object.assign({}, where), dateFilters);
        dateFilters = this.getDateFilters('createdAt', requestedOn || {});
        where = Object.assign(Object.assign({}, where), dateFilters);
        if (searchTerm) {
            where = Object.assign(Object.assign({}, where), { [sequelize_1.Op.or]: [
                    { '$requester.name$': { [sequelize_1.Op.iLike]: { [sequelize_1.Op.any]: [`%${searchTerm}%`] } } },
                    { '$rider.name$': { [sequelize_1.Op.iLike]: { [sequelize_1.Op.any]: [`%${searchTerm}%`] } } },
                    { '$origin.address$': { [sequelize_1.Op.iLike]: { [sequelize_1.Op.any]: [`%${searchTerm}%`] } } },
                    { '$destination.address$': { [sequelize_1.Op.iLike]: { [sequelize_1.Op.any]: [`%${searchTerm}%`] } } },
                ] });
        }
        return where;
    }
    getPaginatedTrips(filters, pageNo, limit = SlackPaginationHelper_1.default.getSlackPageSize()) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = Object.assign(Object.assign({}, filters), { include: this.defaultInclude });
            const trips = yield this.getPaginated({ limit, defaultOptions: filter, page: pageNo });
            return trips;
        });
    }
    getTrips(pageable, where, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, size: limit } = pageable;
            if (homebaseId)
                where.homebaseId = homebaseId;
            const defaultOptions = this.createFilter(Object.assign({}, where));
            const { data: trips, pageMeta } = yield this.getPaginated({ page, limit, defaultOptions });
            return Object.assign({ trips }, pageMeta);
        });
    }
    createFilter(where, defaultInclude = this.defaultInclude) {
        const { departmentName: name } = where;
        let include = [...defaultInclude];
        const destination = {
            model: database_1.Address,
            as: 'destination',
            attributes: ['address'],
        };
        include.push(destination);
        if (name && this.defaultInclude.indexOf('department') > -1) {
            include.splice(include.indexOf('department'), 1);
            const department = {
                model: database_1.Department,
                as: 'department',
                where: { name },
                attributes: ['name'],
            };
            include = [...include, department];
        }
        const { departmentName: _ } = where, rest = __rest(where, ["departmentName"]);
        return {
            include,
            where: rest,
        };
    }
    serializeTripRequest(trip) {
        return new trip_request_viewmodel_1.TripRequestViewModel(trip);
    }
    getDateFilters(field, data) {
        const { after, before } = data;
        const both = after && before;
        let from;
        let to;
        let condition;
        if (after) {
            from = { [sequelize_1.Op.gte]: moment_1.default(after, 'YYYY-MM-DD').toDate() };
            condition = from;
        }
        if (before) {
            to = { [sequelize_1.Op.lte]: moment_1.default(before, 'YYYY-MM-DD').toDate() };
            condition = to;
        }
        if (both) {
            condition = { [sequelize_1.Op.and]: [from, to] };
        }
        if (!after && !before)
            return {};
        return {
            [field]: condition,
        };
    }
    checkExistence(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.model.count({ where: { id } });
            if (count > 0) {
                return true;
            }
            return false;
        });
    }
    getById(pk, withFk = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trip = yield this.findById(pk, withFk ? this.defaultInclude : []);
                return trip;
            }
            catch (error) {
                throw new Error('Could not return the requested trip');
            }
        });
    }
    getAll(params = { where: {} }, order = { order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']] }) {
        return __awaiter(this, void 0, void 0, function* () {
            const trips = yield this.findAll({
                where: params.where,
                include: [...this.defaultInclude],
                order: [...order.order],
            });
            return trips;
        });
    }
    updateRequest(tripId, updateObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.update(tripId, updateObject);
                const result = yield this.getById(tripId, true);
                return result;
            }
            catch (error) {
                errorHandler_1.default.throwErrorIfNull(null, 'Error updating trip request', 500);
            }
        });
    }
    completeCabAndDriverAssignment({ tripId, updateData, teamId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const trip = yield this.update(tripId, updateData, {
                returning: true,
                include: tripService.defaultInclude,
            });
            const botToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            Notifications_1.default.sendUserConfirmOrDeclineNotification(teamId, trip.requester.slackId, trip, false);
            driver_notifications_1.default.checkAndNotifyDriver(updateData.driverId, teamId, trip);
            TripJobs_1.default.scheduleTakeOffReminder({ botToken, data: trip });
            return trip;
        });
    }
    createRequest(requestObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const trip = yield this.add(requestObject);
            return trip;
        });
    }
    getCompletedTravelTrips(startDate, endDate, departmentList, homeBaseToFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            if (departmentList && departmentList.length)
                where = { name: { [sequelize_1.Op.in]: [...departmentList] } };
            where = {
                homebaseId: homeBaseToFilter,
                tripStatus: 'Completed',
                [sequelize_1.Op.or]: [{ tripType: 'Embassy Visit' }, { tripType: 'Airport Transfer' }],
                createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
            };
            const include = [{
                    model: database_1.Department,
                    as: 'department',
                    required: true,
                }];
            const options = {
                where, include, attributes: [
                    'departmentId',
                    [sequelize_1.default.literal('department.name'), 'departmentName'],
                    [sequelize_1.default.fn('avg', sequelize_1.default.col('rating')), 'averageRating'],
                    [sequelize_1.default.fn('count', sequelize_1.default.col('departmentId')), 'totalTrips'],
                    [sequelize_1.default.fn('sum', sequelize_1.default.col('cost')), 'totalCost'],
                ],
                group: ['department.id', 'TripRequest.departmentId'],
            };
            return yield this.model.findAll(options);
        });
    }
}
exports.TripService = TripService;
const tripService = new TripService();
exports.default = tripService;
//# sourceMappingURL=trip.service.js.map