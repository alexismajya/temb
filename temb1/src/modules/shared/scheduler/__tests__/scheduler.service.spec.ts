import { SchedulerService, IScheduleRequest } from '../scheduler.service';
import { schedulerDeps as deps } from '../__mocks__/scheduler.service';

describe(SchedulerService, () => {
  let scheduler: SchedulerService;
  let testRequest: IScheduleRequest;

  beforeAll(() => {
    scheduler = new SchedulerService(deps.config, deps.appEvents,
      deps.httpClient, deps.logger);

    testRequest = {
      payload: {
        key: 'TEST_KEY_123',
        args: {
          name: 'TEST_EVENT_123',
          data: {
            data: {
              id: 123,
            },
          },
        },
      },
    };
  });

  it('should instantiate a scheduler service', () => {
    expect(scheduler).toBeDefined();
  });

  describe(SchedulerService.prototype.schedule, () => {
    it('should send a post request to specfied enpoint', async () => {
      await scheduler.schedule({ ...testRequest });

      expect(deps.httpClient.post).toHaveBeenCalledWith(expect.objectContaining({
        url: deps.config.url,
        body: expect.objectContaining(testRequest),
      }));
    });

    it('should use specified callback url when provided', async () => {
      const testRequestWithCallback = { ...testRequest };
      const testCallback = 'callback_tester';
      testRequestWithCallback.payload.callbackUrl = testCallback;
      await scheduler.schedule({ ...testRequestWithCallback });

      expect(deps.httpClient.post).toHaveBeenCalledWith(expect.objectContaining({
        url: deps.config.url,
        body: expect.objectContaining({
          payload: expect.objectContaining({
            callbackUrl: testCallback,
          }),
        }),
      }));
    });

    it('should handle error when it occurs', async () => {
      await scheduler.schedule(null);

      expect(deps.logger.error).toHaveBeenCalled();
    });
  });

  describe(SchedulerService.prototype.handleJob, () => {
    it('should call appEvents.broadcast', () => {
      const testJob = { ...testRequest.payload.args };

      scheduler.handleJob(testJob);
      expect(deps.appEvents.broadcast).toHaveBeenCalledWith(testJob);
    });
  });
});
