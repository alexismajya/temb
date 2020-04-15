import WebSocketEvents from '../../../../events/web-socket-event.service';
import UserTripEditController from '../user-trip-edit-controller';
import {
  payload, allDepartments, homeBaseName, pickupSubmission, context,
  destinationSubmission,
} from '../__mocks__';
import Cache from '../../../../shared/cache';
import UserTripBookingController from '../user-trip-booking-controller';
import UserTripHelpers from '../user-trip-helpers';
import TripEventsHandlers from '../../../../events/trip-events.handlers';
import socketIoMock from '../../../../slack/__mocks__/socket.ioMock';

describe('UserTripEditController', () => {
  beforeEach(() => {
    jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
      () => (new WebSocketEvents(socketIoMock))
    );
  });
  describe('editRequest', () => {
    it('should edit request', () => {
      jest.spyOn(Cache, 'fetch').mockResolvedValue({});
      jest.spyOn(UserTripBookingController, 'fetchDepartments').mockResolvedValueOnce(
        allDepartments, homeBaseName
      );
      UserTripEditController.editRequest(payload);
      expect(Cache.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveEditRequestDetails', () => {
    it('should save Edit Request Details', () => {
      jest.spyOn(UserTripBookingController, 'saveRider').mockResolvedValue();
      jest.spyOn(UserTripBookingController, 'fetchDepartments').mockResolvedValueOnce(
        allDepartments
      );
      UserTripEditController.saveEditRequestDetails(payload, pickupSubmission, {}, context);
      expect(UserTripBookingController.saveRider).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveEditedDestination', () => {
    beforeEach(() => {
      jest.spyOn(UserTripHelpers, 'handleDestinationDetails').mockResolvedValueOnce();
    });

    it('should save Edited Destination when data are all valid', () => {
      UserTripEditController.saveEditedDestination(payload, destinationSubmission, {});
      expect(UserTripHelpers.handleDestinationDetails).toHaveBeenCalledTimes(1);
    });

    it('should not save Edited Destination when data is invalid', () => {
      UserTripEditController.saveEditedDestination({}, {}, {});
      expect(UserTripHelpers.handleDestinationDetails).toHaveBeenCalledTimes(2);
    });
  });
});
