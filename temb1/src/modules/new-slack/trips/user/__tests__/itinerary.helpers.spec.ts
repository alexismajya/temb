import ItineraryHelpers from '../itinerary.helpers';
import TripItineraryHelper from '../../../../slack/helpers/slackHelpers/TripItineraryHelper';
import { TRIP_LIST_TYPE } from '../../../../../helpers/constants';
import tripService from '../../../../trips/trip.service';
import DialogPrompts from '../../../../slack/SlackPrompts/DialogPrompts';
import { SlackText } from '../../../models/slack-block-models';
import { TripRequest } from '../../../../../database';
import PaginationHelpers from '../../../helpers/pagination-helpers';

describe(ItineraryHelpers, () => {
  const user = {
    id: 3,
    name: 'New User',
    slackId: 'UN5FDBM2D',
    email: 'newuser2@gmail.com',
    createdAt: '2019-09-10',
    updatedAt: '2019-09-10',
  };
  const tripData = {
    id: 9,
    name: 'From Nairobi to Kigali',
    tripStatus: 'Completed',
    distance: '9.4 km',
    departureTime: '2019-10-22T20:00:00.000Z',
    arrivalTime: '',
    requestedById: user.id,
    approvedById: user.id,
    requester: { name: 'New User', slackId: 'UN5FDBM2D' },
    origin: { address: 'Safari Park Hotel' },
    destination: { address: 'Lymack Suites' },
    rider: { name: 'New User' },
  };

  const payload = {
    user: {
      id: 'UN5FDBM2D',
      username: 'newuser',
      name: 'newuser',
    },
    actions: [
      {
        action_id: 'user_trip_action',
        block_id: 'user_trip_block',
        value: 'trips',
        style: 'primary',
        type: 'button',
        action_ts: '1572324866.668662',
      },
    ],
  };

  const userId = payload.user.id;
  const pageNumber = PaginationHelpers.getPageNumber(payload);

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(ItineraryHelpers.createStartMessage, () => {
    it('should return a block message', () => {
      const message = ItineraryHelpers.createStartMessage();
      expect(message).toBeDefined();
    });
  });

  describe(ItineraryHelpers.getPastTripsMessage, () => {
    it('should display: You have no past trips, when there are none', async () => {
      const testTripData: { data: TripRequest[], pageMeta: any } = { data: [], pageMeta: {} };
      jest.spyOn(TripItineraryHelper, 'getPaginatedTripRequestsBySlackUserId')
        .mockResolvedValueOnce(testTripData);
      await ItineraryHelpers.getPastTripsMessage(payload);
      expect(new SlackText('You have no past trips')).toBeDefined();
    });

    it('should continue to read past trips message', async () => {
      const tripsMock = {
        data: [tripData],
        pageMeta: {
          totalPages: 2,
          pageNo: 1,
          totalItems: 11,
          itemsPerPage: 10,
        },
      };

      jest.spyOn(TripItineraryHelper, 'getPaginatedTripRequestsBySlackUserId')
        .mockResolvedValueOnce(tripsMock);
      await ItineraryHelpers.getPastTripsMessage(payload);
      expect(TripItineraryHelper.getPaginatedTripRequestsBySlackUserId)
        .toHaveBeenCalledWith(userId.toString(), TRIP_LIST_TYPE.PAST, pageNumber);
    });
  });

  describe(ItineraryHelpers.getUpcomingTripsMessage, () => {
    it('should continue to read upcoming trips message', async () => {
      const tripsMock = {
        data: [tripData],
        pageMeta: {
          totalPages: 2,
          pageNo: 1,
          totalItems: 11,
          itemsPerPage: 10,
        },
      };
      jest
        .spyOn(TripItineraryHelper, 'getPaginatedTripRequestsBySlackUserId')
        .mockResolvedValueOnce(tripsMock);
      await ItineraryHelpers.getUpcomingTripsMessage(payload);
      expect(TripItineraryHelper.getPaginatedTripRequestsBySlackUserId)
        .toHaveBeenCalledWith(userId.toString(), TRIP_LIST_TYPE.UPCOMING, pageNumber);
    });

    it('should return upcoming trips message', async () => {
      jest
        .spyOn(TripItineraryHelper, 'getPaginatedTripRequestsBySlackUserId')
        .mockResolvedValue(null);
      await ItineraryHelpers.getUpcomingTripsMessage(payload);
      expect(TripItineraryHelper.getPaginatedTripRequestsBySlackUserId)
        .toHaveBeenCalledWith(userId.toString(), TRIP_LIST_TYPE.UPCOMING, pageNumber);
    });

    it('should display: You have no upcoming trips, when there are none', async () => {
      const testTripData: { data: TripRequest[], pageMeta: any } = { data: [], pageMeta: {} };
      jest
        .spyOn(TripItineraryHelper, 'getPaginatedTripRequestsBySlackUserId')
        .mockResolvedValueOnce(testTripData);
      await ItineraryHelpers.getUpcomingTripsMessage(payload);
      expect(new SlackText('You have no upcoming trips')).toBeDefined();
    });
  });

  describe(ItineraryHelpers.triggerPage, () => {
    it('should triggerPage', async () => {
      const [newPayload] = [{
        actions: [{
          action_id: 'user_trip_skip_page',
          value: 'trips',
        }],
      }];
      const { actions: [{ value: requestType, action_id: actionId }] } = newPayload;
      jest.spyOn(DialogPrompts, 'sendSkipPage').mockReturnValue(null);
      await ItineraryHelpers.triggerPage(newPayload);
      expect(DialogPrompts.sendSkipPage).toHaveBeenCalledWith(
        newPayload,
        requestType,
        actionId,
      );
    });
  });

  describe(ItineraryHelpers.cancelTrip, () => {
    it('should return trip not found', async () => {
      jest.spyOn(tripService, 'getById').mockReturnValue(null);
      const result = await ItineraryHelpers.cancelTrip(payload, null);
      expect(result.text).toBe('Trip not found');
    });

    it('should return success message after canceling a trip', async () => {
      jest.spyOn(tripService, 'getById').mockReturnValue(tripData);
      jest.spyOn(tripService, 'updateRequest').mockResolvedValue({});
      const result = await ItineraryHelpers.cancelTrip(payload, tripData.id);
      expect(tripService.getById).toHaveBeenCalledWith(tripData.id, true);
      expect(tripService.updateRequest).toHaveBeenCalledWith(tripData.id,
        { tripStatus: 'Cancelled' });
      expect(result.text).toMatch(/^Success! Your Trip request from \w.* has been cancelled$/);
    });

    it('should catch an error when something goes wrong while canceling trip history', async () => {
      jest
        .spyOn(tripService, 'updateRequest')
        .mockRejectedValueOnce(new Error('Database Error'));
      const value = 'hey';
      await ItineraryHelpers.cancelTrip(payload, value);
      expect(new SlackText('Request could not be processed')).toBeDefined();
    });
  });
});
