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
const TripInteractions_1 = __importDefault(require("../TripInteractions"));
const trip_service_1 = __importDefault(require("../../../../../trips/trip.service"));
const DialogPrompts_1 = __importDefault(require("../../../DialogPrompts"));
describe('TripInteractions', () => {
    describe('TripInteractions_tripCompleted', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should call TripInteractions.isOnTrip', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(TripInteractions_1.default, 'isOnTrip').mockReturnValue({});
            const payload = {
                actions: [{
                        name: 'still_on_trip'
                    }]
            };
            TripInteractions_1.default.tripCompleted(payload, {}, {});
            expect(TripInteractions_1.default.isOnTrip).toBeCalledTimes(1);
        }));
        it('should break if no action', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{
                        name: 'still_on_trip33'
                    }]
            };
            TripInteractions_1.default.tripCompleted(payload, {}, {});
        }));
        it('should call TripInteractions.hasNotTakenTrip', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(TripInteractions_1.default, 'hasNotTakenTrip').mockReturnValue({});
            const payload = {
                actions: [{
                        name: 'not_taken'
                    }]
            };
            TripInteractions_1.default.tripCompleted(payload, {}, {});
            expect(TripInteractions_1.default.hasNotTakenTrip).toBeCalledTimes(1);
        }));
        it('should call TripInteractions.hasCompletedTrip', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(TripInteractions_1.default, 'hasCompletedTrip').mockReturnValue({});
            const payload = {
                actions: [{
                        name: 'trip_taken'
                    }]
            };
            TripInteractions_1.default.tripCompleted(payload, {}, {});
            expect(TripInteractions_1.default.hasCompletedTrip).toBeCalledTimes(1);
        }));
    });
    describe('TripInteractions_hasTakenTrip', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should return a slack interactive message to ask whether trip has been taken', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{
                        value: 3,
                        name: 'still_on_trip'
                    }]
            };
            const respond = jest.fn();
            jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue({});
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue();
            yield TripInteractions_1.default.isOnTrip(payload, respond);
            expect(respond).toBeCalledWith(expect
                .objectContaining({ text: 'Okay! We\'ll check later.' }));
        }));
    });
    describe('TripInteractions_hasCompletedTrip', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should return an interactive message once a trip had been completed', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{
                        value: 2
                    }]
            };
            const respond = jest.fn(() => { });
            jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue({});
            yield TripInteractions_1.default.hasCompletedTrip(payload, respond);
            expect(trip_service_1.default.updateRequest).toBeCalledTimes(1);
            expect(respond).toBeCalled();
        }));
    });
    describe('TripInteractions_hasNotTakenTrip', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should send a dialog prompt when a trip has not been taken', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { actions: [{ value: 6 }] };
            const respond = jest.fn(() => { });
            jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue({});
            jest.spyOn(DialogPrompts_1.default, 'sendDialog').mockResolvedValue({});
            yield TripInteractions_1.default.hasNotTakenTrip(payload, respond);
            expect(trip_service_1.default.updateRequest).toBeCalledTimes(1);
            expect(trip_service_1.default.updateRequest).toBeCalledWith(6, { tripStatus: 'Cancelled' });
        }));
    });
    describe('TripInteractions_resonForNotTakingTrip', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should Return a slack interactive message after entering reason for not taking trip', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                submission: { tripNotTakenReason: 'I arrived late' },
                state: 4
            };
            const respond = jest.fn(() => { });
            jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue({});
            yield TripInteractions_1.default.reasonForNotTakingTrip(payload, respond);
            expect(respond).toBeCalled();
            expect(trip_service_1.default.updateRequest).toBeCalledTimes(1);
            expect(trip_service_1.default.updateRequest).toBeCalledWith(4, { tripNotTakenReason: 'I arrived late' });
        }));
    });
});
//# sourceMappingURL=TripINteractions.spec.js.map