import WebSocketEvents from '../web-socket-event.service';
import appEventService from '../app-event.service';
import Notifications from '../../slack/SlackPrompts/Notifications';
import TripNotifications from '../../slack/SlackPrompts/notifications/TripNotifications';
import TripJobs from '../../../services/jobScheduler/jobs/TripJobs';
import { ITripRequest } from '../../../database/models/interfaces/trip-request.interface';
import tripService from '../../trips/trip.service';
import { TripStatus } from '../../../database/models/trip-request';
import BugsnagHelper from '../../../helpers/bugsnagHelper';
import ManagerTripHelpers from '../../new-slack/trips/manager/trip.helpers';
import TripEventsHandlers from '../trip-events.handlers';
import socketIoMock from '../../slack/__mocks__/socket.ioMock';

export const mockTrip: ITripRequest = {
  id: 1,
  origin: { address: 'Kampala 1' },
  destination: { address: 'Kampala 2' },
  tripStatus: 'Confirmed',
  departureTime: new Date().toISOString(),
  noOfPassengers: 5,
  reason: 'Good',
  tripType: 'Regular',
  createdAt: new Date().toISOString(),
  distance: '45km',
  managerComment: 'come on',
  approvedById: 1,
  requestedById: 2,
};

describe(TripEventsHandlers, () => {
  const botToken = 'xoxp-12782892';
  const testData = { botToken, data: { id: 3 } };

  const errorTest = async (func: Function, args: any) => {
    jest.spyOn(BugsnagHelper, 'log').mockReturnValue(null);
    jest.spyOn(tripService, 'getById').mockRejectedValue('just fail bro');
    await func(args);
    expect(BugsnagHelper.log).toHaveBeenCalled();
  };

  beforeEach(() => {
    jest.spyOn(tripService, 'getById').mockImplementation((id) => ({
      ...mockTrip, id,
    }));
    jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
      () => (new WebSocketEvents(socketIoMock)),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should register trip events subscriptions', () => {
    jest.spyOn(appEventService, 'subscribe');
    TripEventsHandlers.init();
    expect(appEventService.subscribe).toHaveBeenCalled();
  });

  describe(TripEventsHandlers.handleTakeOffReminder, () => {
    it('should call send sendTripReminderNotifications', async () => {
      jest.spyOn(TripNotifications, 'sendTripReminderNotifications').mockResolvedValue(null);
      jest.spyOn(TripJobs, 'scheduleCompletionReminder').mockResolvedValue(null);
      await TripEventsHandlers.handleTakeOffReminder(testData);
      expect(TripNotifications.sendTripReminderNotifications).toHaveBeenCalledWith(
        expect.objectContaining({ id: 3 }), botToken,
      );
    });

    it('should handle the error', async () => {
      await errorTest(TripEventsHandlers.handleTakeOffReminder, testData);
    });
  });

  describe(TripEventsHandlers.handleNewTripCreated, () => {
    it('should schedule auto approve', async () => {
      jest.spyOn(TripJobs, 'scheduleAutoApprove').mockResolvedValue(null);
      jest.spyOn(ManagerTripHelpers, 'sendManagerTripRequestNotification').mockResolvedValue(null);
      await TripEventsHandlers.handleNewTripCreated(testData, 'newTrip');
      expect(ManagerTripHelpers.sendManagerTripRequestNotification)
        .toHaveBeenCalledWith(expect.objectContaining({ id: testData.data.id }),
        testData.botToken, 'newTrip');
      expect(TripJobs.scheduleAutoApprove).toHaveBeenCalled();
    });

    it('should handle the error', async () => {
      await errorTest(TripEventsHandlers.handleNewTripCreated, testData);
    });
  });

  describe(TripEventsHandlers.handleAutoApproval, () => {
    const mockTripGetById = (tripStatus: TripStatus) => (id: number) => ({
      ...mockTrip, id, tripStatus,
    });

    beforeEach(() => {
      jest.spyOn(Notifications, 'sendOpsApprovalNotification').mockResolvedValue(null);
    });

    it('should send message to ops', async () => {
      jest.spyOn(tripService, 'getById').mockImplementation(mockTripGetById(TripStatus.pending));
      await TripEventsHandlers.handleAutoApproval({ botToken, data: { id: 2 } });
      expect(Notifications.sendOpsApprovalNotification).toHaveBeenCalledWith(
        expect.objectContaining({ id: 2 }), botToken,
      );
    });

    it('should not send message to ops', async () => {
      jest.spyOn(tripService, 'getById').mockImplementation(mockTripGetById(TripStatus.confirmed));
      await TripEventsHandlers.handleAutoApproval({ botToken, data: { id: 3 } });
      expect(Notifications.sendOpsApprovalNotification).not.toHaveBeenCalled();
    });

    it('should handle the error', async () => {
      await errorTest(TripEventsHandlers.handleAutoApproval, testData);
    });
  });
});
