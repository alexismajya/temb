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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routeBatch_service_1 = require("../../modules/routeBatches/routeBatch.service");
const ExportDataMocks_1 = require("../__mocks__/ExportDataMocks");
const ExportData_1 = __importStar(require("../ExportData"));
const department_service_1 = require("../../modules/departments/department.service");
const trip_service_1 = require("../../modules/trips/trip.service");
const RouteUseRecordService_1 = __importDefault(require("../../services/RouteUseRecordService"));
describe('DataFromDB', () => {
    let dataFromDB;
    let tripMock;
    beforeEach(() => {
        dataFromDB = new ExportData_1.DataFromDB();
        tripMock = ExportDataMocks_1.tripsMock();
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('getRoutes', () => {
        it('should return routes fetched from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const routeSpy = jest.spyOn(routeBatch_service_1.routeBatchService, 'getRoutes')
                .mockReturnValue({ routes: [...ExportDataMocks_1.routesMock] });
            const result = yield dataFromDB.getRoutes();
            expect(routeSpy).toHaveBeenCalledTimes(1);
            expect(result.data).toEqual(ExportDataMocks_1.routesMock);
            expect(result.columns[0]).toEqual({
                header: 'Name', height: 40, id: 'name', width: 120
            });
            expect(result.margins).toEqual({
                margins: {
                    top: 40, bottom: 40, left: 25, right: 30
                }
            });
        }));
    });
    describe('getDepartments', () => {
        it('should return departments fetched from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const departmentSpy = jest.spyOn(department_service_1.departmentService, 'getAllDepartments')
                .mockReturnValue({ rows: [...ExportDataMocks_1.departmentsMock] });
            const result = yield ExportData_1.DataFromDB.getDepartments();
            expect(departmentSpy).toHaveBeenCalledTimes(1);
            expect(result.data).toEqual(ExportDataMocks_1.departmentsMock);
            expect(result.columns[0]).toEqual({
                header: 'Department', height: 40, id: 'name', width: 140
            });
            expect(result.margins).toEqual({
                margins: {
                    top: 40, bottom: 40, left: 60, right: 60
                }
            });
        }));
    });
    describe('getTripItinerary', () => {
        it('should return trip itinerary fetched from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const itinerarySpy = jest.spyOn(trip_service_1.TripService.prototype, 'getTrips')
                .mockReturnValue({ trips: tripMock });
            const result = yield dataFromDB.getTripItinerary();
            expect(itinerarySpy).toHaveBeenCalledTimes(1);
            expect(result.data).toEqual(tripMock);
            expect(result.columns[0]).toEqual({
                header: 'Requested On', height: 40, id: 'requestedOn', width: 85
            });
            expect(result.margins).toEqual({
                margins: {
                    top: 40, bottom: 40, left: 15, right: 10
                }
            });
        }));
    });
    describe('getPendingRequests', () => {
        it('should return pending trips requests fetched from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const pendingTripsSpy = jest.spyOn(trip_service_1.TripService.prototype, 'getTrips')
                .mockReturnValue({ trips: tripMock });
            const result = yield dataFromDB.getPendingRequests();
            expect(pendingTripsSpy).toHaveBeenCalledTimes(1);
            expect(result.data).toEqual(tripMock);
            expect(result.columns[0]).toEqual({
                header: 'Requested On', height: 40, id: 'requestedOn', width: 85
            });
            expect(result.margins).toEqual({
                margins: {
                    top: 40, bottom: 40, left: 15, right: 10
                }
            });
        }));
    });
    describe('getRouteAnalysis', () => {
        it('should return routes analysis fetched from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const routeSpy = jest.spyOn(RouteUseRecordService_1.default, 'getRouteTripRecords')
                .mockReturnValue({ route: ExportDataMocks_1.routesMock });
            const flatter = jest.spyOn(ExportData_1.DataFromDB, 'flattenRoutesAnalyticsObject').mockResolvedValue();
            const result = yield dataFromDB.getRouteAnalysis();
            expect(routeSpy).toHaveBeenCalledTimes(1);
            expect(flatter).toBeCalled();
            expect(result.columns[0]).toEqual({
                header: 'Date', height: 40, id: 'date', width: 65
            });
            expect(result.margins).toEqual({
                margins: {
                    top: 40, bottom: 40, left: 25, right: 30
                }
            });
        }));
        it('Should return flatten Routes Analytics Object', () => {
            const func = ExportData_1.DataFromDB.flattenRoutesAnalyticsObject(ExportDataMocks_1.routeAnalyticsValue);
            expect(func).toBeDefined();
            expect(func).toEqual(ExportDataMocks_1.routeAnalyticsValue);
        });
    });
    describe('fetchData', () => {
        it('should fetch data from from correct table', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { routes: [] };
            const spy = jest.spyOn(dataFromDB, 'getRoutes')
                .mockImplementation(() => data);
            const result = yield dataFromDB.fetchData('routes');
            expect(spy).toBeCalled();
            expect(result).toEqual(data);
        }));
    });
});
describe('ExportData', () => {
    let fetchDataSpy;
    beforeEach(() => {
        fetchDataSpy = jest.spyOn(ExportData_1.DataFromDB.prototype, 'fetchData')
            .mockReturnValue({ dataFromDBMock: ExportDataMocks_1.dataFromDBMock });
    });
    describe('createPDF', () => {
        it('should return a pdf document', () => __awaiter(void 0, void 0, void 0, function* () {
            const query = { table: 'routes' };
            const result = yield ExportData_1.default.createPDF(query);
            expect(fetchDataSpy).toBeCalledWith('routes');
            expect(result).toBeDefined();
        }));
    });
    describe('createCSV', () => {
        it('should return new  data', () => __awaiter(void 0, void 0, void 0, function* () {
            const query = { table: 'pendingRequests' };
            jest.spyOn(ExportData_1.default, 'getColumnHeaders').mockResolvedValue(ExportDataMocks_1.columnHeaders);
            yield jest.spyOn(ExportData_1.default, 'formNewRequiredData').mockResolvedValue(ExportDataMocks_1.newFormedData);
            yield ExportData_1.default.createCSV(query);
            expect(fetchDataSpy).toBeCalledWith('pendingRequests');
        }));
    });
    describe('filterRequired', () => {
        it('should return a list of object data', () => {
            const result = ExportData_1.default.filterRequired(ExportDataMocks_1.pendingTripData, ExportDataMocks_1.columnHeaders);
            expect(result).toEqual(ExportDataMocks_1.filteredData);
        });
    });
    describe('formNewRequiredData', () => {
        it('should return new formed data', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ExportData_1.default.formNewRequiredData(ExportDataMocks_1.listOfDataObj, ExportDataMocks_1.columnHeaders);
            expect(result).toEqual(ExportDataMocks_1.newFormedData);
        }));
    });
    describe('getColumnHeaders', () => {
        it('should return a list of headers', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ExportData_1.default.getColumnHeaders(ExportDataMocks_1.columns);
            expect(result).toEqual(ExportDataMocks_1.columnHeaders);
        }));
    });
    describe('formatHeaders', () => {
        it('should return new data with capitalized headers', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ExportData_1.default.formatHeaders('head.name');
            expect(result).toEqual('Lead');
        }));
    });
});
//# sourceMappingURL=ExportData.spec.js.map