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
const trip_service_1 = __importDefault(require("../trip.service"));
const database_1 = require("../../../database");
describe('TravelTripService', () => {
    describe(trip_service_1.default.getCompletedTravelTrips, () => {
        it('should return an empty list of travel trips if none ', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield trip_service_1.default.getCompletedTravelTrips(null, null, [], 1);
            expect(result).toEqual([]);
        }));
        it('should return a list of travel trips if any ', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield trip_service_1.default.getCompletedTravelTrips('2016-12-03', '2019-07-03', [
                'D0 Programs',
                'Technology',
            ], 1);
            expect(result).toEqual([]);
            const mockedTravelTrips = [
                {
                    departmentId: 3,
                    departmentName: 'People',
                    tripsCount: '1',
                    averageRating: '4.0000000000000000',
                    totalCost: '14',
                },
            ];
            jest.spyOn(database_1.TripRequest, 'findAll').mockResolvedValue(mockedTravelTrips);
            const result2 = yield trip_service_1.default.getCompletedTravelTrips('2019-12-03', '2018-07-03', [
                'D0 Programs',
                'Technology',
            ], 1);
            expect(result2).toEqual(mockedTravelTrips);
            expect(database_1.TripRequest.findAll).toBeCalled();
        }));
    });
});
//# sourceMappingURL=travelTripSrvice.spec.js.map