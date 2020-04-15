import { BaseService } from './../../shared/base.service';
import database from '../../../database';
import Cache from '../../shared/cache';
import routeRequestService, { RouteRequestService } from '../route-request.service';
import { mockRouteData, mockRouteRequestData } from '../../../services/__mocks__';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';

const { models: { RouteRequest, Cab } } = database;

describe(RouteRequestService, () => {
  let create: any;
  let findByPk: any;
  let updateSpy: any;
  let save: any;
  let findAll: any;
  let findOne: any;

  beforeEach(() => {
    create = jest.spyOn(BaseService.prototype, 'add');
    findByPk = jest.spyOn(RouteRequest, 'findByPk');
    updateSpy = jest.spyOn(BaseService.prototype, 'update');
    save = jest.spyOn(Cache, 'save');
    findAll = jest.spyOn(RouteRequest, 'findAll');
    findOne = jest.spyOn(Cab, 'findOne');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe(RouteRequestService.prototype.findByPk, () => {
    it('should find route request by Id', async () => {
      findByPk.mockResolvedValue(mockRouteData);
      const result = await routeRequestService.findByPk(1);
      expect(result).toEqual(mockRouteData);
    });
  });

  describe(RouteRequestService.prototype.createRoute, () => {
    it('should create new route request', async () => {
      const {
        engagement: { id: engagementId },
        home: { id: homeId },
        busStop: { id: busStopId },
        manager: { id: managerId },
      } = mockRouteRequestData;
      create.mockReturnValue(mockRouteRequestData);
      const result = await routeRequestService.createRoute({
        engagementId,
        homeId,
        busStopId,
        managerId,
      });
      expect(create)
        .toHaveBeenCalledTimes(1);
      expect(create.mock.calls[0][0].status)
        .toEqual('Pending');
      expect(create.mock.calls[0][0].managerId)
        .toEqual(1);
      expect(result)
        .toEqual(mockRouteRequestData);
    });
  });

  describe(RouteRequestService.prototype.update, () => {
    it('should update route request', async () => {
      const id = 999;

      updateSpy.mockResolvedValue(mockRouteRequestData);
      save.mockImplementation(() => ({}));
      const result = await routeRequestService.update(id, {
        opsComment: 'ZZZZZZ',
      });
      expect(result).toEqual(mockRouteRequestData);
    });
  });

  describe(RouteRequestService.prototype.getRouteRequest, () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.restoreAllMocks();
    });
    it('should save on database and cache', async () => {
      const id = 123;
      const mock = {
        ...mockRouteRequestData,
        id,
      };
      findByPk.mockReturnValue(mock);
      const result = await routeRequestService.getRouteRequest(id);

      expect(findByPk).toHaveBeenCalled();
      expect(result).toEqual(mock);
    });
  });

  describe(RouteRequestService.prototype.getRouteRequestAndToken, () => {
    let detailsSpy: any;
    let routeRequestSpy: any;
    beforeEach(() => {
      detailsSpy = jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken')
        .mockResolvedValue('xoop-sadasds');
      routeRequestSpy = jest.spyOn(routeRequestService, 'getRouteRequest')
        .mockResolvedValue(null);
    });
    afterEach(() => {
      jest.restoreAllMocks();
      jest.restoreAllMocks();
    });
    it('should return route request and bot token', async () => {
      const routeRequestId = 1;
      const teamId = 'BBBBCCC';
      const result = await routeRequestService.getRouteRequestAndToken(
        routeRequestId, teamId,
      );

      expect(detailsSpy).toHaveBeenCalledWith(expect.any(String));
      expect(routeRequestSpy).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toBeDefined();
    });
  });

  describe(RouteRequestService.prototype.getAllConfirmedRouteRequests, () => {
    it('should find all confirmed route requests', async () => {
      const homebaseId = 14;
      findAll.mockResolvedValue([mockRouteData]);
      const allConfirmedRouteRequests = await routeRequestService
        .getAllConfirmedRouteRequests(homebaseId);
      expect(allConfirmedRouteRequests).toEqual([mockRouteData]);
    });
  });

  describe(RouteRequestService.prototype.getCabCapacity, () => {
    it('should get cab capacity', async () => {
      const regNumber = '14R635';
      const result = {
        get: (): undefined => undefined,
      };

      findOne.mockResolvedValue(result);
      const getCabCapacity = await routeRequestService.getCabCapacity(regNumber);
      expect(getCabCapacity).toEqual(0);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.restoreAllMocks();
  });
});
