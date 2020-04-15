import moment from 'moment-timezone';
import { routeEvents } from '../../../modules/events/route-events.constants';
import schedulerService from '../../../modules/shared/scheduler';

export interface IRouteTripCompletionArgs {
  recordId: number;
  takeOff: string;
  botToken: string;
}

export interface IRouteTripReminderArgs {
  routeBatch: {
    id: number;
    takeOff: string;
  };
  botToken: string;
}

export interface ITimeAllowanceArgs {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export default class RouteJobs {
  static async scheduleTakeOffReminder(payload: IRouteTripReminderArgs) {
    const { routeBatch, botToken } = payload;
    const allowance = process.env.NODE_ENV === 'production' ? { minutes: -15 } : { minutes: -1 };
    const time = RouteJobs.getTodayTime(routeBatch.takeOff, allowance);
    schedulerService.schedule({
      cron: {
        isSequential: false,
        repeatTime: time,
      },
      isRecurring: true,
      payload: {
        key: `${routeEvents.takeOffAlert}__${routeBatch.id}`,
        args: {
          name: routeEvents.takeOffAlert,
          data: {
            botToken,
            data: { id: routeBatch.id },
          },
        },
      },
    });
  }

  static scheduleTripCompletionNotification(payload: IRouteTripCompletionArgs) {
    const { recordId, takeOff, botToken } = payload;
    const allowance = process.env.NODE_ENV === 'production' ? { hours: 2 } : { minutes: 1 };
    const time = RouteJobs.getTodayTime(takeOff, allowance);
    schedulerService.schedule({
      cron: {
        isSequential: false,
        repeatTime: time,
      },
      isRecurring: true,
      payload: {
        key: `${routeEvents.completionNotification}__${recordId}`,
        args: {
          name: routeEvents.completionNotification,
          data: { botToken, data: { id: recordId } },
        },
      },
    });
  }

  static getTodayTime(time: string, { hours = 0, minutes = 0, seconds = 0 } : ITimeAllowanceArgs,
    tz = 'Africa/Nairobi') {
    const date = moment(new Date(), 'MM/DD/YYYY')
      .format('MM/DD/YYYY');
    const timeAdded = { hours, minutes, seconds };
    return moment.tz(`${date} ${time}`, 'MM/DD/YYYY HH:mm', tz)
      .add(timeAdded)
      .format('DD-MM HH:mm');
  }
}
