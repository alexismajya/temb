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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const TripsDataMock_1 = __importDefault(require("../__mocks__/TripsDataMock"));
const ReportGeneratorService_1 = __importStar(require("../ReportGeneratorService"));
describe('Report Generator Service', () => {
    let reportService;
    const response = TripsDataMock_1.default;
    beforeAll(() => {
        reportService = ReportGeneratorService_1.default;
        jest.spyOn(trip_service_1.default, 'getAll').mockResolvedValue(response);
    });
    it('should return data to generate report', () => __awaiter(void 0, void 0, void 0, function* () {
        const tripData = yield reportService.generateMonthlyReport();
        expect(tripData).toEqual(response);
    }));
    it('should return excel workbook', () => __awaiter(void 0, void 0, void 0, function* () {
        const tripData = yield reportService.generateMonthlyReport();
        const excelWorkBook = reportService.getEmailAttachmentFile(tripData);
        expect(excelWorkBook).toBeInstanceOf(Object);
        expect(excelWorkBook.getWorksheet(1)).toBeInstanceOf(Object);
        expect(excelWorkBook.getWorksheet(1).name).toBe('Summary');
        expect(excelWorkBook.getWorksheet(2).name).toBe('Trip Details');
    }));
    it('should return excel file stream', () => __awaiter(void 0, void 0, void 0, function* () {
        const tripData = yield reportService.generateMonthlyReport();
        const excelWorkBook = reportService.getEmailAttachmentFile(tripData);
        const fileStream = yield ReportGeneratorService_1.default.writeAttachmentToStream(excelWorkBook);
        expect(fileStream.constructor.name).toBe('WriteStream');
        expect(fileStream).toHaveProperty('path');
        expect(fileStream.path).toBe('excel.xlsx');
    }));
    it('should raise an error on unsupported report type', () => {
        const willThrows = () => new ReportGeneratorService_1.ReportGeneratorService(undefined, 'unsupported');
        expect(willThrows).toThrow();
    });
    it('should raise an error on unsupported report type when set via property', () => {
        const willThrowAnotherError = () => {
            const err = ReportGeneratorService_1.default;
            err.reportType = 'unsupported';
            err.getEmailAttachmentFile([]);
        };
        expect(willThrowAnotherError).toThrow();
    });
    it('should raise an error on tripData that is not an array', () => {
        const willThrowAnotherError = () => {
            const err = ReportGeneratorService_1.default;
            err.getEmailAttachmentFile([]);
        };
        expect(willThrowAnotherError).toThrow();
    });
    it('should raise an error when workbook passed to writer is not an object', () => {
        const willThrowAnotherError = () => __awaiter(void 0, void 0, void 0, function* () {
            yield ReportGeneratorService_1.default.writeAttachmentToStream('not an object');
        });
        expect(willThrowAnotherError()).rejects.toThrow();
    });
    it('should create a summary including percentage change', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ReportGeneratorService_1.default.getOverallTripsSummary();
        const lastMonth = moment_1.default().subtract(1, 'months');
        const month = lastMonth.format('MMM, YYYY');
        expect(result).toEqual({
            departments: {
                People: { completed: 0, declined: 1, total: 1 },
                null: { completed: 2, declined: 0, total: 2 }
            },
            month,
            percentageChange: '0.00',
            totalTrips: 3,
            totalTripsCompleted: 2,
            totalTripsDeclined: 1
        });
    }));
});
//# sourceMappingURL=GenerateData.test.js.map