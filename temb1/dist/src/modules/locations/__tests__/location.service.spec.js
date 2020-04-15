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
Object.defineProperty(exports, "__esModule", { value: true });
const location_service_1 = require("../location.service");
const location_service_2 = require("../__mocks__/location.service");
const logger_1 = require("../../shared/logging/__mocks__/logger");
describe(location_service_1.LocationService, () => {
    let locationService;
    let testLocation;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        locationService = new location_service_1.LocationService(location_service_2.mockLocationRepo, logger_1.mockLogger);
        const loc = { longitude: -1.2345, latitude: 1.5673 };
        const [result] = yield location_service_2.mockLocationRepo.findOrCreate({
            where: { id: 1 },
            defaults: loc,
        });
        testLocation = result.get();
    }));
    describe(location_service_1.LocationService.prototype.findLocation, () => {
        it('should raise error when having invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(locationService.findLocation(-1, null, true)).rejects.toThrowError();
        }));
        it('should find location', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield locationService.findLocation(testLocation.longitude, testLocation.latitude, true);
            expect(result).toEqual(expect.objectContaining(testLocation));
        }));
    });
    describe(location_service_1.LocationService.prototype.createLocation, () => {
        it('should create a new loaction', () => __awaiter(void 0, void 0, void 0, function* () {
            const newLocation = { long: 23.45, lat: 27.99 };
            const result = yield locationService.createLocation(newLocation.long, newLocation.lat);
            expect(result).toEqual(expect.objectContaining({
                longitude: newLocation.long,
                latitude: newLocation.lat,
            }));
        }));
        it('should throw error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(logger_1.mockLogger, 'log');
            yield locationService.createLocation(null, null);
            expect(logger_1.mockLogger.log).toHaveBeenCalled();
        }));
    });
    describe(location_service_1.LocationService.prototype.getLocationById, () => {
        it('should retrun location with specified id', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield locationService.getLocationById(testLocation.id);
            expect(result).toEqual(expect.objectContaining({
                id: testLocation.id,
                longitude: testLocation.longitude,
                latitude: testLocation.latitude,
            }));
        }));
    });
});
//# sourceMappingURL=location.service.spec.js.map