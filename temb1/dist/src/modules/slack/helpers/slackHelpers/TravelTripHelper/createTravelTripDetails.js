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
const cache_1 = __importDefault(require("../../../../shared/cache"));
const utils_1 = __importDefault(require("../../../../../utils"));
exports.getTravelKey = (id) => `TRAVEL_REQUEST_${id}`;
exports.default = (payload, dateTimeType = 'flightDateTime') => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { id } } = payload;
    const { departmentId, departmentName, contactDetails, tripType } = yield cache_1.default.fetch(exports.getTravelKey(id));
    return Object.assign(Object.assign(Object.assign(Object.assign({ rider: contactDetails.rider, departmentId,
        departmentName,
        tripType }, contactDetails), { reason: 'Airport Transfer' }), payload.submission), { dateTime: utils_1.default.removeHoursFromDate(dateTimeType === 'flightDateTime' ? 3 : 2, payload.submission[dateTimeType]), forSelf: 'false', passengers: contactDetails.noOfPassengers });
});
//# sourceMappingURL=createTravelTripDetails.js.map