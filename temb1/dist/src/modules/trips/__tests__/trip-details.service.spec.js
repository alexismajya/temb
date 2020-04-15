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
Object.defineProperty(exports, "__esModule", { value: true });
const trip_detail_service_1 = __importStar(require("../trip-detail.service"));
describe(trip_detail_service_1.TripDetailsService, () => {
    const tripDetail = {
        riderPhoneNo: '0781234567',
        travelTeamPhoneNo: '0781234567',
        flightNumber: '9AA09',
    };
    describe(trip_detail_service_1.TripDetailsService.prototype.createDetails, () => {
        it('should create an instance of trip details', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const trip = yield trip_detail_service_1.default.createDetails(tripDetail);
            expect(trip).toEqual(expect.objectContaining(tripDetail));
            done();
        }));
    });
});
//# sourceMappingURL=trip-details.service.spec.js.map