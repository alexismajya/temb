import appEventService from '../app-event.service';
import weeklyReportSender from '../../../helpers/email/weeklyReportSender';
import providerReportSender from '../../../helpers/email/providerReportSender';
import { reportEventHandler } from '../reports-events.handlers';
import SlackNotifications from '../../slack/SlackPrompts/Notifications';

describe('ReportsEventHandlers', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should register report events subscriptions', () => {
    jest.spyOn(appEventService, 'subscribe');
    reportEventHandler.init();
    expect(appEventService.subscribe).toHaveBeenCalled();
  });

  it('should trigger the send weekly mail method', async () => {
    jest.spyOn(weeklyReportSender, 'send');
    await reportEventHandler.sendWeeklyReport();
    expect(weeklyReportSender.send).toHaveBeenCalled();
  });

  it('should trigger the send  providers report', async () => {
    jest.spyOn(providerReportSender, 'sendEamilReport');
    jest.spyOn(SlackNotifications, 'sendOpsProvidersTripsReport');
    await reportEventHandler.sendProvidersReport();
    expect(providerReportSender.sendEamilReport).toHaveBeenCalled();
    expect(SlackNotifications.sendOpsProvidersTripsReport).toHaveBeenCalled();
  });
});
