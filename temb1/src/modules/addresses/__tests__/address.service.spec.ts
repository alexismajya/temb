import AddressService from '../address.service';
import { mockLocationService } from '../../locations/__mocks__/location.service';
import { Address, Location } from '../../../database';
import { mockLogger } from '../../shared/logging/__mocks__/logger';
import { mockAddressRepo } from '../__mocks__/address.service';

describe(AddressService, () => {
  let mockAddress: any;
  let addressService: AddressService;

  beforeAll(async () => {
    addressService = new AddressService(mockAddressRepo, mockLocationService, mockLogger);
    mockAddress = await mockAddressRepo.create({ address: 'This is a test address' });
  });

  beforeEach(() => {
    jest.spyOn(mockLogger, 'log');
    jest.spyOn(mockLogger, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe(AddressService.prototype.createNewAddress, () => {
    it('should create new address', async () => {
      const testAddress = {
        longitude: 5677,
        latitude: 908998,
        address: 'Another test address',
      };

      const result = await addressService.createNewAddress(testAddress.longitude,
        testAddress.latitude, testAddress.address);
      expect(result).toEqual(expect.objectContaining(testAddress));
    });

    it('should raise error when having invalid parameters', async () => {
      jest.spyOn(mockLogger, 'log');
      expect(addressService.createNewAddress(1.0, null, 'Address'))
        .rejects.toThrowError('Could not create address');
      // expect(mockLogger.log).toBeCalled();
    });
  });

  describe(AddressService.prototype.updateAddress, () => {
    it.only('should update address model', async () => {
      const mockAddressModel = {
        get: () => ({
          address: 'newAddress',
          location: { longitude: -1.0, latitude: 1.0 },
        }),
      };
      jest.spyOn(mockAddressRepo, 'findOne').mockResolvedValue(mockAddressModel);
      jest.spyOn(mockAddressRepo, 'findByPk').mockResolvedValue(mockAddressModel);
      jest.spyOn(mockAddressRepo, 'update').mockResolvedValueOnce([, [mockAddressModel]]);

      const updatedAddress =  await addressService.updateAddress('This is a test address', -1, 1, 'newAddress2');
      expect(updatedAddress.address).toEqual('newAddress2');
      // expect(updatedAddress.location.latitude).toEqual(1);
      // expect(updatedAddress.location.longitude).toEqual(-1);
    });

    it('should raise error when having invalid parameters', async () => {
      jest.spyOn(mockAddressRepo, 'update').mockRejectedValue(new Error());
      expect(await addressService.updateAddress('This is a test address', null, null, 'newAddress'))
        .rejects.toThrowError('Could not update address record');
     //  expect(mockLogger.log).toHaveBeenCalled();;
    });
  });

  describe(AddressService.prototype.findAddress, () => {
    it('should find and return address', async () => {
      const value = {
        get: (plainProp = { plain: false }) => {
          if (plainProp.plain) {
            return { address: 'This is a test address', id: 2 };
          }
        },
      };
      jest.spyOn(mockAddressRepo, 'findOne').mockResolvedValue(value);

      const result = await addressService.findAddress('');
      expect(result).toEqual(value.get({ plain: true }));
    });

    it('should raise error when having invalid parameters', async () => {
      const value = { address: 'This is a test address' };
      jest.spyOn(mockAddressRepo, 'findOne').mockRejectedValue(value);
      const res = await addressService.findAddress('');
      jest.spyOn(mockLogger, 'log');
      mockLogger.log = jest.fn().mockRejectedValue({});
      // expect(mockLogger.log).toHaveBeenCalled();
    });
    it('should get address when ID is passed', async () => {
      const result: any = await addressService.findAddressById(1);
      expect(result.address).toEqual('Another test address');
    });
  });

  describe(AddressService.prototype.getAddressesFromDB, () => {
    it('should return all addresses in the database', async () => {
      const value = [{
        get: () => {
          return { address: 'This is a test address' };
        },
      }];
      jest.spyOn(mockAddressRepo, 'findAll').mockResolvedValue(value);
      jest.spyOn(mockAddressRepo, 'count').mockResolvedValue(2);
      const result = await addressService.getAddressesFromDB(1, 2);
      expect(result.rows)
        .toEqual(value.map((entry) => entry.get()));
    });
  });

  describe(AddressService.prototype.findOrCreateAddress, () => {
    beforeEach(() => {
      jest.spyOn(mockAddressRepo, 'findOrCreate').mockImplementation((value) => {
        const id = Math.ceil(Math.random() * 100);
        const newAddress = {
          get: () => ({ ...value.defaults, id }),
        };
        return [newAddress];
      });
    });

    it('should create a new address with supplied location', async () => {
      const testAddress = {
        address: 'Andela, Nairobi',
        location: {
          longitude: 100,
          latitude: 180,
        },
      };

      const result = await addressService.findOrCreateAddress(
        testAddress.address, testAddress.location,
      );

      expect(result.longitude).toEqual(100);
      expect(result.latitude).toEqual(180);
      expect(result.id).toBeDefined();
    });

    it('should not create location when location is not provided', async () => {
      const testAddress = {
        address: 'Andela, Nairobi',
      };
      const result = await addressService.findOrCreateAddress(testAddress.address, '');

      expect(result.id).toBeDefined();
      expect(result.longitude).toBeUndefined();
      // expect(mockLocationService.createLocation).toHaveBeenCalledTimes(0);
    });
  });

  describe(AddressService.prototype.findCoordinatesByAddress, () => {
    it('should get location when address is requested', async () => {
      const result = await addressService.findCoordinatesByAddress('This is a test address');
      expect(result.address).toEqual('This is a test address');
      // expect(result.location.latitude).toEqual(34.4444);
      expect(result.id).toBeDefined();
    });
  });

  describe(AddressService.prototype.findAddressByCoordinates, () => {
    let addressDetails: Location;

    beforeEach(() => {
      addressDetails = {
        id: 1,
        longitude: 1.2222,
        latitude: 34.4444,
        address: {
          id: 1,
          address: 'Sample Provider',
        },
      } as Location;
      jest.spyOn(mockLocationService, 'findLocation').mockResolvedValue(addressDetails);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should get address when coordinated are passed', async () => {
      const result = await addressService.findAddressByCoordinates(1.2343, -1.784);
      expect(result).toEqual(addressDetails.address);
    });
  });

  describe(AddressService.prototype.getAddressListByHomebase, () => {
    const addresses = [
      {
        get: (plainProp = { plain: false }) => {
          if (plainProp.plain) {
            return { address: 'address1' };
          }
        },
      },
      {
        get: (plainProp = { plain: false }) => {
          if (plainProp.plain) {
            return { address: 'address2' };
          }
        },
      },
    ];

    it('should return a list of addresses', async () => {
      jest.spyOn(mockAddressRepo, 'findAll').mockResolvedValue(addresses);
      const response = await addressService.getAddressListByHomebase('SomeHomebase');
      expect(response).toEqual(addresses.map((e) => e.get({ plain: true }).address));
    });
  });
});
