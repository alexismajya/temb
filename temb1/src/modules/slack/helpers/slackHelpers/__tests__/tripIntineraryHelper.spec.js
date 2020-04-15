import TripItineraryHelper from '../TripItineraryHelper';
import SlackHelpers from '../../../../users/user.service';
import database from '../../../../../database';
import tripService from '../../../../trips/trip.service';

const { models: { TripRequest, User } } = database;

describe('TripItineraryHelper ', () => {
  beforeEach(() => {
    jest.spyOn(TripRequest, 'findAll').mockResolvedValue([{}, {}]);
    jest.spyOn(User, 'findOne').mockResolvedValue([{}, {}]);
    jest.spyOn(SlackHelpers, 'getUserBySlackId').mockResolvedValue([{}, {}]);
    jest.spyOn(tripService, 'getAll').mockResolvedValue([{}, {}]);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('TripItineraryHelper_getUserIdBySlackId', () => {
    it('should return the user id', async () => {
      const slackId = 'test001';
      await TripItineraryHelper.getUserIdBySlackId(slackId);
      expect(SlackHelpers.getUserBySlackId).toBeCalled();
    });

    it('should throw an error when it can not get user', async () => {
      try {
        jest.spyOn(SlackHelpers, 'getUserBySlackId')
          .mockResolvedValue();
        const userId = 'TEST001';
        await TripItineraryHelper.getUserIdBySlackId(userId);
      } catch (e) {
        expect(SlackHelpers.getUserBySlackId).toBeCalled();
        expect(e.message).toEqual('User not found');
      }
    });
  });

  describe('TripItineraryHelper_getThirtyDaysFromNow', () => {
    it('should return 30 days less than the current date', () => {
      const dateDifference = TripItineraryHelper.getThirtyDaysFromNow();
      expect(dateDifference).toBeTruthy();
    });

    it('should return date as a number', () => {
      const dateDifference = TripItineraryHelper.getThirtyDaysFromNow();
      expect(dateDifference).not.toBeNaN();
    });
  });

  describe('TripItineraryHelper_getTripItineraryFilters', () => {
    it('should filter trip by date', () => {
      jest.spyOn(TripItineraryHelper, 'getThirtyDaysFromNow').mockResolvedValue(new Date());
      TripItineraryHelper.getTripItineraryFilters();
      expect(TripItineraryHelper.getThirtyDaysFromNow).toBeCalled();
    });
  });

  describe('TripItineraryHelper_getPaginatedTripRequestsBySlackUserId', () => {
    it('should call getUserIdBySlackId method to get the user ', async () => {
      jest.spyOn(TripItineraryHelper, 'getUserIdBySlackId').mockResolvedValue([{}, {}]);
      jest.spyOn(tripService, 'getPaginatedTrips').mockResolvedValue([{}, {}]);
      const slackUserId = 'test001';
      await TripItineraryHelper.getPaginatedTripRequestsBySlackUserId(slackUserId);
      expect(TripItineraryHelper.getUserIdBySlackId).toBeCalled();
    });
    it('should  return paginated trips', async () => {
      jest.spyOn(TripItineraryHelper, 'getUserIdBySlackId').mockResolvedValue([{}]);
      jest.spyOn(TripItineraryHelper, 'getTripItineraryFilters').mockResolvedValue([{}, {}]);
      jest.spyOn(tripService, 'getPaginatedTrips').mockResolvedValue([{}, {}]);

      const slackUserId = 'test001';
      await TripItineraryHelper.getPaginatedTripRequestsBySlackUserId(slackUserId);
      expect(tripService.getPaginatedTrips).toBeCalled();
    });
  });
});
