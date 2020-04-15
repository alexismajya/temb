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
const sequelize_1 = __importDefault(require("sequelize"));
const route_service_1 = require("./../../routes/route.service");
const routeBatch_service_1 = require("../routeBatch.service");
const route_batch_1 = __importDefault(require("../../../database/models/route-batch"));
const __mocks__1 = require("../../../services/__mocks__");
describe('RouteBatch service', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield route_service_1.routeService.createRoute({
            name: 'new name',
            imageUrl: 'ulr of the image',
            destinationId: 1,
        });
        yield routeBatch_service_1.routeBatchService.createRouteBatch({
            routeId: 1,
            capacity: 4,
            status: 'Active',
            takeOff: 'DD:DD',
            batch: 'A',
        });
    }));
    it('should create a RouteBatch', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(route_batch_1.default, 'create').mockResolvedValue(__mocks__1.mockRouteBatchData);
        const routeBatch = yield routeBatch_service_1.routeBatchService.createRouteBatch(__mocks__1.routeBatchObject);
        expect(routeBatch).toEqual(__mocks__1.mockRouteBatchData);
    }));
    it('should get a routeBatch by Id', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(route_batch_1.default, 'findByPk').mockResolvedValue(__mocks__1.routeBatchInstance[1]);
        const routeBatch = yield routeBatch_service_1.routeBatchService.findById(1);
        expect(routeBatch).toEqual(__mocks__1.routeBatchInstance[1].get({ plain: true }));
    }));
    it('should get RouteBatches', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(route_batch_1.default, 'findAll').mockResolvedValue([__mocks__1.routeBatchInstance[1]]);
        const routeBatchDetails = yield routeBatch_service_1.routeBatchService.getRouteBatches({ status: 'Active' });
        expect(routeBatchDetails).toEqual([__mocks__1.routeBatchInstance[1].get({ plain: true })]);
    }));
    it('should update a routeBatch record', () => __awaiter(void 0, void 0, void 0, function* () {
        const routeBatchDetails = yield routeBatch_service_1.routeBatchService.updateRouteBatch(1, { status: 'Inactive' });
        expect(routeBatchDetails).toHaveProperty('id', 1);
        expect(routeBatchDetails).toHaveProperty('status', 'Inactive');
    }));
    it('should get a RouteBatch record by Pk', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(route_batch_1.default, 'findByPk').mockResolvedValue(__mocks__1.routeBatchInstance[1]);
        const routeBatchDetails = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(1, true);
        expect(routeBatchDetails).toEqual(__mocks__1.routeBatchInstance[0].get());
    }));
    it('should delete a routeBatch record', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(route_batch_1.default, 'destroy').mockResolvedValue(2);
        const result = yield routeBatch_service_1.routeBatchService.deleteRouteBatch(1);
        expect(result).toEqual(2);
    }));
    describe('RouteService_getRoutes', () => {
        beforeEach(() => {
            jest
                .spyOn(route_batch_1.default, 'findAll')
                .mockResolvedValue([__mocks__1.routeBatchInstance[0]]);
            jest.spyOn(route_batch_1.default, 'count').mockResolvedValue(10);
            jest.spyOn(sequelize_1.default, 'fn').mockImplementation(() => 0);
        });
        it('should get', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield routeBatch_service_1.routeBatchService.getRoutes();
            expect(result).toEqual({
                pageMeta: {
                    page: 1, pageSize: 4294967295, totalPages: 1, totalResults: 10,
                },
                routes: [{
                        batch: 'A',
                        capacity: 1,
                        comments: 'EEEEEE',
                        destination: 'BBBBBB',
                        imageUrl: 'https://image-url',
                        inUse: 1,
                        name: 'ZZZZZZ',
                        regNumber: 'CCCCCC',
                        riders: __mocks__1.routeBatchInstance[0].get().riders,
                        status: 'Active',
                        takeOff: 'DD:DD',
                    }],
            });
        }));
    });
});
//# sourceMappingURL=routeBatch.service.test.js.map