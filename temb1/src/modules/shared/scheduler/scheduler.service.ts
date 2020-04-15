import { AppEvents, IEventPayload } from '../../events/app-event.service';
import { RequestPromiseAPI } from 'request-promise-native';
import ILogger from '../logging/logger.interface';

export interface IScheduleRequest<T = { id: any}> {
  isRecurring?: boolean;
  time?: string;
  cron?: {
    isSequential: boolean;
    repeatTime?: string;
    repeatSequence?: string;
  };
  timeZone?: string;
  payload: {
    queueName?: string;
    callbackUrl?: string;
    key: string;
    args: {
      name: string;
      data: IEventPayload<T>
    };
  };
}

export interface ISchedulerConfig {
  clientId: string;
  clientSecret: string;
  defaultCallbackUrl: string;
  url: string;
}

export class SchedulerService {
  constructor(
    private readonly config: ISchedulerConfig,
    private readonly appEvents: AppEvents,
    private readonly httpClient: RequestPromiseAPI,
    private readonly logger: ILogger) { }

  async schedule(data: IScheduleRequest, retry = 3) {
    try {
      data.payload.callbackUrl = data.payload.callbackUrl || this.config.defaultCallbackUrl;
      const options = {
        url: this.config.url,
        body: data,
        headers: {
          'client-id': this.config.clientId,
          'client-secret': this.config.clientSecret,
        },
        json: true,
      };
      await this.httpClient.post(options);
    } catch (err) {
      this.logger.error(err);
    }
  }

  handleJob(job: { name: string; data: IEventPayload }) {
    this.appEvents.broadcast(job);
  }
}
