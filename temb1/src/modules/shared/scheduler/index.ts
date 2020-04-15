import { SchedulerService } from './scheduler.service';
import env from '../../../config/environment';
import appEvents from '../../events/app-event.service';
import request from 'request-promise-native';
import bugsnagHelper from '../../../helpers/bugsnagHelper';

const schedulerConfig = {
  url: env.SCHEDULER_URL,
  clientId: env.SCHEDULER_CLIENT_ID,
  clientSecret: env.SCHEDULER_CLIENT_SECRET,
  defaultCallbackUrl: env.SCHEDULER_DEFAULT_CALLBACK_URL,
};

const schedulerService = new SchedulerService(schedulerConfig, appEvents, request, bugsnagHelper);

export default schedulerService;
