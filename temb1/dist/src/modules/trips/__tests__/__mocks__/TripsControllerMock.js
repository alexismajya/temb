"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TripConfirmFailMock = { success: false, message: 'failed' };
exports.TripConfirmFailMock = TripConfirmFailMock;
const TotalFail = {
    message: 'Dang, something went wrong there.',
    success: false
};
exports.TotalFail = TotalFail;
const TripConfirmSuccessMock = {
    success: true,
    message: 'trip confirmed'
};
exports.TripConfirmSuccessMock = TripConfirmSuccessMock;
const TripDeclineSuccessMock = {
    success: true,
    message: 'trip declined'
};
exports.TripDeclineSuccessMock = TripDeclineSuccessMock;
//# sourceMappingURL=TripsControllerMock.js.map