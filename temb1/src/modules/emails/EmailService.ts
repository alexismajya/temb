import mailgun from 'mailgun-js';
import BugsnagHelper from '../../helpers/bugsnagHelper';

class EmailService {
  client: any;
  constructor() {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;

    if (apiKey && domain) {
      const options = {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
        from: process.env.MAILGUN_SENDER,
      };
      this.client = mailgun(options);
    } else {
      BugsnagHelper.log('Either MAILGUN_API_KEY or '
        + 'MAILGUN_DOMAIN has not been set in the .env ');
    }
  }

  /**
 *
 * @param mailOptions  {from, to, subject, html, attachment }
 * sender and receiver are emails
 * attachment can be an array ['pathToFile1', 'pathToFile2']
 */
  async sendMail(mailOptions: ISendMailOptions) {
    if (this.client) {
      const res = await this.client.messages().send(mailOptions);
      return res;
    }
    return 'failed';
  }
}

export interface ISendMailOptions {
  from: string;
  to: string | string[];
  subject?: string;
  html?: string;
  attachment?: any[];
  template?: string;
  'recipient-variables'?: {[key: string] : any};
  'h:X-Mailgun-Variables'?: string;
}

export default EmailService;
