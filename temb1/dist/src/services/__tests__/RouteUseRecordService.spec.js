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
const RouteUseRecordService_1 = __importDefault(require("../RouteUseRecordService"));
const database_1 = __importDefault(require("../../database"));
const batchUseRecord_service_1 = require("../../modules/batchUseRecords/batchUseRecord.service");
const constants_1 = require("../../helpers/constants");
const __mocks__1 = require("../__mocks__");
const { models: { RouteUseRecord } } = database_1.default;
describe('RouteUseRecordService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe('createRouteUseRecord', () => {
        it('should create create successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(RouteUseRecord, 'create').mockResolvedValue({ data: [] });
            yield RouteUseRecordService_1.default.create(1);
            expect(RouteUseRecord.create).toHaveBeenCalled();
        }));
    });
    describe('getRouteUseRecords', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should get getAll', () => __awaiter(void 0, void 0, void 0, function* () {
            const { itemsPerPage } = yield RouteUseRecordService_1.default.getAll({ page: 1, size: constants_1.MAX_INT }, {});
            expect(itemsPerPage).toEqual(4294967295);
        }));
        it('should get getAll', () => __awaiter(void 0, void 0, void 0, function* () {
            const { itemsPerPage } = yield RouteUseRecordService_1.default.getAll();
            expect(itemsPerPage).toEqual(4294967295);
        }));
    });
    describe('updateRouteUseRecord', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should updateRouteUseRecord', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(RouteUseRecord, 'update').mockResolvedValue();
            yield RouteUseRecordService_1.default.updateRouteUseRecord(1, {});
            expect(RouteUseRecord.update).toBeCalledWith(Object.assign({}), { returning: true, where: { id: 1 } });
        }));
    });
    describe('updateUsageStatistics', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should updateUsageStatistics', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'getBatchUseRecord')
                .mockResolvedValue({
                data: [{
                        userAttendStatus: 'Confirmed'
                    }, {
                        userAttendStatus: 'Skip'
                    }, {
                        userAttendStatus: 'NotConfirmed'
                    }, {
                        userAttendStatus: 'Pending'
                    },
                ]
            });
            jest.spyOn(RouteUseRecordService_1.default, 'updateRouteUseRecord').mockResolvedValue();
            yield RouteUseRecordService_1.default.updateUsageStatistics(1);
            expect(RouteUseRecordService_1.default.updateRouteUseRecord).toBeCalledTimes(1);
            expect(RouteUseRecordService_1.default.updateRouteUseRecord).toBeCalled();
            expect(yield RouteUseRecordService_1.default.updateRouteUseRecord).toBeCalledWith(1, {
                confirmedUsers: 1, pendingUsers: 1, skippedUsers: 1, unConfirmedUsers: 1
            });
        }));
    });
    describe('getAdditionalInfo', () => {
        it('should return an empty array when there is no trips', () => __awaiter(void 0, void 0, void 0, function* () {
            const routeTrips = yield RouteUseRecordService_1.default.getAdditionalInfo(__mocks__1.mockRecord);
            expect(routeTrips).toEqual([]);
        }));
    });
    it('should get average ratings and utilization for data', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(RouteUseRecordService_1.default, 'getAdditionalInfo')
            .mockResolvedValue([{ utilization: '0', averageRating: '4.00' }]);
        const routeTrips = yield RouteUseRecordService_1.default.getAdditionalInfo(__mocks__1.mockRecord);
        expect(routeTrips[0].utilization).toEqual('0');
        expect(routeTrips[0].averageRating).toEqual('4.00');
    }));
});
//# sourceMappingURL=RouteUseRecordService.spec.js.map