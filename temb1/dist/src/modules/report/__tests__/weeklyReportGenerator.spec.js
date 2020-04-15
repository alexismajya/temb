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
const weeklyReportMock_1 = require("../__mocks__/weeklyReportMock");
const weeklyReportGenerator_1 = __importDefault(require("../weeklyReportGenerator"));
const utils_1 = __importDefault(require("../../../utils"));
describe('WeeklyReportGenerator', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('generateEmailData', () => {
        it('should generate trips information of user', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(weeklyReportGenerator_1.default, 'generateTotalByTripType').mockResolvedValue({});
            jest.spyOn(weeklyReportGenerator_1.default, 'generateRouteInfo').mockResolvedValue({});
            weeklyReportGenerator_1.default.generateEmailData([weeklyReportMock_1.mockUserTrip1], [weeklyReportMock_1.mockUserRoute, weeklyReportMock_1.mockUserRoute2]);
            expect(weeklyReportGenerator_1.default.generateTotalByTripType).toHaveBeenCalled();
            expect(weeklyReportGenerator_1.default.generateRouteInfo).toHaveBeenCalled();
        }));
    });
    describe('generateTotalByTripType', () => {
        it('should return object with trips information', () => __awaiter(void 0, void 0, void 0, function* () {
            const expected = {
                airportTransfer: 1,
                date: utils_1.default.getLastWeekStartDate('LL'),
                name: 'name',
                embassyVisit: 1,
                regularTrip: 1,
                routeTrip: 0,
                total: 3,
            };
            const response = weeklyReportGenerator_1.default.generateTotalByTripType(weeklyReportMock_1.mockUserTrip1);
            expect(response).toEqual(expected);
        }));
    });
    describe('generateRouteInfo', () => {
        it('should return object with trips information', () => __awaiter(void 0, void 0, void 0, function* () {
            const expected = {
                date: utils_1.default.getLastWeekStartDate('LL'),
                embassyVisit: 0,
                regularTrip: 0,
                airportTransfer: 0,
                name: 'name',
                routeTrip: 1,
                total: 1,
            };
            const response = weeklyReportGenerator_1.default.generateRouteInfo(weeklyReportMock_1.mockUserRoute);
            expect(response).toEqual(expected);
        }));
    });
});
//# sourceMappingURL=weeklyReportGenerator.spec.js.map