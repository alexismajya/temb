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
const convert_array_to_csv_1 = require("convert-array-to-csv");
const ExportData_1 = __importDefault(require("../../utils/ExportData"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
class ExportDocument {
    static exportToPDF(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { headers: { homebaseid }, query: { table } } = req;
            const pdf = yield ExportData_1.default.createPDF(req.query, homebaseid);
            pdf.pipe(res);
            pdf.end();
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${table}.pdf`
            });
        });
    }
    static exportToCSV(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { headers: { homebaseid }, query: { table } } = req;
                const data = yield ExportData_1.default.createCSV(req.query, homebaseid);
                const csv = convert_array_to_csv_1.convertArrayToCSV(data);
                res.writeHead(200, {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename=${table}.csv`
                });
                res.write(csv);
                res.end();
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
                const errorMessage = {
                    message: 'Could not complete the process'
                };
                return errorHandler_1.default.sendErrorResponse(errorMessage, res);
            }
        });
    }
}
exports.default = ExportDocument;
//# sourceMappingURL=ExportsController.js.map