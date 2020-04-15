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
const fs_1 = __importDefault(require("fs"));
const GenerateExcelBook_1 = __importDefault(require("./GenerateExcelBook"));
const ReportData_1 = __importDefault(require("./ReportData"));
class ReportGeneratorService {
    constructor(numberOfMonthsBack = 1, reportType = 'excel') {
        this.allowedTypes = ['excel', 'csv'];
        this.reportType = reportType;
        this.numberOfMonthsBack = numberOfMonthsBack;
        if (!this.allowedTypes.includes(reportType)) {
            throw Error(`The allowed report types are [${this.allowedTypes}]`);
        }
    }
    generateMonthlyReport() {
        return ReportData_1.default.getReportData(this.numberOfMonthsBack);
    }
    getEmailAttachmentFile(tripData) {
        if (!Array.isArray(tripData))
            throw Error('headers should be an array');
        if (this.reportType === 'excel') {
            return GenerateExcelBook_1.default.getWorkBook(tripData);
        }
        throw Error(`The allowed report types are [${this.allowedTypes}]`);
    }
    writeAttachmentToStream(workBook) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!workBook || typeof workBook !== 'object')
                throw Error('A workbook object is required');
            const stream = fs_1.default.createWriteStream('excel.xlsx', { autoClose: true, flags: 'w' });
            yield workBook.xlsx.write(stream);
            return stream;
        });
    }
    getMonthlyTripsSummary(monthsBack) {
        return __awaiter(this, void 0, void 0, function* () {
            const monthOneTripData = yield ReportData_1.default.getReportData(monthsBack);
            const totalSummary = ReportData_1.default.generateTotalsSummary(monthOneTripData);
            return totalSummary;
        });
    }
    getOverallTripsSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            const monthOneSummary = yield this.getMonthlyTripsSummary(1);
            const { totalTripsCompleted: monthTwoTripsCompleted, } = yield this.getMonthlyTripsSummary(2);
            const percentage = ReportData_1.default.calculateLastMonthPercentageChange(monthOneSummary.totalTripsCompleted, monthTwoTripsCompleted);
            return Object.assign(Object.assign({}, monthOneSummary), { percentageChange: percentage });
        });
    }
}
exports.ReportGeneratorService = ReportGeneratorService;
const reportGeneratorService = new ReportGeneratorService();
exports.default = reportGeneratorService;
//# sourceMappingURL=ReportGeneratorService.js.map