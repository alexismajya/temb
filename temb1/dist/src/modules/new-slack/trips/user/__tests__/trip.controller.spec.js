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
const trip_helpers_1 = __importDefault(require("../trip.helpers"));
const trip_controller_1 = __importDefault(require("../trip.controller"));
const user_trip_mocks_1 = require("../__mocks__/user-trip-mocks");
describe(trip_controller_1.default, () => {
    const respond = jest.fn();
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(trip_controller_1.default.launch, () => {
        it('should call TripHelpers.getWelcomeMessage', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_helpers_1.default, 'getWelcomeMessage').mockReturnValue({});
            const req = { body: { user_id: 'UP0RTRL02' } };
            const res = { status: jest.fn(() => ({
                    json: jest.fn(),
                })) };
            yield trip_controller_1.default.launch(req, res);
            expect(trip_helpers_1.default.getWelcomeMessage).toHaveBeenCalledWith('UP0RTRL02');
        }));
    });
    describe(trip_controller_1.default.changeLocation, () => {
        it('should show locations to change', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_helpers_1.default, 'changeLocation').mockReturnValueOnce(user_trip_mocks_1.payload);
            yield trip_controller_1.default.changeLocation(user_trip_mocks_1.payload, respond);
            expect(trip_helpers_1.default.changeLocation).toHaveBeenCalledWith(user_trip_mocks_1.payload);
        }));
    });
    describe(trip_controller_1.default.selectLocation, () => {
        it('should enable selection of a location', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_helpers_1.default, 'selectLocation').mockReturnValueOnce(user_trip_mocks_1.payload);
            yield trip_controller_1.default.selectLocation(user_trip_mocks_1.payload, respond);
            expect(trip_helpers_1.default.selectLocation).toHaveBeenCalledWith(user_trip_mocks_1.payload);
        }));
    });
});
//# sourceMappingURL=trip.controller.spec.js.map