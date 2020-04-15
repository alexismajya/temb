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
const utils_1 = __importDefault(require("../../utils"));
const trip_service_1 = __importDefault(require("../trips/trip.service"));
class GenerateReportData {
    getReportData(numberOfMonthsBack) {
        return __awaiter(this, void 0, void 0, function* () {
            const monthsBackDate = moment_1.default(new Date()).subtract({ months: numberOfMonthsBack }).format('YYYY-MM-DD');
            const dateFilters = {
                requestedOn: { after: monthsBackDate }
            };
            const where = trip_service_1.default.sequelizeWhereClauseOption(Object.assign({}, dateFilters));
            return trip_service_1.default.getAll({ where }, { order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']] });
        });
    }
    generateTotalsSummary(trips) {
        const summary = {
            month: utils_1.default.getPreviousMonth(),
            totalTrips: trips.length,
            totalTripsDeclined: 0,
            totalTripsCompleted: 0,
            departments: {},
        };
        trips.forEach((trip) => {
            if (!summary.departments[trip.department.name]) {
                summary.departments[trip.department.name] = { completed: 0, declined: 0, total: 0 };
            }
            if (trip.tripStatus === 'Completed') {
                summary.departments[trip.department.name].completed += 1;
                summary.totalTripsCompleted += 1;
            }
            else {
                summary.totalTripsDeclined += 1;
                summary.departments[trip.department.name].declined += 1;
            }
            summary.departments[trip.department.name].total += 1;
        });
        return summary;
    }
    calculateLastMonthPercentageChange(totalTripsCompletedLastMonth, totalTakenTwoMonthsBack) {
        const percentage = (((totalTripsCompletedLastMonth - totalTakenTwoMonthsBack)
            / (totalTakenTwoMonthsBack || totalTripsCompletedLastMonth || 1)) * 100).toFixed(2);
        return percentage;
    }
}
const generateReportData = new GenerateReportData();
exports.default = generateReportData;
//# sourceMappingURL=ReportData.js.map