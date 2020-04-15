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
const trip_detail_service_1 = __importStar(require("../trip-detail.service"));
const database_1 = __importDefault(require("../../../database"));
const { models: { TripDetail } } = database_1.default;
describe(trip_detail_service_1.TripDetailsService, () => {
    const tripDetailInformation = {
        riderPhoneNo: '781234567',
        travelTeamPhoneNo: '781234567',
        flightNumber: '9777',
    };
    describe(trip_detail_service_1.TripDetailsService.prototype.createDetails, () => {
        it('should create trip with its details', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const trip = yield trip_detail_service_1.default.createDetails(tripDetailInformation);
            expect(typeof trip).toBe('object');
            expect(trip.riderPhoneNo).toEqual(tripDetailInformation.riderPhoneNo);
            expect(trip.travelTeamPhoneNo).toEqual(tripDetailInformation.travelTeamPhoneNo);
            expect(trip.flightNumber).toEqual(tripDetailInformation.flightNumber);
            done();
        }));
    });
});
//# sourceMappingURL=TripDetailsService.spec.js.map