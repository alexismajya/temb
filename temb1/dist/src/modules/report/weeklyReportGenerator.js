"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../../utils"));
class WeeklyReportGenerator {
    constructor() {
        this.defaultInfo = {
            embassyVisit: 0,
            regularTrip: 0,
            airportTransfer: 0,
            routeTrip: 0,
            date: utils_1.default.getLastWeekStartDate('LL'),
        };
    }
    generateEmailData(userTripData, userRouteData) {
        const userObject = {};
        userTripData.map((data) => {
            const tripTypeInfo = this.generateTotalByTripType(data);
            userObject[data.email] = tripTypeInfo;
        });
        const usersWithTrips = Object.keys(userObject);
        userRouteData.map((data) => {
            userObject[data.email] = usersWithTrips.includes(data.email)
                ? Object.assign(Object.assign({}, userObject[data.email]), { routeTrip: data.routes.length, total: userObject[data.email].total + data.routes.length }) : this.generateRouteInfo(data);
        });
        return userObject;
    }
    generateTotalByTripType(data) {
        const summary = Object.assign(Object.assign({}, this.defaultInfo), { name: data.name, total: data.trips.length });
        data.trips.forEach((trip) => {
            switch (trip.tripType) {
                case 'Embassy Visit':
                    summary.embassyVisit += 1;
                    break;
                case 'Airport Transfer':
                    summary.airportTransfer += 1;
                    break;
                default:
                    summary.regularTrip += 1;
                    break;
            }
        });
        return summary;
    }
    generateRouteInfo(route) {
        const routeTrips = route.routes.length;
        return Object.assign(Object.assign({}, this.defaultInfo), { name: route.name, routeTrip: routeTrips, total: routeTrips });
    }
}
const weeklyReportGenerator = new WeeklyReportGenerator();
exports.default = weeklyReportGenerator;
//# sourceMappingURL=weeklyReportGenerator.js.map