import { SchedulerService } from '../scheduler.service';
import { RequestPromiseAPI } from 'request-promise-native';
import ILogger from '../../logging/logger.interface';
import { AppEvents } from '../../../events/app-event.service';

export const schedulerDeps = {
  config: {
    url: 'hello',
    clientId: 'how are you',
    clientSecret: 'welcome',
    defaultCallbackUrl: 'tembea',
  },
  httpClient: {
    post: jest.fn().mockResolvedValue('OK'),
  } as unknown as RequestPromiseAPI,
  logger: {
    error: jest.fn(),
  } as unknown as ILogger,
  appEvents: {
    broadcast: jest.fn(),
  } as unknown as AppEvents,
};

const mockSchedulerService = new SchedulerService(
  schedulerDeps.config, schedulerDeps.appEvents,
  schedulerDeps.httpClient, schedulerDeps.logger,
);

export default mockSchedulerService;
