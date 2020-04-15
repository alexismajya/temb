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
const cache_1 = __importDefault(require("../modules/shared/cache"));
const address_service_1 = require("../modules/addresses/address.service");
const ScheduleTripInputHandlers_1 = require("./slack/ScheduleTripInputHandlers");
const trip_service_1 = __importDefault(require("../modules/trips/trip.service"));
const teamDetails_service_1 = require("../modules/teamDetails/teamDetails.service");
const provider_service_1 = require("../modules/providers/provider.service");
class TripHelper {
    static cleanDateQueryParam(query, field) {
        if (query[field]) {
            const [a, b] = query[field].split(';');
            return this.extracted222(a, b);
        }
    }
    static extracted222(a, b) {
        const result = {};
        const [key1, value1] = this.extracted(a || '');
        if (key1) {
            result[key1] = value1;
        }
        const [key2, value2] = this.extracted(b || '');
        if (key2) {
            result[key2] = value2;
        }
        return result;
    }
    static extracted(a) {
        const [key, value] = a.split(':');
        if (key) {
            return [key, value];
        }
        return [];
    }
    static updateTripData(userId, name, pickup, othersPickup, dateTime, tripType = 'Regular Trip') {
        return __awaiter(this, void 0, void 0, function* () {
            const userTripDetails = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(userId));
            const userTripData = Object.assign({}, userTripDetails);
            const pickupCoords = pickup !== 'Others'
                ? yield address_service_1.addressService.findCoordinatesByAddress(pickup) : null;
            if (pickupCoords) {
                userTripData.pickupId = pickupCoords.id;
                userTripData.pickupLat = pickupCoords.location.latitude;
                userTripData.pickupLong = pickupCoords.location.longitude;
            }
            userTripData.id = userId;
            userTripData.name = name;
            userTripData.pickup = pickup;
            userTripData.othersPickup = othersPickup;
            userTripData.dateTime = dateTime;
            userTripData.departmentId = userTripDetails.department.value;
            userTripData.tripType = tripType;
            return userTripData;
        });
    }
    static getDestinationCoordinates(destination, tripData) {
        return __awaiter(this, void 0, void 0, function* () {
            const destinationCoords = destination !== 'Others'
                ? yield address_service_1.addressService.findCoordinatesByAddress(destination) : null;
            if (destinationCoords) {
                const { location: { longitude, latitude, id } } = destinationCoords;
                const tripDetails = Object.assign({}, tripData);
                tripDetails.destinationLat = latitude;
                tripDetails.destinationLong = longitude;
                tripDetails.destinationId = id;
                return tripDetails;
            }
            return tripData;
        });
    }
    static convertApprovalDateFormat(approvalDate, ts = false) {
        let date = approvalDate;
        if (ts)
            date *= 1000;
        return moment_1.default(new Date(date), 'YYYY-MM-DD HH:mm:ss').toISOString();
    }
    static tripHasProvider(trip) {
        return trip.providerId !== null;
    }
    static calculateSums(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalValues = { finalCost: 0, finalRating: 0, count: 0 };
            data.forEach((dataObject) => {
                finalValues.count += 1;
                finalValues.finalCost += parseInt(dataObject.totalCost, 10);
                finalValues.finalRating += parseFloat(dataObject.averageRating);
            });
            const { finalRating, count, finalCost } = finalValues;
            const finalAverageRating = (finalRating / count).toFixed(2);
            return { finalCost, finalAverageRating, count };
        });
    }
    static checkExistence(teamId, providerId, tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield provider_service_1.providerService.getProviderById(providerId);
            const trip = yield trip_service_1.default.getById(tripId, true);
            const team = yield teamDetails_service_1.teamDetailsService.getTeamDetails(teamId);
            let error;
            if (!provider || provider.id !== Number(providerId)) {
                error = 'The Provider is not found';
            }
            else if (!trip || trip.id !== Number(tripId)) {
                error = 'The trip is not found';
            }
            else if (!team || team.teamId !== teamId) {
                error = 'The team is not found';
            }
            return error;
        });
    }
}
exports.default = TripHelper;
//# sourceMappingURL=TripHelper.js.map