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
const database_1 = __importDefault(require("../../../database"));
const batchUseRecord_service_1 = require("../batchUseRecord.service");
const constants_1 = require("../../../helpers/constants");
const __mocks__1 = require("../../../services/__mocks__");
const BatchUseRecordMock_1 = require("../../../helpers/__mocks__/BatchUseRecordMock");
const sequelizePaginationHelper_1 = __importDefault(require("../../../helpers/sequelizePaginationHelper"));
const { models: { BatchUseRecord } } = database_1.default;
describe('batchUseRecordService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('createBatchUseRecord', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it.only('should create createBatchUseRecord successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'getBatchUseRecord').mockResolvedValue({ data: [] });
            jest.spyOn(BatchUseRecord, 'create').mockResolvedValue({ get: () => ({ id: 1 }) });
            const result = yield batchUseRecord_service_1.batchUseRecordService.createBatchUseRecord({ id: 1 }, [{ id: 1 }]);
            expect(result.id).toEqual(1);
        }));
        it.only('should not create create Batch Use Record it aready exists for that day', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'getBatchUseRecord').mockResolvedValue({ data: [{ userId: 1, batchRecordId: 2 }] });
            jest.spyOn(BatchUseRecord, 'create').mockResolvedValue({ data: [] });
            yield batchUseRecord_service_1.batchUseRecordService.createBatchUseRecord(1, [{}]);
            expect(BatchUseRecord.create).toBeCalledTimes(0);
        }));
    });
    describe('getBatchUseRecord', () => {
        beforeEach(() => {
            const sequelizePaginationHelper = new sequelizePaginationHelper_1.default({}, {});
            jest.spyOn(sequelizePaginationHelper, 'getPageItems').mockResolvedValue({});
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'serializePaginatedData').mockReturnValue({
                data: [],
                pageMeta: {
                    itemsPerPage: 1, totalPages: 1, pageNo: 1, totalItems: 1,
                },
            });
        });
        it.only('should get getBatchUseRecord', () => __awaiter(void 0, void 0, void 0, function* () {
            const { pageMeta: { itemsPerPage } } = yield batchUseRecord_service_1.batchUseRecordService
                .getBatchUseRecord({ page: 1, size: constants_1.MAX_INT }, {});
            expect(itemsPerPage).toEqual(1);
        }));
        it.only('should get all batchRecords', () => __awaiter(void 0, void 0, void 0, function* () {
            const { pageMeta: { itemsPerPage } } = yield batchUseRecord_service_1.batchUseRecordService.getBatchUseRecord({}, {});
            expect(itemsPerPage).toEqual(1);
        }));
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
    });
    describe('getUserRouteRecord', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it.only('should get all route user record', () => __awaiter(void 0, void 0, void 0, function* () {
            const { userId, totalTrips, tripsTaken, } = yield batchUseRecord_service_1.batchUseRecordService.getUserRouteRecord(1);
            expect({
                userId,
                totalTrips,
                tripsTaken,
            }).toEqual({
                userId: 1,
                totalTrips: 0,
                tripsTaken: 0,
            });
        }));
    });
    describe('updateBatchUseRecord', () => {
        it.only('should updateBatchUseRecord', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(BatchUseRecord, 'update').mockResolvedValue([, [{
                        get: () => ({}),
                    }]]);
            yield batchUseRecord_service_1.batchUseRecordService.updateBatchUseRecord(1, {});
            expect(BatchUseRecord.update).toBeCalled();
        }));
    });
    describe('batchUseRecordService_serializeRouteBatch', () => {
        it.only('should return the required route info', () => {
            const response = batchUseRecord_service_1.batchUseRecordService.serializeRouteBatch(__mocks__1.routeData);
            expect(response).toEqual({
                batch: {
                    batchId: 1001, comments: 'Went to the trip', status: 'Activ', takeOff: '09:50',
                },
                cabDetails: {
                    cabId: 10,
                    driverName: 'Kafuuma Henry',
                    driverPhoneNo: 256772312456,
                    regNumber: 'UBE321A',
                },
                departureDate: '2018-05-03 09:50',
                id: 1,
                route: {
                    destination: {
                        address: '629 O\'Connell Flats',
                        locationId: 1002,
                    },
                    name: 'Hoeger Pine',
                    routeId: 1001,
                },
                routeId: 1001,
            });
        });
        it.only('should return empty object when there is no route', () => {
            const response = batchUseRecord_service_1.batchUseRecordService.serializeRouteBatch();
            expect(response).toEqual({});
        });
    });
    describe('batchUseRecordService_serializeBatchRecord', () => {
        it.only('should have all the properties a batch record', () => {
            const response = batchUseRecord_service_1.batchUseRecordService.serializeBatchRecord(__mocks__1.data);
            expect(response).toHaveProperty('userId');
            expect(response).toHaveProperty('rating');
            expect(response).toHaveProperty('user.email');
            expect(response).toHaveProperty('user.slackId');
            expect(response).toHaveProperty('routeUseRecord');
        });
    });
    describe('batchUseRecordService_getRoutesUsage', () => {
        it.only('should fetch all routes and batch records', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = [];
            const from = '2019-10-29';
            const to = '2019-10-30';
            const res = yield batchUseRecord_service_1.batchUseRecordService.getRoutesUsage(from, to);
            expect(res.rows).toEqual(mockData);
            expect(res.rowCount).toEqual(0);
        }));
    });
});
describe('BatchUseRecordHelper', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('BatchUseRecordHelper.serializePaginatedData', () => {
        it.only('BatchUseRecordHelper.serializePaginatedData', () => {
            const paginatedData = { data: [{
                        data: BatchUseRecordMock_1.data, route: BatchUseRecordMock_1.route, user: BatchUseRecordMock_1.rbUser
                    }], pageMeta: {} };
            const serializedData = batchUseRecord_service_1.batchUseRecordService.serializePaginatedData(paginatedData);
            expect(serializedData).toEqual({
                data: [
                    {
                        user: {
                            name: 'jamal',
                        },
                        routeUseRecord: {},
                    },
                ],
                pageMeta: {},
            });
        });
    });
});
//# sourceMappingURL=BatchUseRecordService.spec.js.map