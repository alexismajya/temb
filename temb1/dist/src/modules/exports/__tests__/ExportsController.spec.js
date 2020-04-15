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
const ExportData_1 = __importDefault(require("../../../utils/ExportData"));
const ExportsController_1 = __importDefault(require("../ExportsController"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const ExportDataMocks_1 = require("../../../utils/__mocks__/ExportDataMocks");
const ExportsControllerMocks_1 = __importDefault(require("../__mocks__/ExportsControllerMocks"));
const twilio_mocks_1 = require("../../notifications/whatsapp/twilio.mocks");
twilio_mocks_1.mockWhatsappOptions();
describe('ExportController', () => {
    let req;
    let res;
    let req2;
    let res2;
    let req3;
    describe('exportToPDF', () => {
        let exportDataSpy;
        const pdfMock = {
            pipe: jest.fn(),
            end: jest.fn()
        };
        beforeEach(() => {
            req = { headers: { homebaseid: 1 }, query: { table: 'table' } };
            res = { writeHead: jest.fn() };
            exportDataSpy = jest.spyOn(ExportData_1.default, 'createPDF').mockResolvedValue(pdfMock);
        });
        it('should create a pdf and respond', () => __awaiter(void 0, void 0, void 0, function* () {
            yield ExportsController_1.default.exportToPDF(req, res);
            expect(exportDataSpy).toHaveBeenCalledWith({ table: 'table' }, 1);
            expect(res.writeHead).toBeCalledTimes(1);
            expect(pdfMock.pipe).toBeCalledWith(res);
            expect(pdfMock.end).toBeCalledTimes(1);
        }));
    });
    describe('exportToCSV', () => {
        beforeEach(() => {
            req2 = {
                headers: { homebaseid: 1 },
                query: { table: 'pendingRequests', sort: 'name,asc,batch,asc' }
            };
            res2 = { writeHead: jest.fn(), write: jest.fn(), end: jest.fn() };
            req3 = { headers: { homebaseid: null }, query: { table: '', sort: 'name,asc,batch,asc' } };
            errorHandler_1.default.sendErrorResponse = jest.fn();
        });
        afterEach((done) => {
            jest.restoreAllMocks();
            done();
        });
        it('should return a csv data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(ExportData_1.default, 'createCSV').mockResolvedValue(ExportDataMocks_1.newFormedData);
            yield ExportsController_1.default.exportToCSV(req2, res2);
            expect(ExportData_1.default.createCSV).toBeCalledTimes(1);
            expect(res2.writeHead).toBeCalledTimes(1);
            expect(res2.write).toBeCalledTimes(1);
            expect(res2.end).toBeCalledTimes(1);
        }));
        it('should return server error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockResolvedValue(ExportsControllerMocks_1.default);
            const result = yield ExportsController_1.default.exportToCSV(req3, res2);
            expect(result).toEqual(ExportsControllerMocks_1.default);
        }));
    });
});
//# sourceMappingURL=ExportsController.spec.js.map