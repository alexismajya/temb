"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var managerTripActions;
(function (managerTripActions) {
    managerTripActions["approve"] = "user_trip_manager_approve";
    managerTripActions["decline"] = "user_trip_manager_decline";
    managerTripActions["reasonSubmission"] = "user_trip_manager_reason";
    managerTripActions["editApprovedTrip"] = "user_trip_manager_edit";
    managerTripActions["confirmApprovedTrip"] = "user_trip_manager_confirm";
})(managerTripActions || (managerTripActions = {}));
var managerTripBlocks;
(function (managerTripBlocks) {
    managerTripBlocks["confirmTripRequest"] = "MANAGER_CONFIRM_TRIP_REQUEST";
})(managerTripBlocks = exports.managerTripBlocks || (exports.managerTripBlocks = {}));
exports.default = managerTripActions;
//# sourceMappingURL=constants.js.map