import { joinRouteRequestService } from '../joinRouteRequest.service';
import { Bugsnag } from '../../../helpers/bugsnagHelper';
import JoinRequest from '../../../database/models/join-request';

describe('joinRouteRequestService', () => {
  let create: any;
  let findByPk: any ;
  const mockData = {
    id: 1,
    status: 'Pending',
    engagement: { engagementId: 1 },
    manager: { managerId: 2 },
    routeBatch: { routeBatchId: 1 },
  };

  const joinRequestData = {
    get: ({ plain }: { plain: boolean }) => (plain ? mockData : null),
  };
  beforeEach(() => {
    create = jest.spyOn(JoinRequest, 'create');
    findByPk = jest.spyOn(JoinRequest, 'findByPk').mockReturnValue(joinRequestData);
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('createJoinRouteRequest', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should create a new join route request', async () => {
      create.mockReturnValue(joinRequestData);
      const result = await joinRouteRequestService.createJoinRouteRequest(1, 2, 1);
      expect(result).toEqual(joinRequestData);
      expect(create).toBeCalledTimes(1);
      expect(create.mock.calls[0][0].status)
        .toEqual('Pending');
      expect(create.mock.calls[0][0].managerId)
        .toEqual(2);
    });
    it('should log on error on bugsnag', async () => {
      create.mockImplementationOnce(() => { throw new Error('very error'); });
      const spy = jest.spyOn(Bugsnag.prototype, 'log');
      await joinRouteRequestService.createJoinRouteRequest(1, 2, 1, 'comment');
      expect(spy).toBeCalledWith(new Error('very error'));
    });
  });

  it('should update join route request', async () => {
    jest.spyOn(joinRouteRequestService, 'getJoinRouteRequest').mockImplementationOnce(
      () => (joinRequestData));
    jest.spyOn(JoinRequest, 'update').mockResolvedValue([, [{
      get: () => (mockData),
    }]]);
    const data = { ...joinRequestData.get({ plain: true }) };
    const result = await joinRouteRequestService.updateJoinRouteRequest(1, data);
    expect(result).toEqual(data);
  });

  describe('getJoinRouteRequest', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should fetch a join route request by pk from database', async () => {
      const result = await joinRouteRequestService.getJoinRouteRequest(1);
      expect(findByPk).toBeCalled();
      expect(result).toEqual(joinRequestData.get({ plain: true }));
    });
  });
});
