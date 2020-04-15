import { LocationService } from '../location.service';
import { mockLocationRepo } from '../__mocks__/location.service';
import { mockLogger } from '../../shared/logging/__mocks__/logger';

describe(LocationService, () => {
  let locationService: LocationService;
  let testLocation: any;

  beforeAll(async () => {
    locationService = new LocationService(mockLocationRepo, mockLogger);
    const loc = { longitude: -1.2345, latitude: 1.5673 };
    const [result] = await mockLocationRepo.findOrCreate({
      where: { id: 1 },
      defaults: loc,
    });
    testLocation = result.get();
  });

  describe(LocationService.prototype.findLocation, () => {
    it('should raise error when having invalid parameters', async () => {
      expect(locationService.findLocation(-1, null, true)).rejects.toThrowError();
    });

    it('should find location', async () => {
      const result = await locationService.findLocation(
        testLocation.longitude, testLocation.latitude, true);

      expect(result).toEqual(expect.objectContaining(testLocation));
    });
  });

  describe(LocationService.prototype.createLocation, () => {
    it('should create a new loaction', async () => {
      const newLocation = { long: 23.45, lat: 27.99 };
      const result = await locationService.createLocation(newLocation.long, newLocation.lat);

      expect(result).toEqual(expect.objectContaining({
        longitude: newLocation.long,
        latitude: newLocation.lat,
      }));
    });

    it('should throw error', async () => {
      jest.spyOn(mockLogger, 'log');
      await locationService.createLocation(null, null);
      expect(mockLogger.log).toHaveBeenCalled();
    });
  });

  describe(LocationService.prototype.getLocationById, () => {
    it('should retrun location with specified id', async () => {
      const result = await locationService.getLocationById(testLocation.id);

      expect(result).toEqual(expect.objectContaining({
        id: testLocation.id,
        longitude: testLocation.longitude,
        latitude: testLocation.latitude,
      }));
    });
  });
});
