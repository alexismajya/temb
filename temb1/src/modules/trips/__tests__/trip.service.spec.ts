import { Op } from 'sequelize';
import tripService, { TripService } from '../trip.service';
import database, { TripRequest } from '../../../database';
import { mockTrip } from './__mocks__';
import cache from '../../shared/cache';
import { getMockTrip } from '../../../services/__mocks__';

describe(TripService, () => {
  const testData = JSON.parse(process.env.TEST_DATA);

  afterAll(async (done) => {
    database.close().then(done, done);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe(TripService.prototype.sequelizeWhereClauseOption, () => {
    it('should return empty object when trip status and department is not being  passed', () => {
      const filterParams = {};
      const response = tripService.sequelizeWhereClauseOption(filterParams);
      expect(response).toEqual({});
      expect(response).toBeTruthy();
    });

    it('should return trip status and deprartment when passed', () => {
      const status = 'Pending';
      const department = 'People';
      const filterParams = { status, department };
      const response = tripService.sequelizeWhereClauseOption(filterParams) as any;

      expect(response).toBeDefined();
      expect(response).toHaveProperty('tripStatus');
      expect(response).toHaveProperty('departmentName');
      expect(response.departmentName).toEqual('People');
      expect(response.tripStatus).toEqual('Pending');
    });

    it('should return trip department when it being passed', () => {
      const department = 'People';
      const filterParams = { department, dateFrom: '2018-01-11', dateTo: '2019-10-10' };
      const response = tripService.sequelizeWhereClauseOption(filterParams) as any;
      expect(response).toBeDefined();
      expect(response).toHaveProperty('departmentName');
      expect(response.departmentName).toEqual('People');
    });

    it('should filter by search term if provided', () => {
      const filterParams = { searchterm: 'searchterm' };
      const response = tripService.sequelizeWhereClauseOption(filterParams) as any;
      expect(response).toBeDefined();
      expect(response).toEqual({
        [Op.or]: [
          { '$requester.name$': { [Op.iLike]: { [Op.any]: ['%searchterm%'] } } },
          { '$rider.name$': { [Op.iLike]: { [Op.any]: ['%searchterm%'] } } },
          { '$origin.address$': { [Op.iLike]: { [Op.any]: ['%searchterm%'] } } },
          { '$destination.address$': { [Op.iLike]: { [Op.any]: ['%searchterm%'] } } },
        ],
      });
    });

    it('should ignore filter by search term if empty', () => {
      const filterParams = { searchterm: '' };
      const response = tripService.sequelizeWhereClauseOption(filterParams) as any;
      expect(response).toBeDefined();
      expect(response).toEqual({});
    });

    it('should return trip type when it is passed', () => {
      const type = 'Embassy Visit';
      const filterParams = { type };
      const response = tripService.sequelizeWhereClauseOption(filterParams) as any;
      expect(response).toHaveProperty('tripType');
      expect(response.tripType).toEqual('Embassy Visit');
    });

    it('should return currentDay when it is passed', () => {
      const currentDay = 'This day';
      const filterParams = { currentDay };
      const response = tripService.sequelizeWhereClauseOption(filterParams) as any;
      expect(response).toHaveProperty('departureTime');
    });
  });

  describe(TripService.prototype.getTrips, () => {
    const testTrip = new TripRequest({ id: 22 });
    beforeEach(() => {
      jest.spyOn(TripRequest, 'findAll').mockResolvedValue([{ get: () => testTrip }]);
      jest.spyOn(tripService, 'serializeTripRequest').mockReturnValue({});
    });

    it('should return trip', async () => {
      const pageable = { page: 1, size: 100 };
      const where = {};
      const response = await tripService.getTrips(pageable, where, 1);
      expect(response).toHaveProperty('trips');
      expect(response).toHaveProperty('totalPages');
      expect(response).toHaveProperty('page');
      expect(response.trips).toEqual([expect.objectContaining({ id: testTrip.id })]);
    });

    it('should return trips according to search parameter', async () => {
      const pageable = { page: 1, size: 100 };
      const where = { departmentName: 'TDD' };
      const response = await tripService.getTrips(pageable, where, 1);
      expect(response).toHaveProperty('trips');
      expect(response).toHaveProperty('totalPages');
      expect(response).toHaveProperty('page');
      expect(response.trips).toEqual([expect.objectContaining({ id: testTrip.id })]);
    });
  });

  describe(TripService.prototype.serializeTripRequest, () => {
    it('should return all valid trips property', () => {
      const response = tripService.serializeTripRequest(testData.trips[0]);
      expect(response).toBeDefined();
      expect(typeof response).toEqual('object');
      expect(typeof response.name).toEqual('string');
      expect(typeof response.passenger).toEqual('number');
    });
  });

  describe(TripService.prototype.checkExistence, () => {
    it('should return true if trip exists and false otherwise', async () => {
      jest.spyOn(TripRequest, 'count').mockResolvedValue(true);
      const truthy = await tripService.checkExistence(1);
      expect(truthy).toBe(true);
      jest.spyOn(TripRequest, 'count').mockResolvedValue(false);
      const falsy = await tripService.checkExistence(3);
      expect(falsy).toBe(false);
    });
  });

  describe(TripService.prototype.getById, () => {
    beforeAll(() => {
      cache.saveObject = jest.fn(() => { });
      cache.fetch = jest.fn((pk) => {
        if (pk === 'tripDetail_2') {
          return { trip: mockTrip };
        }
      });
    });

    it('should return a single trip from the database', async () => {
      jest.spyOn(TripRequest, 'findByPk').mockResolvedValue({ get: () => mockTrip });
      const result = await tripService.getById(3, true);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('trip');
    });

    it('should throw an error', async () => {
      try {
        await tripService.getById(0);
      } catch (error) {
        expect(error.message).toBe('Could not return the requested trip');
      }
    });
  });

  describe(TripService.prototype.getAll, () => {
    it('should return all trips', async () => {
      jest.spyOn(TripRequest, 'findAll').mockResolvedValue([]);
      await tripService.getAll({ where: { tripStatus: 'Pending' } });
      expect(TripRequest.findAll).toBeCalled();
    });
    it('should return all trips without where clause', async () => {
      jest.spyOn(TripRequest, 'findAll').mockResolvedValue([]);
      await tripService.getAll();
      expect(TripRequest.findAll).toBeCalled();
    });
  });

  describe(TripService.prototype.updateRequest, () => {
    it('should update a trip request', async () => {
      const result = await tripService.updateRequest(testData.trips[0].id, {
        tripStatus: 'Confirmed',
      });
      expect(typeof result).toBe('object');
      expect(result.tripStatus).toEqual('Confirmed');
    });
    it('should throw an error when trip request update fails', async () => {
      const err = new Error('Error updating trip request');

      jest.spyOn(TripRequest, 'update').mockRejectedValue(new Error());
      try {
        await tripService.updateRequest(1,
          { tripStatus: 'Confirmed' });
      } catch (error) {
        expect(error).toEqual(err);
      }
    });
  });

  describe(TripService.prototype.getPaginatedTrips, () => {
    it('should get paginated trips', async () => {
      const response = await tripService.getPaginatedTrips({}, 1);
      expect(response).toBeDefined();
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('pageMeta');
    });
  });

  describe(TripService.prototype.getDateFilters, () => {
    it('should get date filters', () => {
      const dateFilters = tripService.getDateFilters('testField', {
        before: new Date(),
        after: new Date(),
      });
      expect(dateFilters).toBeDefined();
      expect(dateFilters).toHaveProperty('testField');
    });
  });

  describe(TripService.prototype.createRequest, () => {
    it('should create request', async () => {
      const trip = getMockTrip({
        destinationId: testData.addresses[1].id,
        departmentId: testData.department.id,
        riderId: testData.users[2].id,
        noOfPassengers: 3,
      });
      const result = await tripService.createRequest(trip);
      expect(result.id).toBeDefined();
    });
  });
});
