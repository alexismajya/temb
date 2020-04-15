import tripService from '../trip.service';
import { TripRequest } from '../../../database';

describe('TravelTripService', () => {
  describe(tripService.getCompletedTravelTrips, () => {
    it('should return an empty list of travel trips if none ', async () => {
      const result = await tripService.getCompletedTravelTrips(null, null, [], 1);
      expect(result).toEqual([]);
    });

    it('should return a list of travel trips if any ', async () => {
      const result = await tripService.getCompletedTravelTrips('2016-12-03', '2019-07-03',
        [
          'D0 Programs',
          'Technology',
        ], 1);
      expect(result).toEqual([]);
      const mockedTravelTrips = [
        {
          departmentId: 3,
          departmentName: 'People',
          tripsCount: '1',
          averageRating: '4.0000000000000000',
          totalCost: '14',
        },
      ];

      jest.spyOn(TripRequest, 'findAll').mockResolvedValue(mockedTravelTrips);
      const result2 = await tripService.getCompletedTravelTrips('2019-12-03', '2018-07-03', [
        'D0 Programs',
        'Technology',
      ], 1);
      expect(result2).toEqual(mockedTravelTrips);
      expect(TripRequest.findAll).toBeCalled();
    });
  });
});
