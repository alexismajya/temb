import faker from 'faker';
import { homebaseService } from '../homebase.service';
import database from '../../../database';
import { mockCreatedHomebase, mockNewHomebase } from '../../../services/__mocks__';
import UserService from '../../users/user.service';
import { createCountry } from '../../../../integrations/support/helpers';
import HomebaseModel from '../../../database/models/homebase';

const { models: { Country, Provider, TripRequest } } = database;

describe('test HomebaseService', () => {
  let createHomebaseSpy: any;
  const homebaseDetails = {
    id: 1,
    name: 'Nairobi',
    createdAt: '2019-05-05T10:57:31.476Z',
    updatedAt: '2019-05-05T10:57:31.476Z',
    addressId: 1,
  };
  const homebaseMock = [
    [{
      get: () => (homebaseDetails),
    }],
    [{
      get: ({ plain } : { plain: boolean }) => {
        if (plain) return homebaseDetails;
      },
    }],
  ];

  const filterParams = {
    country: 'kenya',
    name: 'NairobI',
  };

  const where = {
    country: 'Kenya',
  };

  beforeEach(() => {
    createHomebaseSpy = jest.spyOn(HomebaseModel, 'findOrCreate');
    jest.spyOn(homebaseService, 'formatName');
    jest.spyOn(homebaseService, 'createFilter');
    jest.spyOn(homebaseService, 'getAllHomebases');
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('creates a homebase successfully', async () => {
    const testData = {
      name: 'Nairobi',
      channel: 'UO23D',
      address: {
        address: 'nairobi',
        location: {
          longitude: '23', latitude: '53',
        },
      },
      countryId: 1,
      currency: 'KES',
    };
    createHomebaseSpy.mockResolvedValue([mockNewHomebase]);
    const result = await homebaseService.createHomebase(testData);
    expect(createHomebaseSpy).toHaveBeenCalled();
    expect(homebaseService.formatName).toHaveBeenCalledWith(testData.name);
    expect(result).toEqual(mockCreatedHomebase);
  });

  it('createFilter', () => {
    const res = homebaseService.createFilter(where);
    expect(Object.keys(res).length).toEqual(2);
    expect(res).toHaveProperty('where');
    expect(res).toHaveProperty('include');
  });

  it('formatName', () => {
    const res = homebaseService.formatName('naIRoBi');
    expect(res).toEqual('Nairobi');
  });

  it('whereClause', () => {
    const res = homebaseService.getWhereClause(filterParams);
    expect(homebaseService.formatName).toHaveBeenCalledTimes(2);
    expect(res).toEqual({
      country: 'Kenya', name: 'Nairobi',
    });
  });

  it('getHomebases', async () => {
    const pageable = {
      page: 1,
      size: 10,
    };

    jest.spyOn(HomebaseModel, 'findAll').mockResolvedValue(homebaseMock[0]);

    const homebases = await homebaseService.getHomebases(pageable);
    expect(homebases).toHaveProperty('homebases', [{
      id: 1,
      homebaseName: 'Nairobi',
      createdAt: '2019-05-05T10:57:31.476Z',
      updatedAt: '2019-05-05T10:57:31.476Z',
      addressId: 1,
      country: null,
      channel: undefined,
      locationId: undefined,
    }]);
    expect(homebaseService.createFilter).toHaveBeenCalledWith({});
  });

  it('should get all Homebases', async () => {
    jest.spyOn(HomebaseModel, 'findAll').mockResolvedValue(homebaseMock[1]);
    const homebases = await homebaseService.getAllHomebases();
    expect(HomebaseModel.findAll).toBeCalledWith({
      attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail'],
      include: [],
      order: [['name', 'ASC']],
    });
    expect(homebases).toEqual([homebaseMock[1][0].get({ plain: true })]);
  });

  it('should get all Homebases with foreignKey', async () => {
    jest.spyOn(HomebaseModel, 'findAll').mockResolvedValue(homebaseMock[1]);
    await homebaseService.getAllHomebases(true);
    expect(HomebaseModel.findAll).toBeCalledWith({
      attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail'],
      include: [{ as: 'country', attributes: ['name'], model: Country }],
      order: [['name', 'ASC']],
    });
  });

  it('should get homebase by User slack ID', async () => {
    jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue({ homebaseId: 1 });
    jest.spyOn(HomebaseModel, 'findByPk').mockResolvedValue(homebaseMock[1][0]);
    const homebase = await homebaseService.getHomeBaseBySlackId(1);
    expect(HomebaseModel.findByPk).toBeCalled();
    expect(homebase).toEqual(homebaseMock[1][0].get({ plain: true }));
  });

  it('should get homebase by User slack ID with foreignKey', async () => {
    jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue({ homebaseId: 1 });
    jest.spyOn(HomebaseModel, 'findByPk').mockResolvedValue(homebaseMock[1][0]);
    const homebase = await homebaseService.getHomeBaseBySlackId(1, true);
    expect(HomebaseModel.findByPk).toBeCalled();
    expect(HomebaseModel.findByPk).toBeCalledWith(1, {
      attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail'],
      include: [{ as: 'country', attributes: ['name'], model: Country }],
    });
    expect(homebase).toEqual(homebaseMock[1][0].get({ plain: true }));
  });

  it('should get homebase by Slack Channel ID', async () => {
    jest.spyOn(HomebaseModel, 'findOne').mockResolvedValue(homebaseMock[1][0]);
    const result = await homebaseService.findHomeBaseByChannelId('CELT35X40');
    expect(HomebaseModel.findOne).toBeCalled();
    expect(result).toEqual(homebaseMock[1][0].get({ plain: true }));
  });

  it('should get all Homebases with providers and trips', async () => {
    jest.spyOn(HomebaseModel, 'findAll').mockResolvedValue(homebaseMock[1]);
    await homebaseService.getMonthlyCompletedTrips();
    expect(HomebaseModel.findAll).toBeCalled();
  });
});

describe('update HomeBase', () => {
  let mockHomeBase: any;
  const testAddress = {
    address: faker.address.county(),
    location: {
      longitude: '123',
      latitude: '86',
    },
  };
  beforeAll(async () => {
    const mockCountry = await createCountry(
      { name: faker.address.country().concat('z') },
    );
    mockHomeBase = await homebaseService.createHomebase({
      name: faker.address.city().concat('z'),
      channel: 'U123K',
      countryId: mockCountry.id,
      address: testAddress,
      currency: 'NGN',
      opsEmail: 'Kigali@andela.com',
      travelEmail: 'kigali@andela.com',
    });
    await homebaseService.createHomebase({
      name: 'Duplicatetest',
      channel: 'U123K',
      countryId: mockCountry.id,
      address: testAddress,
    });
  });

  afterAll(async () => {
    await database.close();
  });

  it('should update the homebase', async () => {
    const { homebase: { id, countryId, currency, opsEmail, travelEmail } } = mockHomeBase;
    const homeBaseName = faker.address.county().concat('w');
    const result = await homebaseService.updateDetails(
      homeBaseName, id, 'U08ETD', countryId, testAddress, currency, opsEmail, travelEmail,
    );
    expect(result.name).toBe(homeBaseName);
  });

  it('should filter the homebase', async () => {
    const filtered = homebaseService.filterHomebase({ name: 'name' }, [{ name: 'name' }, { name: 'name 1' }]);
    expect(filtered).toEqual([{ name: 'name 1' }]);
  });
  it('should filte the homebase', async () => {
    const filtered = homebaseService.filterHomebase({ name: 'name 1' }, [{ name: 'name' }]);
    expect(filtered).toEqual([{ name: 'name' }]);
  });
});
