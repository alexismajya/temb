import { routeService } from '../route.service';
import database, { Homebase } from '../../../database';
import HttpError from '../../../helpers/errorHandler';
import UserService from '../../users/user.service';
import { mockRouteBatchData as routeBatch, routeMock } from '../../../services/__mocks__';
import RouteServiceHelper from '../../../helpers/RouteServiceHelper';
import { routeBatchService } from '../../routeBatches/routeBatch.service';

const {
  models: {
    Route, RouteBatch, Cab, Address, User,
  },
} = database;

describe('RouteService', () => {
  const {
    route, ...batchDetails
  } = routeBatch;
  const firstRoute = {
    route: {
      id: 12,
      name: 'c',
      destinationid: 1,
      routeBatch: [{ batch: 'C' }],
      riders: [{}, {}, {}, {}],
      capacity: 4,
    },
  };

  const routeCreationResult = {
    cabDetails: {
      id: 1, capacity: 4, regNumber: 'CCCCCC', model: 'saburu',
    },
    route: {
      name: 'ZZZZZZ',
      imageUrl: 'https://image-url',
      destination: { id: 456, address: 'BBBBBB' },
      routeBatch: [{ batch: 'A' }],
    },
    riders: [],
    inUse: 1,
    batch: 'A',
    capacity: 1,
    takeOff: 'DD:DD',
    comments: 'EEEEEE',
    imageUrl: 'https://image-url',
    status: 'Active',
  };
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  afterAll((done) => database.close().then(done));

  describe('RouteService_createRouteBatch', () => {
    beforeEach(() => {
      jest.spyOn(routeBatchService, 'createRouteBatch').mockResolvedValue(routeCreationResult);
      jest.spyOn(routeService, 'updateBatchLabel').mockResolvedValue('B');
      jest.spyOn(routeService, 'getRouteById').mockResolvedValue(route);
      jest.spyOn(routeService, 'findById').mockResolvedValue({ route, created: true });
    });

    it('should create initial route batch', async () => {
      jest.spyOn(Route, 'findByPk').mockResolvedValue(routeMock[0]);
      jest.spyOn(routeBatchService, 'createRouteBatch')
        .mockImplementationOnce(() => (routeCreationResult));

      const result = await routeService.createRouteBatch(routeMock[0].get({ plain: true }), '');

      expect(result).toEqual(routeCreationResult);
      expect(routeService.updateBatchLabel).toHaveBeenCalled();
    });
  });

  describe('RouteService_createRoute', () => {
    beforeEach(() => {
      const created = true;
      const routeDetails = { dataValues: { ...route } };
      jest.spyOn(Route, 'findOrCreate').mockResolvedValue([routeDetails, created]);
    });
    it('should return created route details', async () => {
      const name = 'yaba';
      const imageUrl = 'imageUrl';

      jest.spyOn(Route, 'findOrCreate').mockResolvedValue([routeMock[1], true]);
      const result = await routeService.createRoute(
        { name, imageUrl, destinationId: routeBatch.route.destination.id },
      );
      expect(result).toEqual({ route: routeMock[1].get(), created: true });
      expect(Route.findOrCreate).toBeCalled();
      const calledWith = Route.findOrCreate.mock.calls[0][0];
      expect(calledWith).toHaveProperty('where');
      expect(calledWith).toHaveProperty('defaults');
    });
  });

  describe('RouteService_addUserToRoute', () => {
    beforeEach(() => {
      jest.spyOn(HttpError, 'throwErrorIfNull');
      jest.spyOn(UserService, 'getUserById');
      jest.spyOn(RouteBatch, 'findByPk');
      jest.spyOn(RouteServiceHelper, 'canJoinRoute');
      jest.spyOn(database, 'transaction').mockImplementation((fn) => {
        fn();
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should throw an error if route doesn't exists", async () => {
      RouteBatch.findByPk.mockResolvedValue(null);
      const userId = 2;
      const routeBatchId = 2;
      try {
        await routeService.addUserToRoute(routeBatchId, userId);
      } catch (e) {
        expect(e.statusCode).toEqual(404);
        expect(RouteServiceHelper.canJoinRoute).not.toHaveBeenCalled();
        expect(HttpError.throwErrorIfNull.mock.calls[0][1]).toEqual(
          'Route route not found',
        );
      }
    });

    it('should add a user to the route', async () => {
      const userId = 3;
      const routeBatchId = 3;
      const mockRoute = {
        ...routeBatch,
        id: routeBatchId,
        capacity: 2,
        inUse: 1,
      };
      const user = { id: 1 };

      jest.spyOn(routeBatchService, 'getById').mockImplementationOnce(() => (mockRoute));
      jest.spyOn(UserService, 'getUserById').mockImplementationOnce(() => Promise.resolve(user));
      jest.spyOn(UserService, 'updateUser').mockReturnValueOnce(null);
      jest.spyOn(routeBatchService, 'updateRouteBatch')
      .mockImplementationOnce(() => Promise.resolve({
        inUse: mockRoute.inUse + 1,
      }));

      await routeService.addUserToRoute(routeBatchId, userId);

      expect(UserService.getUserById).toBeCalled();
      expect(database.transaction).toHaveBeenCalled();
      expect(UserService.updateUser).toHaveBeenCalled();
      expect(routeBatchService.updateRouteBatch).toHaveBeenCalledWith(userId, {
        inUse: mockRoute.inUse + 1,
      });
    });

    it('should throw an error if route is filled to capacity', async () => {
      RouteBatch.findByPk.mockResolvedValue(routeBatch);
      const userId = 2;
      const routeBatchId = 2;
      jest.spyOn(routeBatchService, 'getById').mockImplementationOnce(() => ({}));

      try {
        await routeService.addUserToRoute(routeBatchId, userId);
      } catch (e) {
        expect(e.statusCode).toEqual(403);
        expect(RouteServiceHelper.canJoinRoute).toHaveBeenCalled();
        expect(HttpError.throwErrorIfNull.mock.calls[1][2]).toEqual(403);
        expect(HttpError.throwErrorIfNull.mock.calls[1][1]).toEqual(
          'Route capacity has been exhausted',
        );
      }
    });
  });

  describe('RouteService_getRoute', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.restoreAllMocks();
    });
    it('should get a route by Id ', async () => {
      const id = 123;
      const mock = {
        get: ({ plain }: { plain: boolean }) => (plain ? {
          ...routeBatch,
          id,
        } : null),
      };
      const findByPk = jest.spyOn(Route, 'findByPk').mockReturnValue(mock);
      const result = await routeService.getRouteById(id, true);

      expect(findByPk).toHaveBeenCalled();

      expect(result).toEqual(mock.get({ plain: true }));
    });
  });

  describe('RouteService_getRouteByName', () => {
    it('should return route details from the db', async () => {
      const mockRouteDetails = { id: 1, name: 'Yaba', imgUrl: 'images://an-img.png' };
      jest.spyOn(routeService, 'findOneByProp').mockResolvedValue(mockRouteDetails);
      const routeDetails = await routeService.getRouteByName('Yaba');
      expect(routeDetails).toEqual(mockRouteDetails);
    });
  });

  describe('RouteService_serializeData', () => {
    it('should combine all route info into one object', () => {
      const res = RouteServiceHelper.serializeRouteBatch(routeBatch);
      expect(res).toHaveProperty('capacity');
      expect(res).toHaveProperty('driverPhoneNo');
      expect(res).toHaveProperty('regNumber');
      expect(res).toHaveProperty('status');
      expect(res).toHaveProperty('name');
      expect(res).toHaveProperty('batch');
      expect(res).toHaveProperty('destination');
      expect(res).toHaveProperty('imageUrl');
    });
  });

  describe('RouteService_convertToSequelizeOrderByClause', () => {
    it('should convert sort object to sequelize order array  ', () => {
      const sort = [
        { predicate: 'name', direction: 'asc' },
        { predicate: 'destination', direction: 'asc' },
        { predicate: 'driverName', direction: 'asc' },
        { predicate: 'driverPhoneNo', direction: 'asc' },
        { predicate: 'regNumber', direction: 'asc' },
      ];
      const result = routeService.convertToSequelizeOrderByClause(sort);
      expect(result).toEqual([[{ model: Route, as: 'route' }, 'name', 'asc'],
        [{ cab: { model: Cab, as: 'cabDetails' },
          route: { model: Route, as: 'route' },
          riders: { model: User, as: 'riders' },
          destination: { model: Address, as: 'destination' },
          homebase: { model: Homebase, as: 'homebase' } },
      { model: Address, as: 'destination' },
          'address',
          'asc'],
    [{ model: Cab, as: 'cabDetails' }, 'driverName', 'asc'],
    [{ model: Cab, as: 'cabDetails' }, 'driverPhoneNo', 'asc'],
    [{ model: Cab, as: 'cabDetails' }, 'regNumber', 'asc']]);
    });
  });

  describe('RouteService_updateDefaultInclude', () => {
    it('should should update default include', () => {
      const where = {
        name: 'Island',
      };
      const result = routeService.updateDefaultInclude(where);
      expect(result.length).toEqual(4);
      expect(result[2]).toHaveProperty('where');
      expect(result[2].where).toHaveProperty('name');
    });
  });
  describe('Route Ratings', () => {
    it('should execute query ', async () => {
      const mockData = [[]];
      const querySpy = jest.spyOn(database, 'query');
      querySpy.mockReturnValue(mockData);
      const results = await routeService.routeRatings();
      expect(querySpy).toBeCalled();
      expect(results).toEqual(mockData);
    });
  });

  describe('RouteService > defaultRouteDetails', () => {
    it('should return a list of default values (route details)', () => {
      const values = routeService.defaultRouteDetails;
      expect(values).toEqual(expect.arrayContaining(
        ['id', 'status', 'capacity', 'takeOff', 'batch', 'comments']));
    });
  });

  describe('RouteService > defaultRouteGroupBy', () => {
    it('should return a list of default groupBy values', () => {
      const values = routeService.defaultRouteGroupBy();
      expect(values).toEqual(expect.arrayContaining(
        ['RouteBatch.id', 'cabDetails.id', 'route.id', 'route->destination.id'],
        ));
    });
  });
  describe('RouteService > defaultPageable', () => {
    it('should return the default pageable', () => {
      const values = routeService.defaultPageable();
      expect(values).toEqual({ page: 1,
        size: 4294967295,
        sort: [{ direction: 'asc', predicate: 'id' }] });
    });
  });

  describe('RouteService > updateBatchLabel', () => {
    it('should update the batch label if the route batch was not created', async() => {
      jest.spyOn(routeService, 'getRouteById').mockImplementationOnce(() => (routeMock[1].get()));
      const updatedLabel = await routeService.updateBatchLabel({
        route: { id: 1 }, created: false });
      expect(updatedLabel).toEqual('B');
    });
  });
});
