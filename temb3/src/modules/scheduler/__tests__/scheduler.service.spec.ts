import request from 'request';
import { SchedulerService } from '../scheduler.service';
import { mockRedisCache, bullRedisMock } from '../../../__mocks__/index';

describe('SchedulerService', () => {
  let job: any;
  const cache = mockRedisCache;
  const bullRedis = bullRedisMock;
  let schedulerService: SchedulerService;

  beforeEach(() => {
    job = {
      data: {
        callbackUrl: 'https/job',
        data: {},
        clientId: 'tem',
      },
    };
    jest
      .spyOn(cache, 'fetchObject')
      .mockResolvedValue({ clientId: 'tem', clientSecret: 'xmnxnxnxn' });
    schedulerService = new SchedulerService(cache, bullRedis);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('SchedulerService.prototype.jobProcessor', () => {
    it('Should process a job', async (done) => {
      // console.log('Test must be here');
      done();
    });
  });
});
