import appEvents, { IEventPayload } from './app-event.service';
import { routeEvents, RouteSocketEvents } from './route-events.constants';
import RouteUseRecordService from '../../services/RouteUseRecordService';
import RouteJobs, { IRouteTripReminderArgs } from '../../services/jobScheduler/jobs/RouteJobs';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import RouteNotifications from '../slack/SlackPrompts/notifications/RouteNotifications';
import { homebaseService } from '../homebases/homebase.service';
import { IUser } from '../../database/models/interfaces/user.interface';
import { routeBatchService } from '../routeBatches/routeBatch.service';
import routeRequestService from '../routes/route-request.service';
import RouteRequest from '../../database/models/route-request';
import WebSocketEvents from './web-socket-event.service';

export default class RouteEventHandlers {
  static init() {
    appEvents.subscribe(routeEvents.takeOffAlert, RouteEventHandlers.sendTakeOffAlerts);
    appEvents.subscribe(routeEvents.completionNotification,
      RouteEventHandlers.sendCompletionNotification);
    appEvents.subscribe(routeEvents.newRouteBatchCreated, RouteEventHandlers.handleNewRouteBatch);
    appEvents.subscribe(
      RouteSocketEvents.newRouteRequest,
      RouteEventHandlers.handleNewRouteRequest
    );
  }

  static async sendTakeOffAlerts({ data: { id: batchId }, botToken }: IEventPayload) {
    try {
      const batchWithRiders = await routeBatchService.getRouteBatchByPk(batchId, true);
      if (batchWithRiders.riders && batchWithRiders.riders.length > 0) {
        const record = await RouteUseRecordService.create(batchId);
        const { riders, takeOff, driver } = batchWithRiders;
        // send reminder to the driver
        RouteNotifications.sendWhatsappRouteTripReminder(driver, batchWithRiders);

        await Promise.all(riders.map((rider: IUser) => {
          RouteNotifications.sendRouteTripReminder({ rider, batch: batchWithRiders }, botToken);
        }));
        RouteJobs.scheduleTripCompletionNotification({
          takeOff, botToken, recordId: record.id,
        });
      }
    } catch (_) {
      bugsnagHelper.log(_);
    }
  }

  static async sendCompletionNotification({ data: { id: recordId }, botToken }: IEventPayload) {
    const record = await RouteUseRecordService.getByPk(recordId, true);
    if (record && record.batch && record.batch.riders && record.batch.riders.length > 0) {
      const { riders } = record.batch;
      // tslint:disable-next-line: max-line-length
      await Promise.all(riders.map((rider: IUser) => RouteNotifications.sendRouteUseConfirmationNotificationToRider({ rider, record }, botToken)));
    }
  }

  static async handleUserLeavesRouteNotification(
    payload: any,
    userName: string,
    routeName: string,
    riders: IUser[],
  ) {
    const {
      user: { id: slackId },
    } = payload;

    const { channel: channelId } = await homebaseService.getHomeBaseBySlackId(slackId);
    await RouteNotifications.sendUserLeavesRouteMessage(
      channelId,
      payload,
      userName,
      { routeName, riders },
    );
  }

  static async handleNewRouteBatch(data: IRouteTripReminderArgs) {
    return RouteJobs.scheduleTakeOffReminder(data);
  }

  // Created only for testing purposes
  static getSocketService(io?: any) {
    return new WebSocketEvents(io);
  }

  static handleNewRouteRequest({ data }: IEventPayload<RouteRequest>) {
    try {
      RouteEventHandlers.getSocketService().broadcast(RouteSocketEvents.newRouteRequest, data);
    } catch (err) { bugsnagHelper.log(err); }
  }
}
