import appEvents from './app-event.service';
import { reportSchedules } from './reports-events.constants';
import weeklyReportSender from '../../helpers/email/weeklyReportSender';
import providerReportSender from '../../helpers/email/providerReportSender';
import SlackNotifications from '../slack/SlackPrompts/Notifications';

class ReportsEventHandlers {
  init() {
    appEvents.subscribe(reportSchedules.weeklyReport, this.sendWeeklyReport);
    appEvents.subscribe(reportSchedules.providerReport, this.sendProvidersReport);
  }

  async sendWeeklyReport() {
    await weeklyReportSender.send();
  }

  async sendProvidersReport() {
    await providerReportSender.sendEamilReport();
    await SlackNotifications.sendOpsProvidersTripsReport();
  }
}

export const reportEventHandler = new ReportsEventHandlers();
export default ReportsEventHandlers;
