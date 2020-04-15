import moment from 'moment';
import { tripEvents } from '../../../modules/events/trip-events.contants';
import { IEventPayload } from '../../../modules/events/app-event.service';
import schedulerService from '../../../modules/shared/scheduler';
import env from '../../../config/environment';
import BugsnagHelper from '../../../helpers/bugsnagHelper';
import TripRequest from '../../../database/models/trip-request';

const getNotificationTimeout = (dateTime: string, op: 'add' | 'subtract', timeout: number) => {
  return moment(dateTime)[op](timeout, 'minutes').toISOString();
};

export default class TripJobs {
  static scheduleCompletionReminder = async (payload: IEventPayload<{
    id: number; departureTime: string; }>) => {
    try {
      const time = getNotificationTimeout(payload.data.departureTime, 'add',
        env.TRIP_COMPLETION_TIMEOUT);

      await schedulerService.schedule({
        time,
        isRecurring: false,
        payload: {
          key: `${tripEvents.tripCompleted}_${payload.data.id}`,
          args: {
            name: tripEvents.tripCompleted,
            data: {
              data: { id: payload.data.id },
              botToken: payload.botToken,
            },
          },
        },
      });
    } catch (err) {
      BugsnagHelper.log(err);
    }
  }

  /**
   * schedules trip reminder job to send notifications to rider and driver
   * @param trip
   */
  static scheduleTakeOffReminder = async (payload: IEventPayload<TripRequest>) => {
    try {
      const time = getNotificationTimeout(payload.data.departureTime, 'subtract',
        env.TAKEOFF_TIMEOUT);
      await schedulerService
        .schedule({
          time,
          isRecurring: false,
          payload: {
            key: `${tripEvents.takeOffReminder}_${payload.data.id}`,
            args: {
              name: tripEvents.takeOffReminder,
              data: {
                data: { id: payload.data.id },
                botToken: payload.botToken,
              },
            },
          },
        });
    } catch (err) {
      BugsnagHelper.log(err);
    }
  }

  static scheduleAutoApprove = async (payload: IEventPayload<TripRequest>) => {
    try {
      const time = getNotificationTimeout(payload.data.departureTime, 'subtract',
        env.TRIP_AUTO_APPROVE_TIMEOUT);
      const eventPayload = {
        name: tripEvents.autoApprovalNotification,
        data: {
          data: { id: payload.data.id },
          botToken: payload.botToken,
        },
      };

      await schedulerService.schedule({
        time,
        payload: {
          key: `${tripEvents.autoApprovalNotification}__${payload.data.id}`,
          args: eventPayload,
        },
      });
    } catch (error) {
      BugsnagHelper.log(error);
    }
  }
}
