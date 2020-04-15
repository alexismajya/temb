"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trip_request_1 = require("../models/trip-request");
const moment_1 = __importDefault(require("moment"));
const utils_1 = __importDefault(require("../../utils"));
class TripRequestViewModel {
    constructor(trip) {
        this.trip = trip;
    }
    serializeAddress(address) {
        if (address)
            return address.address;
        return '';
    }
    serializeUser(user) {
        if (user) {
            const { email, slackId, name = utils_1.default.getNameFromEmail(email) } = user;
            return { name, email, slackId };
        }
    }
    serializeProvider(provider) {
        if (provider) {
            return {
                name: provider.name,
                email: provider.user ? provider.user.email : '',
                phoneNumber: provider.user ? provider.user.phoneNo : '',
            };
        }
    }
    get id() { return this.trip.id; }
    get name() { return this.trip.name; }
    get status() { return this.trip.tripStatus; }
    get arrivalTime() { return this.trip.arrivalTime; }
    get type() { return this.trip.tripType; }
    get approvalDate() { return this.trip.approvalDate; }
    get cab() { return this.trip.cab; }
    get driver() { return this.trip.driver; }
    get homebase() { return this.trip.homebase; }
    get rating() { return this.trip.rating; }
    get operationsComment() { return this.trip.operationsComment; }
    get managerComment() { return this.trip.managerComment; }
    get distance() { return this.trip.distance; }
    get cabId() { return this.trip.cabId; }
    get driverId() { return this.trip.driverId; }
    get passenger() { return this.trip.noOfPassengers; }
    get departureTime() {
        return moment_1.default(this.trip.departureTime, 'YYYY-MM-DD HH:mm:ss').toISOString();
    }
    get requestedOn() { return this.trip.createdAt; }
    get department() {
        if (this.trip.department)
            return this.trip.department.name;
        return '';
    }
    get destination() { return this.serializeAddress(this.trip.destination); }
    get pickup() { return this.serializeAddress(this.trip.origin); }
    get flightNumber() {
        const { tripType } = this.trip;
        if (tripType === trip_request_1.TripTypes.airportTransfer) {
            const { tripDetail } = this.trip;
            if (!tripDetail)
                return '-';
            const { flightNumber } = tripDetail;
            return flightNumber || '-';
        }
    }
    get decliner() { return this.serializeUser(this.trip.decliner); }
    get rider() { return this.serializeUser(this.trip.decliner); }
    get requester() { return this.serializeUser(this.trip.requester); }
    get approvedBy() { return this.serializeUser(this.trip.approver); }
    get confirmedBy() { return this.serializeUser(this.trip.confirmer); }
    get provider() { return this.serializeProvider(this.trip.provider); }
}
exports.TripRequestViewModel = TripRequestViewModel;
//# sourceMappingURL=trip-request.viewmodel.js.map