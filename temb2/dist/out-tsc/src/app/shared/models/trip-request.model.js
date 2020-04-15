export var TripStatus;
(function (TripStatus) {
    TripStatus["APPROVED"] = "Approved";
    TripStatus["PENDING"] = "Pending";
    TripStatus["CONFIRMED"] = "Confirmed";
    TripStatus["OPSDECLINE"] = "DeclinedByOps";
    TripStatus["MANAGERDECLINE"] = "DeclinedByManager";
    TripStatus["CANCELLED"] = "Cancelled";
    TripStatus["COMPLETED"] = "Completed";
})(TripStatus || (TripStatus = {}));
var TripRequest = /** @class */ (function () {
    function TripRequest(id, status, type, passenger, department, destination, pickup, departureTime, requestedOn, rider, flightNumber, requester, approvedBy, confirmedBy, rating, operationsComment, managerComment, distance, approvalDate, provider, decliner) {
        this.id = id;
        this.status = status;
        this.type = type;
        this.passenger = passenger;
        this.department = department;
        this.destination = destination;
        this.pickup = pickup;
        this.departureTime = departureTime;
        this.requestedOn = requestedOn;
        this.rider = rider;
        this.flightNumber = flightNumber;
        this.requester = requester;
        this.approvedBy = approvedBy;
        this.confirmedBy = confirmedBy;
        this.rating = rating;
        this.operationsComment = operationsComment;
        this.managerComment = managerComment;
        this.distance = distance;
        this.approvalDate = approvalDate;
        this.provider = provider;
        this.decliner = decliner;
    }
    TripRequest.prototype.deserialize = function (input) {
        Object.assign(this, input);
        return this;
    };
    return TripRequest;
}());
export { TripRequest };
//# sourceMappingURL=trip-request.model.js.map