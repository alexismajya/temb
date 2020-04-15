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
const homebase_service_1 = require("../../../../homebases/homebase.service");
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const user_trip_mocks_1 = require("../__mocks__/user-trip-mocks");
describe(trip_helpers_1.default, () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(trip_helpers_1.default.getWelcomeMessage, () => {
        it('should get the welcome message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_helpers_1.default, 'getWelcomeMessage').mockReturnValue(user_trip_mocks_1.payload);
            yield trip_helpers_1.default.getWelcomeMessage('UP0RTRL02');
            expect(trip_helpers_1.default.getWelcomeMessage).toHaveBeenCalledWith('UP0RTRL02');
        }));
    });
    describe(trip_helpers_1.default.changeLocation, () => {
        it('should get all home bases locations', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_service_1.homebaseService, 'getAllHomebases').mockReturnValueOnce(user_trip_mocks_1.homeBases);
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(user_trip_mocks_1.userHomeBase);
            yield trip_helpers_1.default.changeLocation(user_trip_mocks_1.payload);
            expect(homebase_service_1.homebaseService.getAllHomebases).toHaveBeenCalledWith(true);
            expect(homebase_service_1.homebaseService.getHomeBaseBySlackId).toHaveBeenCalledWith('UP0RTRL02');
        }));
    });
    describe(trip_helpers_1.default.selectLocation, () => {
        it('should update a location', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'updateDefaultHomeBase').mockReturnValueOnce(user_trip_mocks_1.payload);
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(user_trip_mocks_1.userHomeBase);
            yield trip_helpers_1.default.selectLocation(user_trip_mocks_1.payload);
            expect(user_service_1.default.updateDefaultHomeBase).toHaveBeenCalledWith('UP0RTRL02', 107);
            expect(homebase_service_1.homebaseService.getHomeBaseBySlackId).toHaveBeenCalledWith('UP0RTRL02', true);
        }));
    });
});
//# sourceMappingURL=trip.helpers.spec.js.map