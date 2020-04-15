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
const googleMaps_1 = __importDefault(require("../../../services/googleMaps"));
const index_1 = __importDefault(require("../index"));
describe('GoogleMapsService', () => {
    let maps;
    beforeEach(() => {
        maps = new googleMaps_1.default();
        maps.client.placesNearby = jest.fn(() => ({
            asPromise: jest.fn(() => ({
                json: {
                    results: [
                        { geometry: { location: {} }, name: 'first' },
                        { geometry: { location: {} }, name: 'first' },
                        { geometry: { location: {} }, name: 'second' },
                        { geometry: { location: {} }, name: 'fast' }
                    ]
                },
            }))
        }));
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('findNearestBusStops', () => {
        it('should throw error on invalid location', () => {
            const mockCoordinates = jest.spyOn(index_1.default, 'coordinateStringToArray');
            expect(maps.findNearestBusStops('location')).rejects.toThrowError();
            expect(mockCoordinates).toHaveBeenCalledTimes(1);
        });
        it('should find nearest bus stops', () => {
            const mockCoordinates = jest.spyOn(index_1.default, 'coordinateStringToArray');
            expect(maps.findNearestBusStops('23,32')).resolves.toBeInstanceOf(Array);
            expect(mockCoordinates).toHaveBeenCalledTimes(1);
            expect(maps.findNearestBusStops('23,32')).resolves.toHaveLength(4);
            expect(mockCoordinates).toHaveBeenCalledTimes(2);
        });
        it('should map results to coordinates', () => __awaiter(void 0, void 0, void 0, function* () {
            const results = yield maps.findNearestBusStops('23,32');
            const coords = googleMaps_1.default.mapResultsToCoordinates(results);
            expect(coords).toHaveLength(4);
            expect(googleMaps_1.default.generateMarkers(results)).toHaveLength(4);
        }));
    });
});
//# sourceMappingURL=GoogleMaps.spec.js.map