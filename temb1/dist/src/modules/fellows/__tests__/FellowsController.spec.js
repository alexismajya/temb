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
const user_service_1 = __importDefault(require("../../users/user.service"));
const FellowsController_1 = __importDefault(require("../FellowsController"));
const batchUseRecord_service_1 = require("../../batchUseRecords/batchUseRecord.service");
const AISService_1 = __importDefault(require("../../../services/AISService"));
const FellowsControllerMock_1 = require("../__mocks__/FellowsControllerMock");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
describe('FellowsController', () => {
    let req = {
        query: {
            size: 2,
            page: 1
        },
        headers: { homebaseid: 1 }
    };
    let res;
    beforeEach(() => {
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    describe('getAllFellows', () => {
        it('should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
            req = Object.assign(Object.assign({}, req), { query: {
                    size: 'meshack'
                } });
            jest.spyOn(user_service_1.default, 'getPagedFellowsOnOrOffRoute')
                .mockRejectedValue(new Error('no size'));
            const spy = jest.spyOn(bugsnagHelper_1.default, 'log').mockImplementation(jest.fn());
            yield FellowsController_1.default.getAllFellows(req, res);
            expect(spy).toBeCalledWith(new Error('no size'));
        }));
        it('returns empty data response if no fellows', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getPagedFellowsOnOrOffRoute').mockResolvedValue(FellowsControllerMock_1.fellows);
            yield FellowsController_1.default.getAllFellows(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Request was successful',
                data: {
                    fellows: [],
                    pageMeta: FellowsControllerMock_1.fellows.pageMeta
                }
            });
        }));
        it('returns data if fellows on route', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(FellowsController_1.default, 'mergeFellowData').mockResolvedValue(FellowsControllerMock_1.finalUserDataMock);
            jest.spyOn(user_service_1.default, 'getPagedFellowsOnOrOffRoute').mockResolvedValue(FellowsControllerMock_1.fellowMockData);
            yield FellowsController_1.default.getAllFellows(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Request was successful',
                data: {
                    fellows: [FellowsControllerMock_1.finalUserDataMock],
                    pageMeta: {
                        currentPage: 1,
                        limit: 1,
                        totalItems: 5,
                        totalPages: 5,
                    }
                }
            });
        }));
        it('returns data of fellows not on route', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(FellowsController_1.default, 'mergeFellowData').mockResolvedValue(FellowsControllerMock_1.finalUserDataMock);
            jest.spyOn(user_service_1.default, 'getPagedFellowsOnOrOffRoute').mockResolvedValue(FellowsControllerMock_1.fellowMockData2);
            yield FellowsController_1.default.getAllFellows(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
        }));
        afterEach(() => {
            jest.restoreAllMocks();
            jest.resetAllMocks();
        });
    });
    describe('mergeFellowData', () => {
        it('Returns merged fellows data ', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'getUserRouteRecord').mockResolvedValue(FellowsControllerMock_1.userMock);
            jest.spyOn(AISService_1.default, 'getUserDetails').mockResolvedValue(FellowsControllerMock_1.aisMock);
            const result = yield FellowsController_1.default.mergeFellowData(req, res);
            expect(result).toEqual(FellowsControllerMock_1.finalUserDataMock);
        }));
    });
    describe('FellowsController_getFellowRouteActivity', () => {
        let mockedData;
        beforeEach(() => {
            req = Object.assign(Object.assign({}, req), { query: {
                    page: 1,
                    size: 2,
                    id: 15
                } });
            mockedData = {
                data: FellowsControllerMock_1.data,
                pageMeta: {
                    totalPages: 1,
                    pageNo: 1,
                    totalItems: 7,
                    itemsPerPage: 5
                }
            };
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'getBatchUseRecord').mockResolvedValue(mockedData);
        });
        it('should return an array of fellow route activity', () => __awaiter(void 0, void 0, void 0, function* () {
            yield FellowsController_1.default.getFellowRouteActivity(req, res);
            expect(batchUseRecord_service_1.batchUseRecordService.getBatchUseRecord).toHaveBeenCalled();
            expect(batchUseRecord_service_1.batchUseRecordService.getBatchUseRecord).toHaveBeenCalledWith({
                page: 1,
                size: 2
            }, { userId: 15, homebaseId: 1 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.status().json).toHaveBeenCalledTimes(1);
        }));
        it('should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'getBatchUseRecord').mockRejectedValue(new Error('dummy error'));
            yield FellowsController_1.default.getFellowRouteActivity(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({
                message: 'dummy error',
                success: false
            });
        }));
        afterEach(() => {
            jest.restoreAllMocks();
            jest.resetAllMocks();
        });
    });
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });
});
//# sourceMappingURL=FellowsController.spec.js.map