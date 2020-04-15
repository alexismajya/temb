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
const UserInputValidator_1 = __importDefault(require("../../../helpers/slack/UserInputValidator"));
const Validators_1 = __importDefault(require("../../../helpers/slack/UserInputValidator/Validators"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const address_service_1 = require("../../addresses/address.service");
const trip_detail_service_1 = __importDefault(require("../../trips/trip-detail.service"));
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const homebase_service_1 = require("../../homebases/homebase.service");
class ScheduleTripController {
    static validateTravelContactDetailsForm(payload) {
        const errors = [];
        errors.push(...UserInputValidator_1.default.validateTravelContactDetails(payload));
        return errors;
    }
    static validateTravelDetailsForm(payload, tripType, status = 'standard') {
        return __awaiter(this, void 0, void 0, function* () {
            const { submission } = payload;
            const travelDateTime = submission.flightDateTime || submission.embassyVisitDateTime;
            const dateFieldName = tripType === 'embassy' ? 'embassyVisitDateTime' : 'flightDateTime';
            const allowedHours = tripType === 'embassy' ? 3 : 4;
            return ScheduleTripController.passedStatus(submission, payload, status, travelDateTime, dateFieldName, allowedHours);
        });
    }
    static passedStatus(submission, payload, status, travelDateTime, dateFieldName, allowedHours) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            if (status === 'pickup' || status === 'destination') {
                errors.push(...yield UserInputValidator_1.default.validatePickupDestinationEntry(payload, status, dateFieldName, travelDateTime, allowedHours));
            }
            else {
                errors.push(...UserInputValidator_1.default.validateTravelFormSubmission(submission));
                errors.push(...yield UserInputValidator_1.default.validateDateAndTimeEntry(payload, dateFieldName));
                errors.push(...UserInputValidator_1.default.validateLocationEntries(payload));
                errors.push(...Validators_1.default.checkDateTimeIsHoursAfterNow(allowedHours, travelDateTime, dateFieldName));
                errors.push(...Validators_1.default.validateDialogSubmission(payload));
            }
            return errors;
        });
    }
    static validateTripDetailsForm(payload, typeOfDialogBox) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            try {
                errors.push(...Validators_1.default.validateDialogSubmission(payload));
                if (typeOfDialogBox === 'pickup') {
                    errors.push(...UserInputValidator_1.default
                        .validatePickupDestinationLocationEntries(payload, typeOfDialogBox));
                    errors.push(...yield UserInputValidator_1.default.validateDateAndTimeEntry(payload));
                }
                else if (typeOfDialogBox === 'destination') {
                    errors.push(...UserInputValidator_1.default
                        .validatePickupDestinationLocationEntries(payload, typeOfDialogBox));
                }
                return errors;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw error;
            }
        });
    }
    static getIdFromLocationInfo(lat, lng, place, othersPlace) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            const unknownPlace = place === 'Others';
            const address = unknownPlace ? othersPlace : place;
            if (lat && lng) {
                result = yield address_service_1.addressService.findOrCreateAddress(address, { longitude: lng, latitude: lat });
                return result;
            }
            result = yield address_service_1.addressService.findOrCreateAddress(address);
            return result;
        });
    }
    static getLocationIds(tripRequestDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { destination, pickup, othersPickup, othersDestination, pickupLat, pickupLong, destinationCoords, destinationLat, destinationLong, pickupId } = tripRequestDetails;
            if (pickupId && destinationCoords) {
                return { originId: pickupId, destinationId: destinationCoords.id };
            }
            const { id: originId } = yield ScheduleTripController
                .getIdFromLocationInfo(pickupLat, pickupLong, pickup, othersPickup);
            const { id: destinationId } = yield ScheduleTripController
                .getIdFromLocationInfo(destinationLat, destinationLong, destination, othersDestination);
            return { originId, destinationId };
        });
    }
    static createRequestObject(tripRequestDetails, requester) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reason, dateTime, departmentId, destination, pickup, tripNote, othersPickup, othersDestination, passengers, tripType, distance } = tripRequestDetails;
                const { originId, destinationId } = yield ScheduleTripController
                    .getLocationIds(tripRequestDetails);
                const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(requester.slackId);
                const pickupName = `${pickup === 'Others' ? othersPickup : pickup}`;
                const destinationName = `${destination === 'Others' ? othersDestination : destination}`;
                return {
                    riderId: requester.id,
                    name: `From ${pickupName} to ${destinationName} on ${dateTime}`,
                    reason,
                    departmentId,
                    tripStatus: 'Pending',
                    departureTime: dateTime,
                    requestedById: requester.id,
                    originId,
                    destinationId,
                    noOfPassengers: passengers,
                    tripType,
                    tripNote,
                    distance,
                    homebaseId: homebase.id
                };
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw error;
            }
        });
    }
    static createRequest(payload, tripRequestDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user: { id: slackUserId }, team: { id: teamId } } = payload;
                const requester = yield slackHelpers_1.default.findOrCreateUserBySlackId(slackUserId, teamId);
                const request = yield ScheduleTripController
                    .createRequestObject(tripRequestDetails, requester);
                if (tripRequestDetails.forMe === false) {
                    const { rider } = tripRequestDetails;
                    const passenger = yield slackHelpers_1.default.findOrCreateUserBySlackId(rider, teamId);
                    request.riderId = passenger.id;
                }
                return request;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw error;
            }
        });
    }
    static createTravelTripRequest(payload, tripDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripRequest = yield ScheduleTripController.createRequest(payload, tripDetails);
                const { id } = yield ScheduleTripController.createTripDetail(tripDetails);
                const tripData = Object.assign(Object.assign({}, tripRequest), { tripDetailId: id });
                const trip = yield trip_service_1.default.createRequest(tripData);
                return trip_service_1.default.getById(trip.id, true);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw error;
            }
        });
    }
    static createTripDetail(tripInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { riderPhoneNo, travelTeamPhoneNo, flightNumber } = tripInfo;
                const tripDetail = yield trip_detail_service_1.default.createDetails(riderPhoneNo, travelTeamPhoneNo, flightNumber);
                return tripDetail;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw error;
            }
        });
    }
}
exports.default = ScheduleTripController;
//# sourceMappingURL=ScheduleTripController.js.map