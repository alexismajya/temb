import tripDetail, { TripDetailsService } from '../trip-detail.service';
import database from '../../../database';

const { models: { TripDetail } } = database;

describe(TripDetailsService, () => {
  const tripDetailInformation = {
    riderPhoneNo: '781234567',
    travelTeamPhoneNo: '781234567',
    flightNumber: '9777',
  };
  describe(TripDetailsService.prototype.createDetails, () => {
    it('should create trip with its details', async (done) => {
      const trip = await tripDetail.createDetails(tripDetailInformation);
      expect(typeof trip).toBe('object');
      expect(trip.riderPhoneNo).toEqual(tripDetailInformation.riderPhoneNo);
      expect(trip.travelTeamPhoneNo).toEqual(tripDetailInformation.travelTeamPhoneNo);
      expect(trip.flightNumber).toEqual(tripDetailInformation.flightNumber);
      done();
    });
  });
});
