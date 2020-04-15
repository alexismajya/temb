import RouteJobs from '../../../services/jobScheduler/jobs/RouteJobs';
import RouteEventHandlers from '../route-events.handlers';
import { mockRouteBatchData, mockUserLeavesRouteHandler } from '../../../services/__mocks__';
import RouteUseRecordService from '../../../services/RouteUseRecordService';
import { route, recordData } from '../../../helpers/__mocks__/BatchUseRecordMock';
import appEvents, { IEventPayload } from '../app-event.service';
import { routeEvents } from '../route-events.constants';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import RouteNotifications from '../../slack/SlackPrompts/notifications/RouteNotifications';
import SlackNotifications from '../../slack/SlackPrompts/Notifications';
import { homebaseService } from '../../homebases/homebase.service';
import { routeBatchService } from '../../routeBatches/routeBatch.service';

describe('RouteEventHandlers', () => {
  let botToken: any;
  const testPayload: IEventPayload = { data: { id: 1 } };

  beforeEach(() => {
    botToken = 'xop-637536516';
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('sendTakeOffAlerts', () => {
    it('should send takeoff alerts to driver and route riders', async (done) => {
      jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockReturnValue(mockRouteBatchData);
      jest.spyOn(RouteNotifications, 'sendRouteTripReminder').mockReturnValue();
      jest.spyOn(RouteJobs, 'scheduleTripCompletionNotification').mockReturnValue();
      jest.spyOn(RouteNotifications, 'sendWhatsappRouteTripReminder').mockReturnValue();
      jest.spyOn(RouteUseRecordService, 'create').mockResolvedValue(recordData);
      await RouteEventHandlers.sendTakeOffAlerts({  botToken, data: { batchId: 1 } });
      expect(routeBatchService.getRouteBatchByPk).toHaveBeenCalled();
      expect(RouteJobs.scheduleTripCompletionNotification)
        .toHaveBeenCalledWith(expect.objectContaining({ recordId: recordData.id }));
      done();
    });

    it('should handle error when shit happens', async (done) => {
      const err = new Error('Shit happened');
      jest.spyOn(bugsnagHelper, 'log').mockImplementation();
      jest.spyOn(routeBatchService, 'getRouteBatchByPk')
        .mockRejectedValue(err);
      await RouteEventHandlers.sendTakeOffAlerts(testPayload);
      expect(bugsnagHelper.log).toHaveBeenCalledWith(err);
      done();
    });
  });

  describe('sendCompletionNotification', () => {
    it('should send trip completion notification to rider', async (done) => {
      route.batch.riders = [{
        id: 1107,
        name: 'Test User',
        slackId: '3244ffeef-d3a8-43a4-8483-df81eda7e0a4',
        email: 'testUser@gmail.com',
        routeBatchId: 1025,
      }];

      jest.spyOn(RouteUseRecordService, 'getByPk').mockReturnValue(route);
      jest.spyOn(RouteNotifications, 'sendRouteUseConfirmationNotificationToRider').mockReturnValue('');
      await RouteEventHandlers.sendCompletionNotification(testPayload);
      expect(RouteUseRecordService.getByPk).toHaveBeenCalled();
      expect(RouteNotifications.sendRouteUseConfirmationNotificationToRider).toHaveBeenCalled();
      done();
    });

    it('should do nothing when record details is incomplete', async (done) => {
      jest.spyOn(RouteUseRecordService, 'getByPk').mockReturnValue();
      jest.spyOn(RouteNotifications, 'sendRouteUseConfirmationNotificationToRider').mockReturnValue('');
      await RouteEventHandlers.sendCompletionNotification({ ...testPayload, botToken: 'fdfdfjoj' });
      expect(RouteNotifications.sendRouteUseConfirmationNotificationToRider).not.toHaveBeenCalled();
      done();
    });
  });

  describe('should registe subscribers', () => {
    it('should call the handler', (done) => {
      const testData = { batchId: 3 };
      jest.spyOn(RouteEventHandlers, 'sendTakeOffAlerts').mockResolvedValue();

      RouteEventHandlers.init();
      appEvents.broadcast({ name: routeEvents.takeOffAlert, data: testData });

      setTimeout(() => {
        expect(RouteEventHandlers.sendTakeOffAlerts).toHaveBeenCalledWith(testData);
        done();
      }, 3000);
    });
  });

  describe('user leaves route notification', () => {
    it('should send a notification when the user leaves a route', async () => {
      const {
        payload,
        userName,
        routeName,
        riders,
      } = mockUserLeavesRouteHandler;
      jest.spyOn(SlackNotifications, 'sendNotifications').mockResolvedValue();
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue();
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue(
        { channel: 'OPSCHANNEL' },
      );
      await RouteEventHandlers.handleUserLeavesRouteNotification(
        payload,
        userName,
        routeName,
        riders,
      );
      expect(SlackNotifications.sendNotifications).toHaveBeenCalled();
    });
  });

  describe('handle New Route Batch Data', () => {
    const routeTripReminderMock = {
      botToken,
      routeBatch: {
        id: 1,
        takeOff: 'DD:DD',
      },
    };

    it('should schedule take off reminder time', async (done) => {
      jest.spyOn(RouteJobs, 'scheduleTakeOffReminder').mockReturnValue();
      await RouteEventHandlers.handleNewRouteBatch(routeTripReminderMock);
      expect(RouteJobs.scheduleTakeOffReminder).toHaveBeenCalledWith(routeTripReminderMock);
      done();
    });
  });
});
