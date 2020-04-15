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
const pdfkit_1 = __importDefault(require("pdfkit"));
const voilab_pdf_table_1 = __importDefault(require("voilab-pdf-table"));
const RouteUseRecordService_1 = __importDefault(require("../services/RouteUseRecordService"));
const routeBatch_service_1 = require("../modules/routeBatches/routeBatch.service");
const sequelizePaginationHelper_1 = __importDefault(require("../helpers/sequelizePaginationHelper"));
const constants_1 = require("../helpers/constants");
const department_service_1 = require("../modules/departments/department.service");
const trip_service_1 = __importDefault(require("../modules/trips/trip.service"));
const TripsController_1 = __importDefault(require("../modules/trips/TripsController"));
class DataFromDB {
    constructor(query = {}, homebaseId) {
        const { sort } = query;
        this.sort = sort || 'id,asc';
        this.filterParams = query;
        this.homebaseId = homebaseId;
        this.getRoutes = this.getRoutes.bind(this);
        this.getTripItinerary = this.getTripItinerary.bind(this);
        this.getPendingRequests = this.getPendingRequests.bind(this);
        this.getRouteAnalysis = this.getRouteAnalysis.bind(this);
        this.getDepartments = this.getDepartments.bind(this);
    }
    fetchData(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const tables = {
                routes: this.getRoutes,
                departments: this.getDepartments,
                tripItinerary: this.getTripItinerary,
                pendingRequests: this.getPendingRequests,
                routeAnalysis: this.getRouteAnalysis
            };
            const { [table]: getData } = tables;
            return getData();
        });
    }
    static getWidth(key, long, short = 65) {
        let width = short;
        const longWidths = [
            'name', 'regNumber', 'location', 'head.name', 'department', 'departureTime',
            'requestedOn'
        ];
        if (longWidths.includes(key)) {
            width = long;
        }
        return width;
    }
    static defaultColumns(row, longWidth, shortWidth) {
        const keys = Object.keys(row);
        const columns = [];
        keys.map((key) => {
            const width = DataFromDB.getWidth(key, longWidth, shortWidth);
            columns.push({
                id: key, header: row[key], width, height: 40
            });
        });
        return columns;
    }
    static setMargins(left, right) {
        return {
            margins: {
                top: 40, bottom: 40, left, right
            }
        };
    }
    static setInUse(routes) {
        return routes.map((route) => {
            if (route.inUse === 0)
                route.inUse = '-';
            return route;
        });
    }
    static flattenTripsObject(trips) {
        return trips.map((trip) => {
            trip.rider = trip.rider.name;
            trip.requester = trip.requester.name || 'None';
            trip.approvedBy = (trip.approvedBy || {}).name || 'None';
            trip.confirmedBy = (trip.confirmedBy || {}).name || 'None';
            trip.requestedOn = trip.createdAt.toString();
            if (typeof (trip.departureTime) === 'string') {
                trip.departureTime = new Date(trip.departureTime).toString();
            }
            else {
                trip.departureTime = trip.departureTime.toString();
            }
            return trip;
        });
    }
    static flattenRoutesAnalyticsObject(routes) {
        return routes.map((route) => {
            route.date = route.batchUseDate.toString();
            route.name = route.batch.route.name || 'None';
            route.vehicle = route.batch.cabDetails.regNumber || 'None';
            route.time = route.batch.takeOff;
            route.batch = route.batch.batch || 'None';
            route.utilization = `${route.utilization}%`;
            route.rating = route.averageRating;
            return route;
        });
    }
    getRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = sequelizePaginationHelper_1.default.deserializeSort(this.sort);
            const pageable = { sort, page: 1, size: constants_1.MAX_INT };
            let { routes } = yield routeBatch_service_1.routeBatchService.getRoutes(pageable);
            routes = DataFromDB.setInUse(routes);
            const columnHeaders = {
                name: 'Name',
                batch: 'Batch',
                takeOff: 'TakeOff Time',
                capacity: 'Capacity',
                inUse: 'In Use',
                regNumber: 'Vehicle',
                status: 'Status'
            };
            const columns = DataFromDB.defaultColumns(columnHeaders, 120);
            const margins = DataFromDB.setMargins(25, 30);
            return { data: routes, columns, margins };
        });
    }
    getDepartments() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows: departments } = yield department_service_1.departmentService.getAllDepartments(constants_1.MAX_INT, 1, this.homebaseId);
            const columnHeaders = {
                name: 'Department', location: 'Location', 'head.name': 'Lead', status: 'Status'
            };
            const columns = DataFromDB.defaultColumns(columnHeaders, 140, 70);
            const margins = DataFromDB.setMargins(60, 60);
            return { data: departments, columns, margins };
        });
    }
    getTripItinerary(status = 'Confirmed') {
        return __awaiter(this, void 0, void 0, function* () {
            const pageable = { page: 1, size: constants_1.MAX_INT };
            const query = TripsController_1.default.getRequestQuery({ query: this.filterParams });
            const where = trip_service_1.default.sequelizeWhereClauseOption(Object.assign(Object.assign({}, query), { status }));
            const { trips } = yield trip_service_1.default.getTrips(pageable, where, this.homebaseId);
            const flattenedTrips = DataFromDB.flattenTripsObject(trips);
            const columnHeaders = {
                createdAt: 'Requested On',
                departureTime: 'Departing On',
                pickup: 'Pickup',
                destination: 'Destination',
                requester: 'Requested By',
                department: 'Department',
                rider: 'Rider',
                cost: 'Cost',
                approvedBy: 'Approved By',
                confirmedBy: 'Confirmed By'
            };
            const columns = DataFromDB.defaultColumns(columnHeaders, 85, 73);
            const margins = DataFromDB.setMargins(15, 10);
            return {
                data: flattenedTrips, columns, margins, orientation: 'landscape'
            };
        });
    }
    getPendingRequests() {
        return this.getTripItinerary('Pending');
    }
    getRouteAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = sequelizePaginationHelper_1.default.deserializeSort(this.sort);
            const pageable = { sort, page: 1, size: constants_1.MAX_INT };
            let routeTrips = yield RouteUseRecordService_1.default.getRouteTripRecords(pageable, this.homebaseId);
            const { data } = routeTrips;
            routeTrips = yield RouteUseRecordService_1.default.getAdditionalInfo(data);
            const flattenedRouteAnalytics = DataFromDB.flattenRoutesAnalyticsObject(routeTrips);
            const columnHeaders = {
                date: 'Date',
                name: 'Route Name',
                batch: 'Batch',
                time: 'Time',
                vehicle: 'Vehicle',
                utilization: 'Utilization',
                rating: 'Avg Rating'
            };
            const columns = DataFromDB.defaultColumns(columnHeaders, 120);
            const margins = DataFromDB.setMargins(25, 30);
            return { data: flattenedRouteAnalytics, columns, margins };
        });
    }
}
exports.DataFromDB = DataFromDB;
class ExportData {
    static createPDF(query, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { table: tableName } = query;
            const dataFromDB = new DataFromDB(query, homebaseId);
            const { data, columns, margins, orientation } = yield dataFromDB.fetchData(tableName);
            const otherParams = Object.assign({}, margins);
            if (orientation)
                otherParams.layout = orientation;
            const pdf = new pdfkit_1.default(Object.assign({ autoFirstPage: false }, otherParams));
            const table = new voilab_pdf_table_1.default(pdf, { bottomMargin: 30 });
            table
                .setColumnsDefaults({
                headerBorder: ['L', 'T', 'B', 'R'],
                headerPadding: [15, 0, 0, 5],
                border: ['L', 'T', 'B', 'R'],
                align: 'left',
                padding: [15, 0, 0, 5]
            })
                .addColumns(columns)
                .onPageAdded((newTable) => newTable.addHeader());
            pdf.font('Times-Roman', 10);
            pdf.addPage(Object.assign({}, otherParams));
            table.addBody(data);
            return pdf;
        });
    }
    static createCSV(query, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { table: tableName } = query;
            const dataFromDB = new DataFromDB(query, homebaseId);
            const { data, columns } = yield dataFromDB.fetchData(tableName);
            const columnsHeaders = ExportData.getColumnHeaders(columns);
            const newFormedData = ExportData.formNewRequiredData(data, columnsHeaders);
            return newFormedData;
        });
    }
    static filterRequired(obj, columnsHeaders) {
        const myDict = {};
        for (const key of columnsHeaders) {
            myDict[ExportData.formatHeaders(key)] = obj[key];
        }
        return myDict;
    }
    static formNewRequiredData(data, headers) {
        const newFormedData = data.map((objData) => ExportData.filterRequired(objData, headers));
        return newFormedData;
    }
    static formatHeaders(keyHeader) {
        const camelCaseWord = keyHeader.match(/[A-Z]/g);
        if (camelCaseWord) {
            const firstChar = `${keyHeader[0].toUpperCase()}`;
            const firstWordPiece = `${firstChar}${keyHeader.slice(1, keyHeader.indexOf(camelCaseWord[0]))}`;
            const lastWordPiece = `${keyHeader.slice(keyHeader.indexOf(camelCaseWord[0]), keyHeader.length)}`;
            const whollyWord = `${firstWordPiece} ${lastWordPiece}`;
            return whollyWord;
        }
        const strDotStr = keyHeader.match(/[.]/g);
        if (strDotStr) {
            if (keyHeader === 'head.name') {
                const whollyWord = 'Lead';
                return whollyWord;
            }
        }
        const firstWordPiece = `${keyHeader[0].toUpperCase()}`;
        const whollyWord = `${firstWordPiece}${keyHeader.slice(1, keyHeader.length)}`;
        return whollyWord;
    }
    static getColumnHeaders(columns) {
        const listOfHeaders = columns.map((obj) => obj.id);
        return listOfHeaders;
    }
}
exports.default = ExportData;
//# sourceMappingURL=ExportData.js.map