import { addressService } from '../src/modules/addresses/address.service';
import locationService from '../src/modules/locations/location.service';
import database from '../src/database';

describe('AddressService', () => {
  afterAll(async () => {
    await database.close();
  });
  describe('findOrCreateAddress', () => {
    it('should create a new address with supplied location', async () => {
      const testAddress = {
        address: 'Andela, Nairobi',
        location: {
          longitude: 100,
          latitude: 180
        }
      };

      const result = await addressService.findOrCreateAddress(
        testAddress.address, testAddress.location
      );

      expect(result.longitude).toEqual(100);
      expect(result.latitude).toEqual(180);
      expect(result.id).toBeDefined();
    });

    it('should not create location when location is not provided', async () => {
      jest.spyOn(locationService, 'createLocation');

      const testAddress = {
        address: 'Andela, Nairobi',
      };
      const result = await addressService.findOrCreateAddress(testAddress.address);

      expect(result.id).toBeDefined();
      expect(result.longitude).toBeUndefined();
      expect(locationService.createLocation).toBeCalledTimes(0);
    });
  });

  describe('findCoordinatesByAddress', () => {
    it('should get address by location', async () => {
      const {
        address, location: { longitude, latitude }
      } = await addressService.findCoordinatesByAddress('Andela, Nairobi');
      expect(address).toEqual('Andela, Nairobi');
      expect(longitude).toEqual(100);
      expect(latitude).toEqual(180);
    });
  });
});
