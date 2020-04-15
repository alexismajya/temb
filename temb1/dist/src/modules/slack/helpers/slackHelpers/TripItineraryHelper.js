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
const database_1 = __importDefault(require("../../../../database"));
const user_service_1 = __importDefault(require("../../../users/user.service"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const trip_request_1 = require("../../../../database/models/trip-request");
const { models: { User, Address } } = database_1.default;
const { Op } = sequelize_1.default;
const includeQuery = [
    {
        model: Address,
        as: 'origin',
        attributes: ['address']
    },
    {
        model: Address,
        as: 'destination',
        attributes: ['address']
    },
    {
        model: User,
        as: 'requester',
        attributes: ['name', 'slackId']
    },
    {
        model: User,
        as: 'rider',
        attributes: ['name', 'slackId']
    }
];
class TripItineraryHelper {
    static getUserIdBySlackId(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_service_1.default.getUserBySlackId(slackId);
            if (!user) {
                throw new Error('User not found');
            }
            return user.id;
        });
    }
    static getThirtyDaysFromNow() {
        const difference = Date.now() - 2592000000;
        return difference;
    }
    static getTripItineraryFilters(requestType, userId, tripStatus) {
        const difference = TripItineraryHelper.getThirtyDaysFromNow();
        const filterTripsItinerary = {
            [Op.eq]: sequelize_1.default.where(sequelize_1.default.fn('date', sequelize_1.default.col('departureTime')), requestType === 'upcoming'
                ? { [Op.gte]: sequelize_1.default.fn('NOW') }
                : {
                    [Op.and]: [
                        { [Op.lte]: sequelize_1.default.fn('NOW') }, { [Op.gte]: new Date(difference) }
                    ]
                }),
            [Op.or]: [{ riderId: userId }, { requestedById: userId }],
            tripStatus: { [Op.or]: tripStatus }
        };
        return filterTripsItinerary;
    }
    static getPaginatedTripRequestsBySlackUserId(slackUserId, requestType = 'upcoming', pageNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripStatus = requestType === 'upcoming'
                ? [trip_request_1.TripStatus.pending, trip_request_1.TripStatus.approved, trip_request_1.TripStatus.confirmed]
                : [trip_request_1.TripStatus.completed];
            const userId = yield TripItineraryHelper.getUserIdBySlackId(slackUserId);
            const tripItineraryFilters = TripItineraryHelper.getTripItineraryFilters(requestType, userId, tripStatus);
            const filters = {
                raw: true,
                where: tripItineraryFilters,
                include: includeQuery
            };
            const paginatedTrips = yield trip_service_1.default.getPaginatedTrips(filters, pageNo);
            return paginatedTrips;
        });
    }
}
exports.default = TripItineraryHelper;
//# sourceMappingURL=TripItineraryHelper.js.map