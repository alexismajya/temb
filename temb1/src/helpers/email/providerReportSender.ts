import EmailService from '../../modules/emails/EmailService';
import BugsnagHelper from '../bugsnagHelper';
import providerMonthlyReport, { CommChannel, IHomebaseReport } from '../../modules/report/providerMonthlyReport';

export class ProviderReportSender {
  constructor(public emailService: EmailService) {
  }

  async sendEamilReport() {
    try {
      const providersReport = await providerMonthlyReport.generateData(CommChannel.email);
      const emails = Object.keys(providersReport);
      if (emails.length) {
        const promises = emails.map((email) => this.sendMail(email, providersReport[email]));
        await Promise.all(promises);
      }
    } catch (e) {
      BugsnagHelper.log(e);
    }
  }

  async sendMail(email: string, data: IHomebaseReport) {
    if (process.env.TEMBEA_MAIL_ADDRESS) {
      await this.emailService.sendMail({
        from: `TEMBEA <${process.env.TEMBEA_MAIL_ADDRESS}>`,
        to: email,
        subject: 'Montly Report for Your Taken trips',
        template: 'providers',
        'h:X-Mailgun-Variables': JSON.stringify(data),
      });
    } else {
      BugsnagHelper.log('TEMBEA_MAIL_ADDRESS  has not been set in the .env');
    }
  }
}
const providerReportSender = new ProviderReportSender(new EmailService());
export default providerReportSender;
