import faker from 'faker';
import { driverService } from '../src/modules/drivers/driver.service';
import database from '../src/database';
import {
  createUser,
  createProvider,
  createDriver,
} from './support/helpers';

const { models } = database;

describe('DriverService', () => {
  let mockUser;
  let mockProvider;
  let mockDriver;
  let homebase;

  beforeAll(async () => {
    const { id } = await models.Country.create({
      name: faker.name.findName(),
    });
    homebase = await models.Homebase.create({
      country: faker.name.findName(),
      countryId: id
    });
    const userData = {
      name: faker.name.findName(),
      slackId: faker.random.word().toUpperCase(),
      phoneNo: faker.phone.phoneNumber('080########'),
      email: faker.internet.email(),
      homebaseId: homebase.id
    };
    mockUser = await createUser(userData);
    mockProvider = await createProvider({
      name: faker.random.word(),
      providerUserId: mockUser.id,
      homebaseId: homebase.id
    });
    mockDriver = await createDriver({
      driverName: faker.name.findName(),
      driverPhoneNo: faker.phone.phoneNumber('080########'),
      driverNumber: faker.random.number(),
      providerId: mockProvider.id,
      email: faker.internet.email(),
    });
  });

  afterAll(async () => {
    await database.close();
  });

  describe('DriverService > getDriverById', () => {
    it('should fetch a specific driver by given id', async () => {
      const { id, driverName, email } = mockDriver;
      const result = await driverService.getDriverById(id);
      expect(result.id).toBe(id);
      expect(result.driverName).toBe(driverName);
      expect(result.email).toBe(email);
      expect(result.deletedAt).toBeNull();
    });
  });

  describe('DriverService > deleteDriver', () => {
    it('should delete a specific driver', async () => {
      const result = await driverService.deleteDriver(mockDriver);
      expect(result).toBeTruthy();
    });
  });
});
