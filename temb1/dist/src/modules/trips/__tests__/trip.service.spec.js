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
const sequelize_1 = require("sequelize");
const trip_service_1 = __importStar(require("../trip.service"));
const database_1 = __importStar(require("../../../database"));
const __mocks__1 = require("./__mocks__");
const cache_1 = __importDefault(require("../../shared/cache"));
const __mocks__2 = require("../../../services/__mocks__");
describe(trip_service_1.TripService, () => {
    const testData = JSON.parse(process.env.TEST_DATA);
    afterAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        database_1.default.close().then(done, done);
    }));
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe(trip_service_1.TripService.prototype.sequelizeWhereClauseOption, () => {
        it('should return empty object when trip status and department is not being  passed', () => {
            const filterParams = {};
            const response = trip_service_1.default.sequelizeWhereClauseOption(filterParams);
            expect(response).toEqual({});
            expect(response).toBeTruthy();
        });
        it('should return trip status and deprartment when passed', () => {
            const status = 'Pending';
            const department = 'People';
            const filterParams = { status, department };
            const response = trip_service_1.default.sequelizeWhereClauseOption(filterParams);
            expect(response).toBeDefined();
            expect(response).toHaveProperty('tripStatus');
            expect(response).toHaveProperty('departmentName');
            expect(response.departmentName).toEqual('People');
            expect(response.tripStatus).toEqual('Pending');
        });
        it('should return trip department when it being passed', () => {
            const department = 'People';
            const filterParams = { department, dateFrom: '2018-01-11', dateTo: '2019-10-10' };
            const response = trip_service_1.default.sequelizeWhereClauseOption(filterParams);
            expect(response).toBeDefined();
            expect(response).toHaveProperty('departmentName');
            expect(response.departmentName).toEqual('People');
        });
        it('should filter by search term if provided', () => {
            const filterParams = { searchterm: 'searchterm' };
            const response = trip_service_1.default.sequelizeWhereClauseOption(filterParams);
            expect(response).toBeDefined();
            expect(response).toEqual({
                [sequelize_1.Op.or]: [
                    { '$requester.name$': { [sequelize_1.Op.iLike]: { [sequelize_1.Op.any]: ['%searchterm%'] } } },
                    { '$rider.name$': { [sequelize_1.Op.iLike]: { [sequelize_1.Op.any]: ['%searchterm%'] } } },
                    { '$origin.address$': { [sequelize_1.Op.iLike]: { [sequelize_1.Op.any]: ['%searchterm%'] } } },
                    { '$destination.address$': { [sequelize_1.Op.iLike]: { [sequelize_1.Op.any]: ['%searchterm%'] } } },
                ],
            });
        });
        it('should ignore filter by search term if empty', () => {
            const filterParams = { searchterm: '' };
            const response = trip_service_1.default.sequelizeWhereClauseOption(filterParams);
            expect(response).toBeDefined();
            expect(response).toEqual({});
        });
        it('should return trip type when it is passed', () => {
            const type = 'Embassy Visit';
            const filterParams = { type };
            const response = trip_service_1.default.sequelizeWhereClauseOption(filterParams);
            expect(response).toHaveProperty('tripType');
            expect(response.tripType).toEqual('Embassy Visit');
        });
        it('should return currentDay when it is passed', () => {
            const currentDay = 'This day';
            const filterParams = { currentDay };
            const response = trip_service_1.default.sequelizeWhereClauseOption(filterParams);
            expect(response).toHaveProperty('departureTime');
        });
    });
    describe(trip_service_1.TripService.prototype.getTrips, () => {
        const testTrip = new database_1.TripRequest({ id: 22 });
        beforeEach(() => {
            jest.spyOn(database_1.TripRequest, 'findAll').mockResolvedValue([{ get: () => testTrip }]);
            jest.spyOn(trip_service_1.default, 'serializeTripRequest').mockReturnValue({});
        });
        it('should return trip', () => __awaiter(void 0, void 0, void 0, function* () {
            const pageable = { page: 1, size: 100 };
            const where = {};
            const response = yield trip_service_1.default.getTrips(pageable, where, 1);
            expect(response).toHaveProperty('trips');
            expect(response).toHaveProperty('totalPages');
            expect(response).toHaveProperty('page');
            expect(response.trips).toEqual([expect.objectContaining({ id: testTrip.id })]);
        }));
        it('should return trips according to search parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const pageable = { page: 1, size: 100 };
            const where = { departmentName: 'TDD' };
            const response = yield trip_service_1.default.getTrips(pageable, where, 1);
            expect(response).toHaveProperty('trips');
            expect(response).toHaveProperty('totalPages');
            expect(response).toHaveProperty('page');
            expect(response.trips).toEqual([expect.objectContaining({ id: testTrip.id })]);
        }));
    });
    describe(trip_service_1.TripService.prototype.serializeTripRequest, () => {
        it('should return all valid trips property', () => {
            const response = trip_service_1.default.serializeTripRequest(testData.trips[0]);
            expect(response).toBeDefined();
            expect(typeof response).toEqual('object');
            expect(typeof response.name).toEqual('string');
            expect(typeof response.passenger).toEqual('number');
        });
    });
    describe(trip_service_1.TripService.prototype.checkExistence, () => {
        it('should return true if trip exists and false otherwise', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(database_1.TripRequest, 'count').mockResolvedValue(true);
            const truthy = yield trip_service_1.default.checkExistence(1);
            expect(truthy).toBe(true);
            jest.spyOn(database_1.TripRequest, 'count').mockResolvedValue(false);
            const falsy = yield trip_service_1.default.checkExistence(3);
            expect(falsy).toBe(false);
        }));
    });
    describe(trip_service_1.TripService.prototype.getById, () => {
        beforeAll(() => {
            cache_1.default.saveObject = jest.fn(() => { });
            cache_1.default.fetch = jest.fn((pk) => {
                if (pk === 'tripDetail_2') {
                    return { trip: __mocks__1.mockTrip };
                }
            });
        });
        it('should return a single trip from the database', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(database_1.TripRequest, 'findByPk').mockResolvedValue({ get: () => __mocks__1.mockTrip });
            const result = yield trip_service_1.default.getById(3, true);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('trip');
        }));
        it('should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield trip_service_1.default.getById(0);
            }
            catch (error) {
                expect(error.message).toBe('Could not return the requested trip');
            }
        }));
    });
    describe(trip_service_1.TripService.prototype.getAll, () => {
        it('should return all trips', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(database_1.TripRequest, 'findAll').mockResolvedValue([]);
            yield trip_service_1.default.getAll({ where: { tripStatus: 'Pending' } });
            expect(database_1.TripRequest.findAll).toBeCalled();
        }));
        it('should return all trips without where clause', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(database_1.TripRequest, 'findAll').mockResolvedValue([]);
            yield trip_service_1.default.getAll();
            expect(database_1.TripRequest.findAll).toBeCalled();
        }));
    });
    describe(trip_service_1.TripService.prototype.updateRequest, () => {
        it('should update a trip request', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield trip_service_1.default.updateRequest(testData.trips[0].id, {
                tripStatus: 'Confirmed',
            });
            expect(typeof result).toBe('object');
            expect(result.tripStatus).toEqual('Confirmed');
        }));
        it('should throw an error when trip request update fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const err = new Error('Error updating trip request');
            jest.spyOn(database_1.TripRequest, 'update').mockRejectedValue(new Error());
            try {
                yield trip_service_1.default.updateRequest(1, { tripStatus: 'Confirmed' });
            }
            catch (error) {
                expect(error).toEqual(err);
            }
        }));
    });
    describe(trip_service_1.TripService.prototype.getPaginatedTrips, () => {
        it('should get paginated trips', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield trip_service_1.default.getPaginatedTrips({}, 1);
            expect(response).toBeDefined();
            expect(response).toHaveProperty('data');
            expect(response).toHaveProperty('pageMeta');
        }));
    });
    describe(trip_service_1.TripService.prototype.getDateFilters, () => {
        it('should get date filters', () => {
            const dateFilters = trip_service_1.default.getDateFilters('testField', {
                before: new Date(),
                after: new Date(),
            });
            expect(dateFilters).toBeDefined();
            expect(dateFilters).toHaveProperty('testField');
        });
    });
    describe(trip_service_1.TripService.prototype.createRequest, () => {
        it('should create request', () => __awaiter(void 0, void 0, void 0, function* () {
            const trip = __mocks__2.getMockTrip({
                destinationId: testData.addresses[1].id,
                departmentId: testData.department.id,
                riderId: testData.users[2].id,
                noOfPassengers: 3,
            });
            const result = yield trip_service_1.default.createRequest(trip);
            expect(result.id).toBeDefined();
        }));
    });
});
//# sourceMappingURL=trip.service.spec.js.map