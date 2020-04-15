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
const RouteHelper_1 = __importDefault(require("../RouteHelper"));
const route_service_1 = require("../../modules/routes/route.service");
const cab_service_1 = require("../../modules/cabs/cab.service");
const routeMock_1 = require("../__mocks__/routeMock");
const address_service_1 = require("../../modules/addresses/address.service");
const locations_1 = require("../../modules/locations");
const route_request_service_1 = __importDefault(require("../../modules/routes/route-request.service"));
const provider_service_1 = require("../../modules/providers/provider.service");
const routeBatch_service_1 = require("../../modules/routeBatches/routeBatch.service");
let status;
describe('Route Helpers', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('checkNumberValues', () => {
        it('should fail if value is not a non-zero integer', () => {
            const message = RouteHelper_1.default.checkNumberValues('string', 'someField');
            expect(message).toEqual(['someField must be a non-zero integer greater than zero']);
        });
    });
    describe('checkRequestProps', () => {
        it('should return missing fields', () => {
            const fields = RouteHelper_1.default.checkRequestProps({
                vehicle: 'APP 519 DT',
                routeName: 'Yaba',
                destination: ''
            });
            expect(fields).toEqual(', capacity, takeOffTime, provider');
        });
    });
    describe('checkThatVehicleRegNumberExists', () => {
        it('should return array containing results for the check', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cab_service_1.cabService, 'findByRegNumber').mockResolvedValue({ id: 1 });
            const result = yield RouteHelper_1.default.checkThatVehicleRegNumberExists('AR 3GN UMBR');
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toEqual(true);
        }));
        it('should return array containing with first element false when vehicle absent', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cab_service_1.cabService, 'findByRegNumber').mockResolvedValue(null);
            const result = yield RouteHelper_1.default.checkThatVehicleRegNumberExists('AR 3GN UMBR');
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toEqual(false);
        }));
    });
    describe('checkThatRouteNameExists', () => {
        it('should return array containing true/false', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(provider_service_1.providerService, 'getProviderById').mockResolvedValueOnce({});
            jest.spyOn(route_service_1.routeService, 'getRouteByName').mockResolvedValue({ id: 2 });
            const result = yield RouteHelper_1.default.checkThatProviderIdExists(1);
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toEqual(true);
        }));
        it('should return array containing results for the check', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_service_1.routeService, 'getRouteByName').mockResolvedValue({ id: 2 });
            const result = yield RouteHelper_1.default.checkThatRouteNameExists('Yaba');
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toEqual(true);
        }));
        it('should return array containing with first element false when route missing', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_service_1.routeService, 'getRouteByName').mockResolvedValue(null);
            const result = yield RouteHelper_1.default.checkThatRouteNameExists('Yaba');
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toEqual(false);
        }));
    });
    describe('duplicateRouteBatch', () => {
        it('should return the newly created batch object', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue(routeMock_1.routeBatch);
            jest.spyOn(RouteHelper_1.default, 'cloneBatchDetails').mockResolvedValue(routeMock_1.batch);
            const { batch: batchInfo, routeName } = yield RouteHelper_1.default.duplicateRouteBatch(1);
            expect(batchInfo.batch).toBe('B');
            expect(batchInfo.inUse).toBe(0);
            expect(routeName).toBe("O'Conner Roads");
        }));
        it('should not create batch if route batch does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue(null);
            const result = yield RouteHelper_1.default.duplicateRouteBatch(10);
            expect(result).toBe('Route does not exist');
        }));
    });
    describe('cloneBatchDetails', () => {
        it('should get the details for updated route batch', () => __awaiter(void 0, void 0, void 0, function* () {
            routeMock_1.batch.batch = 'F';
            jest.spyOn(route_service_1.routeService, 'createRouteBatch').mockReturnValue(routeMock_1.batch);
            const clonedBatch = yield RouteHelper_1.default.cloneBatchDetails(routeMock_1.routeBatch);
            expect(clonedBatch.batch).toEqual('F');
            expect(route_service_1.routeService.createRouteBatch).toHaveBeenCalled();
        }));
    });
    describe('batchObject', () => {
        it('add batch to routeBatch object', () => {
            const result = RouteHelper_1.default.batchObject(routeMock_1.routeBatch, 'A');
            expect(result).toEqual({
                batch: 'A',
                capacity: 4,
                status: 'Active',
                takeOff: '03:00'
            });
        });
    });
    describe('findPercentageUsage, findMaxOrMin', () => {
        it('should calculate and return dormant routes', () => {
            const result = RouteHelper_1.default.findPercentageUsage(routeMock_1.record, [], []);
            expect(result).toEqual(routeMock_1.returnNullPercentage);
        });
        it('should calculate and return percentages', () => {
            const result = RouteHelper_1.default.findPercentageUsage(routeMock_1.confirmedRecord, [], []);
            expect(result).toEqual(routeMock_1.returnedPercentage);
        });
    });
    describe('RouteHelper.pageDataObject', () => {
        it('should return an object of the route data', () => {
            const routesData = RouteHelper_1.default.pageDataObject(routeMock_1.routeResult);
            expect(routesData.pageMeta).toBeDefined();
            expect(routesData.pageMeta.totalPages).toBe(1);
            expect(routesData.pageMeta.totalResults).toBe(1);
            expect(routesData.pageMeta.pageSize).toBe(100);
        });
    });
    describe('validateRouteStatus', () => {
        it('should throw error if request is already approved', () => {
            status = RouteHelper_1.default.validateRouteStatus({ status: 'Approved' });
            expect(status).toEqual('This request has already been approved');
        });
        it('should throw error if request is already declined', () => {
            status = RouteHelper_1.default.validateRouteStatus({ status: 'Declined' });
            expect(status).toEqual('This request has already been declined');
        });
        it('should throw error if request is pending', () => {
            status = RouteHelper_1.default.validateRouteStatus({ status: 'Pending' });
            expect(status).toEqual('This request needs to be confirmed by the manager first');
        });
        it('should return true if request is confirmed', () => {
            status = RouteHelper_1.default.validateRouteStatus({ status: 'Confirmed' });
            expect(status).toEqual(true);
        });
    });
    describe('createNewRouteBatchFromSlack', () => {
        it('should create a new route batch from slack', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(RouteHelper_1.default, 'createNewRouteWithBatch').mockReturnValue([]);
            jest.spyOn(route_request_service_1.default, 'findByPk').mockReturnValue([]);
            const submission = {
                routeName: 'New Route',
                takeOffTime: '00:30',
                capacity: 10,
                providerId: 1
            };
            yield RouteHelper_1.default.createNewRouteBatchFromSlack(submission, 1);
            expect(RouteHelper_1.default.createNewRouteWithBatch).toHaveBeenCalled();
            done();
        }));
    });
    describe('createNewRouteWithBatch', () => {
        it('should create a new route batch', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const route = Object.assign({}, routeMock_1.singleRouteDetails);
            jest.spyOn(address_service_1.addressService, 'createNewAddress').mockReturnValue(routeMock_1.returnedAddress);
            jest.spyOn(route_service_1.routeService, 'createRoute').mockReturnValue({ route });
            jest.spyOn(route_service_1.routeService, 'createRouteBatch').mockResolvedValue(routeMock_1.batch);
            const result = yield RouteHelper_1.default.createNewRouteWithBatch(routeMock_1.newRouteWithBatchData);
            expect(route_service_1.routeService.createRouteBatch).toHaveBeenCalled();
            expect(result.route).toEqual(routeMock_1.singleRouteDetails);
            expect(result.batch).toEqual(routeMock_1.batch);
            done();
        }));
    });
    describe('checkThatAddressAlreadyExists', () => {
        it('should return true when address exists', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(address_service_1.addressService, 'findAddress').mockReturnValue(routeMock_1.returnedAddress);
            const result = yield RouteHelper_1.default.checkThatAddressAlreadyExists('Bus Provider');
            expect(address_service_1.addressService.findAddress).toHaveBeenCalledWith('Bus Provider');
            expect(result).toEqual(true);
            done();
        }));
        it('should return false when address does not exist', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(address_service_1.addressService, 'findAddress').mockReturnValue(null);
            const result = yield RouteHelper_1.default.checkThatAddressAlreadyExists('Bus Provider');
            expect(result).toEqual(false);
            done();
        }));
    });
    describe('checkThatLocationAlreadyExists', () => {
        it('should return true when location already exists', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(locations_1.locationService, 'findLocation').mockReturnValue(routeMock_1.returnedLocation);
            const result = yield RouteHelper_1.default.checkThatLocationAlreadyExists(routeMock_1.LocationCoordinates);
            expect(locations_1.locationService.findLocation).toHaveBeenCalledWith('-1.32424324', '1.34243535');
            expect(result).toEqual(true);
            done();
        }));
        it('should return false when location does not exist', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(locations_1.locationService, 'findLocation').mockReturnValue(null);
            const result = yield RouteHelper_1.default.checkThatLocationAlreadyExists(routeMock_1.LocationCoordinates);
            expect(result).toEqual(false);
            done();
        }));
    });
    describe('find most and least used Route', () => {
        const fakeArray = ['kisumu', 'kigali', 'kigali', 'kigali'];
        it('should return the most used route', () => {
            expect(RouteHelper_1.default.mostUsedRoute(fakeArray)).toEqual({
                mostUsedRoute: 'kigali',
                numberOfTimes: 3
            });
        });
        it('should return the least used route', () => {
            expect(RouteHelper_1.default.leastUsedRoute(fakeArray)).toEqual({
                leastUsedRoute: 'kisumu',
                numberOfLeastUsedTime: 1
            });
        });
        it('should return the percentage of each most and least used route', () => {
            expect(RouteHelper_1.default.mostLeastUsedRoutePercentage(3, 4)).toEqual('75.0');
        });
    });
});
//# sourceMappingURL=routeHelper.spec.js.map