// tslint:disable: prefer-const
import DriverService, { driverService } from '../driver.service';
import database from '../../../database';
import ProviderHelper from '../../../helpers/providerHelper';
import driversMocks from '../__mocks__/driversMocks';

const {
  models: { Driver },
} = database;

describe('Driver Service', () => {
  let testDriver: any;
  let providerId:number;

  describe('test', () => {
    beforeAll(() => {
      providerId = 1;
    });

    afterAll(async () => {
      await testDriver.destroy({ force: true });
    });
    it('should create driver successfully', async () => {
      const driver = await driverService.create({
        providerId,
        driverName: 'Muhwezi Deo2',
        driverPhoneNo: '070533111166',
        driverNumber: 'UB5422424344',

      });
      expect(driver).toBeDefined();
      expect(driver.driverName).toEqual('Muhwezi Deo2');
    });
  });

  it('should return not create driver if driverNumber exists', async () => {
    const drivers = await Driver.findAll({ limit: 1 });
    const driver = await driverService.create({
      providerId,
      driverName: 'Muhwezi Deo2',
      driverPhoneNo: '0700000011',
      driverNumber: drivers[0].driverNumber,

    });
    const { _options: { isNewRecord } } = driver;
    expect(isNewRecord).toBeFalsy();
  });

  describe('getProviders', () => {
    beforeEach(() => {
      ProviderHelper.serializeDetails = jest.fn();
    });

    it('returns a list of drivers', async () => {
      jest.spyOn(Driver, 'findAll').mockResolvedValue(driversMocks.drivers.data);
      const driversDetails = driversMocks.drivers.data.map((driver) => driver.get());
      const result = await driverService.getDrivers({ page: 2, size: 10 }, {});
      expect(result.data).toEqual(driversDetails);
      expect(result).toHaveProperty('pageMeta');
    });
  });

  describe('Update Driver', () => {
    const driverDetails = {
      get: ({ plain }: { plain: boolean }) => {
        if (plain) {
          return {
            driverName: 'Muhwezi De',
            driverPhoneNo: '070533111',
            driverNumber: 'UB5422424',
            email: 'james@andela.com',
          };
        }
      },
    };

    const driverDetailsMock = {
      get: () => ({
        driverName: 'Muhwezi De',
        driverPhoneNo: '070533111',
        driverNumber: 'UB5422424',
        email: 'james@andela.com',
      }),
    };

    it('Should return an error if driver does not exist', async () => {
      jest.spyOn(Driver, 'findByPk').mockResolvedValue(undefined);
      const result = await driverService.driverUpdate(1, null);
      expect(Driver.findByPk).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Update Failed. Driver does not exist' });
    });

    it('should update a driver', async () => {
      jest.spyOn(Driver, 'update')
        .mockResolvedValue([{}, [driverDetailsMock]]);
      jest.spyOn(Driver, 'findByPk')
        .mockResolvedValue(driverDetails);
      const result = await driverService.driverUpdate(1, driverDetailsMock.get());
      expect(Driver.update).toHaveBeenCalled();
      expect(result).toEqual(driverDetailsMock.get());
    });

    it('should get driver by id', async () => {
      driverDetails.id = 1;
      jest.spyOn(Driver, 'findByPk').mockResolvedValue(driverDetails);
      const driver = await driverService.getDriverById(1);
      expect(driver).toEqual(driverDetails.get({ plain: true }));
    });

    it('should check if a driver already exists when updating', async () => {
      jest.spyOn(database, 'query').mockResolvedValue([[{ count: true }]]);
      const driverExists = await DriverService.exists('deo@andela.com', '891293', '123123', 1);
      expect(driverExists).toBe(true);
    });

    it('should check if a driver already exists when adding a driver', async () => {
      jest.spyOn(database, 'query').mockResolvedValue([[{ count: true }]]);
      const driverExists = await DriverService.exists('deo@andela.com', '891293', '123123');
      expect(driverExists).toBe(true);
    });
  });

  describe('Delete Driver', () => {
    it('Should delete driver', async () => {
      const driverInfo = {
        driverName: 'Muhwezi Deo',
        driverPhoneNo: '070533111',
        driverNumber: 'UB5422424',
        email: 'james@andela.com',
      };
      jest.spyOn(driverService, 'deleteDriver').mockResolvedValue({});
      const result = await driverService.deleteDriver(driverInfo);
      expect(Driver.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('findOneDriver', () => {
    it('Should findOne driver', async () => {
      const driverInfo = {
        driverName: 'Muhwezi Deo',
        driverPhoneNo: '070533111',
        driverNumber: 'UB5422424',
        email: 'james@andela.com',
      };
      jest.spyOn(Driver, 'findOne').mockResolvedValue(driverInfo);
      const options = { where: { id: 1 } };
      const result = await DriverService.findOneDriver(options);
      expect(Driver.findOne).toHaveBeenCalled();
      expect(result).toEqual(driverInfo);
      await database.close();
    });
  });
});
