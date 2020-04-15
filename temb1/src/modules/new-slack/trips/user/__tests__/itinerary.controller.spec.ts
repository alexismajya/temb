import ItineraryController from '../itinerary.controller';
import ItineraryHelpers from '../itinerary.helpers';
import RescheduleHelper from '../reschedule.helper';
import { MarkdownText } from '../../../models/slack-block-models';

describe(ItineraryController, () => {
  const payload = {
    user: {
      id: 'UP0RTRL02',
    },
    actions:[{
      action_id: 'user_trip_reschedule_107',
      block_id: 'user_trip_itinerary_action_107',
      value: '107',
    }],
  };
  const respond = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(ItineraryController.start, () => {
    it('should send start itinerary trip message', () => {
      ItineraryController.start(payload, respond);
      expect(respond).toHaveBeenCalledTimes(1);
    });
  });

  describe(ItineraryController.getPast, () => {
    it('should send past trips message', async () => {
      jest.spyOn(ItineraryHelpers, 'getPastTripsMessage').mockReturnValueOnce(payload);
      await ItineraryController.getPast(payload, respond);
      expect(ItineraryHelpers.getPastTripsMessage).toHaveBeenCalledWith(payload);
    });
  });

  describe(ItineraryController.getUpcoming, () => {
    it('should send upcoming trips Message', async () => {
      jest.spyOn(ItineraryHelpers, 'getUpcomingTripsMessage').mockReturnValueOnce(payload);
      await ItineraryController.getUpcoming(payload, respond);
      expect(ItineraryHelpers.getUpcomingTripsMessage).toHaveBeenCalledWith(payload);
    });
  });

  describe(ItineraryController.handleRescheduleOrCancel, () => {
    const mockMessage = (text: string) => new MarkdownText(text);
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should send Trip reschedule dialog', async () => {
      const newPayload = { actions: [{ value: 172, action_id: 'user_trip_reschedule_172' }] };
      jest.spyOn(RescheduleHelper, 'sendTripRescheduleModal').mockResolvedValueOnce(null);

      await ItineraryController.handleRescheduleOrCancel(newPayload, respond);

      expect(RescheduleHelper.sendTripRescheduleModal).toHaveBeenCalledWith(newPayload,
        newPayload.actions[0].value);
    });

    it('should return appropriate message when trip cannot be rescheduled', async () => {
      const rsMock = mockMessage('reschedule');
      const newPayload = { actions: [{ value: 172, action_id: 'user_trip_reschedule_172' }] };
      jest.spyOn(RescheduleHelper, 'sendTripRescheduleModal').mockResolvedValueOnce(rsMock);

      await ItineraryController.handleRescheduleOrCancel(newPayload, respond);

      expect(RescheduleHelper.sendTripRescheduleModal).toHaveBeenCalledWith(newPayload,
        newPayload.actions[0].value);
      expect(respond).toHaveBeenCalledWith(rsMock);
    });

    it('should send cancel trip dialog', async () => {
      const newPayload = { actions: [{ value: 172, action_id: 'user_trip_cancel_trip_172' }] };
      jest.spyOn(ItineraryHelpers, 'cancelTrip').mockResolvedValueOnce(null);

      await ItineraryController.handleRescheduleOrCancel(newPayload, respond);

      expect(ItineraryHelpers.cancelTrip).toHaveBeenCalledWith(newPayload,
        newPayload.actions[0].value);
    });

    it('should return appropriate message when trip cannot be cancelled', async () => {
      const cancelMock = mockMessage('cancel');
      const newPayload = { actions: [{ value: 172, action_id: 'user_trip_cancel_trip_172' }] };
      jest.spyOn(ItineraryHelpers, 'cancelTrip').mockResolvedValueOnce(cancelMock);

      await ItineraryController.handleRescheduleOrCancel(newPayload, respond);

      expect(ItineraryHelpers.cancelTrip).toHaveBeenCalledWith(newPayload,
        newPayload.actions[0].value);
      expect(respond).toHaveBeenCalledWith(cancelMock);
    });
  });

  describe(ItineraryController.nextOrPrevPage, () => {
    it('should send nextOrPrevPage on past trips message', async () => {
      const newPayload = { actions: [{ value: 'pastTrips' }] };
      jest.spyOn(ItineraryHelpers, 'getPastTripsMessage').mockReturnValueOnce(payload);
      await ItineraryController.nextOrPrevPage(newPayload, respond);
      expect(ItineraryHelpers.getPastTripsMessage).toHaveBeenCalledWith(newPayload);
    });

    it('should send nextOrPrevPage on upcoming trips message', async () => {
      const newPayload = { actions: [{ value: 'upcomingTrips' }] };
      jest.spyOn(ItineraryHelpers, 'getUpcomingTripsMessage').mockReturnValueOnce(payload);
      await ItineraryController.nextOrPrevPage(newPayload, respond);
      expect(ItineraryHelpers.getUpcomingTripsMessage).toHaveBeenCalledWith(newPayload);
    });
  });

  describe(ItineraryController.skipPage, () => {
    it('should send skip page dialog', async () => {
      jest.spyOn(ItineraryHelpers, 'triggerPage').mockReturnValueOnce(payload);
      await ItineraryController.skipPage(payload, respond);
      expect(ItineraryHelpers.triggerPage).toHaveBeenCalledWith(payload);
    });
  });

  describe(ItineraryController.handleSkipPage, () => {
    it('should handle skip page', async () => {
      const newPayload = {
        team: { id: 'TPDKFR8TF', domain: 'tembeaherve' },
        user: { id: 'UP0RTRL02', name: 'herve.nkurikiyimfura', team_id: 'TPDKFR8TF' },
        submission: { pageNumber: '2' },
        callback_id: 'user_trip_skip_page',
        state: 'upcomingTrips',
        actions: [
          {
            action_id: 'user_trip_page_2',
            block_id: 'user_trip_pagination',
            value: 'upcomingTrips_page_2',
          },
        ],
      };
      jest.spyOn(ItineraryController, 'nextOrPrevPage').mockReturnValueOnce(null);
      await ItineraryController.handleSkipPage(newPayload, respond);
      expect(ItineraryController.nextOrPrevPage).toHaveBeenCalledTimes(1);
    });
  });
});
