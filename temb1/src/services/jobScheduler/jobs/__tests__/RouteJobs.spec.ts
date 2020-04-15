import RouteJobs, { ITimeAllowanceArgs } from '../RouteJobs';
import schedulerService from '../../../../modules/shared/scheduler';
import { routeEvents } from '../../../../modules/events/route-events.constants';

const toggleEnvironment = (env: string) => {
  process.env.NODE_ENV = process.env.NODE_ENV === 'test' ? env : 'test';
};

const env = 'production';

describe(RouteJobs, () => {
  const dummyBatches = [
    {
      id: 1,
      capacity: 3,
      takeOff: '05:30',
    },
    {
      id: 2,
      capacity: 4,
      takeOff: '06:00',
    },
  ];
  const botToken = 'xoxp-1234';

  beforeEach(() => {
    jest.spyOn(schedulerService, 'schedule').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe(RouteJobs.scheduleTakeOffReminder, () => {
    const theTest = async (allowance: ITimeAllowanceArgs) => {
      const testBatch = { ...dummyBatches[0] };
      await RouteJobs.scheduleTakeOffReminder({ botToken, routeBatch: testBatch });
      expect(schedulerService.schedule).toHaveBeenCalledWith(expect.objectContaining({
        cron: {
          isSequential: false,
          repeatTime: expect.stringContaining('-' && ':' && ' '),
        },
        isRecurring: true,
        payload: expect.objectContaining({
          key: expect.stringContaining(testBatch.id.toString()),
          args: {
            name: routeEvents.takeOffAlert,
            data: {
              botToken,
              data: expect.any(Object),
            },
          },
        }),
      }));
    };

    it('should send a reminder message to the user before trip', async (done) => {
      await theTest({ minutes: -1 });
      done();
    });

    it('should toggle time based on environment', async (done) => {
      toggleEnvironment(env);
      await theTest({ minutes: -15 });
      toggleEnvironment(env);
      done();
    });
  });

  describe(RouteJobs.scheduleTripCompletionNotification, () => {
    const theTest = async (allowance: ITimeAllowanceArgs) => {
      const testDummy = { takeOff: '06:00', recordId: 2, botToken: 'token' };
      await RouteJobs.scheduleTripCompletionNotification(testDummy);

      expect(schedulerService.schedule).toHaveBeenCalledWith(expect.objectContaining({
        cron: {
          isSequential: false,
          repeatTime: expect.stringContaining('-' && ':' && ' '),
        },
        isRecurring: true,
        payload: expect.objectContaining({
          key: expect.stringContaining(testDummy.recordId.toString()),
        }),
      }));
    };

    it('should send post-trip notifications successfully', async (done) => {
      await theTest({ minutes: 1 });
      done();
    });

    it('should send post-trip notifications successfully', async (done) => {
      toggleEnvironment(env);
      await theTest({ hours: 2 });
      toggleEnvironment(env);
      done();
    });
  });
});
