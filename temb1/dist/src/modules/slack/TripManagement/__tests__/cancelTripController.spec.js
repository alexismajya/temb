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
const CancelTripController_1 = __importDefault(require("../CancelTripController"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const database_1 = __importDefault(require("../../../../database"));
const { models: { TripRequest } } = database_1.default;
const mockTrip = {
    name: 'test trip',
    approvedById: 4,
    id: 1,
    origin: { address: 'Nairobi' },
    destination: { address: 'Thika' }
};
describe('cancel trip test', () => {
    beforeEach(() => {
        jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue();
        jest.spyOn(TripRequest, 'update').mockResolvedValue();
    });
    it('should return trip not found', () => __awaiter(void 0, void 0, void 0, function* () {
        trip_service_1.default.getById.mockResolvedValue(null);
        const result = yield CancelTripController_1.default.cancelTrip(300000000);
        expect(result.text).toBe('Trip not found');
    }));
    it('should return success', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(trip_service_1.default, 'getById')
            .mockImplementation(() => Promise.resolve(mockTrip));
        jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue({});
        const result = yield CancelTripController_1.default.cancelTrip(1);
        expect(trip_service_1.default.getById).toHaveBeenCalledWith(1);
        expect(trip_service_1.default.updateRequest).toHaveBeenCalledWith(1, { tripStatus: 'Cancelled' });
        expect(result.text).toBe('Success! Your Trip request from Nairobi to Thika has been cancelled');
    }));
    it('should handle error', () => __awaiter(void 0, void 0, void 0, function* () {
        const err = new Error('dummy message');
        trip_service_1.default.getById.mockRejectedValue(err);
        const result = yield CancelTripController_1.default.cancelTrip(1);
        expect(result.text).toBe(`Request could not be processed, ${err.message}`);
    }));
});
//# sourceMappingURL=cancelTripController.spec.js.map