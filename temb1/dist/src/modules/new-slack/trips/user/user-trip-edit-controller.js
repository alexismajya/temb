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
const user_trip_helpers_1 = __importDefault(require("./user-trip-helpers"));
const interactions_1 = __importDefault(require("./interactions"));
const user_trip_booking_controller_1 = __importDefault(require("./user-trip-booking-controller"));
const cache_1 = __importDefault(require("../../../shared/cache"));
const ScheduleTripInputHandlers_1 = require("../../../../helpers/slack/ScheduleTripInputHandlers");
class UserTripEditController {
    static saveEditedDestination(payload, submission, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user_trip_helpers_1.default.handleDestinationDetails(payload.user, submission);
                yield interactions_1.default.sendPostDestinationMessage(payload, submission);
            }
            catch (err) {
                const errors = err.errors || { destination: 'An unexpected error occured' };
                return respond.error(errors);
            }
        });
    }
    static editRequest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripDetails = yield cache_1.default.fetch(ScheduleTripInputHandlers_1.getTripKey(payload.user.id));
            const { team: { id }, trigger_id: triggerId, response_url: responseUrl } = payload;
            const [allDepartments, homebaseName] = yield user_trip_booking_controller_1.default.fetchDepartments(payload.user.id, id);
            yield interactions_1.default.sendEditRequestModal(tripDetails, id, triggerId, responseUrl, allDepartments, homebaseName);
        });
    }
    static saveEditRequestDetails(payload, submission, respond, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rider, reason, passengers: chosenPassengers, department, date, time, pickup, othersPickup, } = submission;
            const { user } = payload;
            yield user_trip_booking_controller_1.default.saveRider(payload, rider);
            const forMe = user.id === rider;
            const passengers = parseInt(chosenPassengers, 10) + 1;
            const [allDepartments] = yield user_trip_booking_controller_1.default.fetchDepartments(payload.user.id, payload.team.id);
            const [{ value: departmentId }] = allDepartments.filter((e) => e.text === department);
            const toCache = {
                forMe, reason, passengers, department, departmentId
            };
            yield cache_1.default.saveObject(ScheduleTripInputHandlers_1.getTripKey(payload.user.id), toCache);
            const isEdit = true;
            yield user_trip_booking_controller_1.default.savePickupDetails(payload, {
                date, time, pickup, othersPickup,
            }, respond, context, isEdit);
        });
    }
}
exports.default = UserTripEditController;
//# sourceMappingURL=user-trip-edit-controller.js.map