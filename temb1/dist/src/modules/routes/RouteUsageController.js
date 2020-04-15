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
const group_array_1 = __importDefault(require("group-array"));
const batchUseRecord_service_1 = require("../batchUseRecords/batchUseRecord.service");
const RouteHelper_1 = __importDefault(require("../../helpers/RouteHelper"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const route_service_1 = require("./route.service");
class RoutesUsageController {
    static getRouteUsage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { from, to } = req.query;
                const values = [];
                const batchUsageRecords = yield batchUseRecord_service_1.batchUseRecordService.getRoutesUsage(from, to);
                const { rowCount, rows } = batchUsageRecords;
                if (rows.length === 0) {
                    const responses = {
                        mostUsedBatch: { Route: 'N/A', percentageUsage: 0 }, leastUsedBatch: { Route: 'N/A', percentageUsage: 0 }
                    };
                    return responseHelper_1.default.sendResponse(res, 200, true, 'Percentage Usage Generated', responses);
                }
                rows.map((item) => values.push(item.name));
                const { mostUsedRoute, numberOfTimes } = RouteHelper_1.default.mostUsedRoute(values);
                const { leastUsedRoute, numberOfLeastUsedTime } = RouteHelper_1.default.leastUsedRoute(values);
                const mostUsedRoutePercentage = RouteHelper_1.default.mostLeastUsedRoutePercentage(numberOfTimes, rowCount);
                const leastUsedRoutePercentage = RouteHelper_1.default.mostLeastUsedRoutePercentage(numberOfLeastUsedTime, rowCount);
                return responseHelper_1.default.sendResponse(res, 200, true, 'Percentage Usage Generated', {
                    mostUsedBatch: { Route: mostUsedRoute, percentageUsage: mostUsedRoutePercentage },
                    leastUsedBatch: { Route: leastUsedRoute, percentageUsage: leastUsedRoutePercentage }
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static getRouteRatings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { from, to } = req.query;
                const { homebaseid } = req.headers;
                const data = yield route_service_1.routeService.routeRatings(from, to, homebaseid);
                const groupedData = group_array_1.default(data[0], 'Route', 'RouteBatchName');
                const routeAverageRatings = [];
                Object.values(groupedData).forEach((route) => {
                    Object.values(route).map((batchRatings) => {
                        const sum = batchRatings.reduce((prev, next) => prev + next.rating, 0);
                        const avg = sum / batchRatings.length;
                        const { RouteBatchName, Route } = batchRatings[0];
                        const ratings = {
                            RouteBatchName, Route, NumberOfRatings: batchRatings.length, Average: Math.round(avg)
                        };
                        return routeAverageRatings.push(ratings);
                    });
                });
                return responseHelper_1.default.sendResponse(res, 200, true, 'Ratings Fetched Successfully', routeAverageRatings.sort((a, b) => b.Average - a.Average));
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
}
exports.default = RoutesUsageController;
//# sourceMappingURL=RouteUsageController.js.map