import tripDetailsService, { TripDetailsService } from '../trip-detail.service';

describe(TripDetailsService, () => {
  const tripDetail = {
    riderPhoneNo: '0781234567',
    travelTeamPhoneNo: '0781234567',
    flightNumber: '9AA09',
  };

  describe(TripDetailsService.prototype.createDetails, () => {
    it('should create an instance of trip details', async (done) => {
      const trip = await tripDetailsService.createDetails(tripDetail);
      expect(trip).toEqual(expect.objectContaining(tripDetail));
      done();
    });
  });
});
