"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_socket_event_service_1 = __importDefault(require("../../../../events/web-socket-event.service"));
const user_trip_edit_controller_1 = __importDefault(require("../user-trip-edit-controller"));
const __mocks__1 = require("../__mocks__");
const cache_1 = __importDefault(require("../../../../shared/cache"));
const user_trip_booking_controller_1 = __importDefault(require("../user-trip-booking-controller"));
const user_trip_helpers_1 = __importDefault(require("../user-trip-helpers"));
const trip_events_handlers_1 = __importDefault(require("../../../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../../../slack/__mocks__/socket.ioMock"));
describe('UserTripEditController', () => {
    beforeEach(() => {
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    });
    describe('editRequest', () => {
        it('should edit request', () => {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({});
            jest.spyOn(user_trip_booking_controller_1.default, 'fetchDepartments').mockResolvedValueOnce(__mocks__1.allDepartments, __mocks__1.homeBaseName);
            user_trip_edit_controller_1.default.editRequest(__mocks__1.payload);
            expect(cache_1.default.fetch).toHaveBeenCalledTimes(1);
        });
    });
    describe('saveEditRequestDetails', () => {
        it('should save Edit Request Details', () => {
            jest.spyOn(user_trip_booking_controller_1.default, 'saveRider').mockResolvedValue();
            jest.spyOn(user_trip_booking_controller_1.default, 'fetchDepartments').mockResolvedValueOnce(__mocks__1.allDepartments);
            user_trip_edit_controller_1.default.saveEditRequestDetails(__mocks__1.payload, __mocks__1.pickupSubmission, {}, __mocks__1.context);
            expect(user_trip_booking_controller_1.default.saveRider).toHaveBeenCalledTimes(1);
        });
    });
    describe('saveEditedDestination', () => {
        beforeEach(() => {
            jest.spyOn(user_trip_helpers_1.default, 'handleDestinationDetails').mockResolvedValueOnce();
        });
        it('should save Edited Destination when data are all valid', () => {
            user_trip_edit_controller_1.default.saveEditedDestination(__mocks__1.payload, __mocks__1.destinationSubmission, {});
            expect(user_trip_helpers_1.default.handleDestinationDetails).toHaveBeenCalledTimes(1);
        });
        it('should not save Edited Destination when data is invalid', () => {
            user_trip_edit_controller_1.default.saveEditedDestination({}, {}, {});
            expect(user_trip_helpers_1.default.handleDestinationDetails).toHaveBeenCalledTimes(2);
        });
    });
});
//# sourceMappingURL=user-trip-edit-controller.spec.js.map