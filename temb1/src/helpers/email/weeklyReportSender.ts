import weeklyReportGenerator, { IUserData } from '../../modules/report/weeklyReportGenerator';
import EmailService from '../../modules/emails/EmailService';
import BugsnagHelper from '../bugsnagHelper';
import Utils from '../../utils';

import userService from '../../modules/users/user.service';

class WeeklyReportSender {
  emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async send() {
    try {
      const allUserData = await this.getWeeklyEmailReport();
      const users = Object.keys(allUserData);
      users.length ? await this.sendMail(allUserData, users) : '';
    } catch (e) {
      BugsnagHelper.log(e);
    }
  }

  async getWeeklyEmailReport() {
    const lastWeekDate = Utils.getLastWeekStartDate('YYYY-MM-DD');
    const tripData = await userService.getWeeklyCompletedTrips(lastWeekDate);
    const routeTripData = await userService.getWeeklyCompletedRoutes(lastWeekDate);
    return weeklyReportGenerator.generateEmailData(tripData, routeTripData);
  }

  async sendMail(recipientVars: IUserData, users: string[]) {
    if (process.env.TEMBEA_MAIL_ADDRESS) {
      await this.emailService.sendMail({
        from: `TEMBEA <${process.env.TEMBEA_MAIL_ADDRESS}>`,
        to: users,
        subject: 'Weekly Report for Your Taken trips',
        template: 'weeklyReport',
        'recipient-variables': recipientVars,
      });
    } else {
      BugsnagHelper.log('TEMBEA_MAIL_ADDRESS  has not been set in the .env');
    }
  }
}

export const weeklyReportSender = new WeeklyReportSender();
export default weeklyReportSender;
