import { resolve } from 'path';
import fs from 'fs';
import BugsnagHelper from '../helpers/bugsnagHelper';
import EmailService from '../modules/emails/EmailService';
require('../load-env');

class UploadWeeklyTemplate extends EmailService  {
  domain = process.env.MAILGUN_DOMAIN;
  constructor() {
    super();
  }

  readfile(path: string) {
    return fs.readFileSync(path).toString();
  }

  weeklyTemplate = async () => {
    try {
      this.uploadTemplate('../views/email/weeklyReport.html',
        'weekly',
        'used to send weekly trips information');
    } catch (e) {
      BugsnagHelper.log(e);
    }
  }

  providerMonthlyReport = async () => {
    try {
      this.uploadTemplate('../views/email/providersMonthlyReport.html',
        'providers',
        'Used to send monthly trips by provider to Ops');
    } catch (e) {
      BugsnagHelper.log(e);
    }
  }

  uploadTemplate = async (templatePath: string, name: string, description: string) => {
    const path = resolve(__dirname, templatePath);
    const template = this.readfile(path);
    const body = await this.client.post(`/${this.domain}/templates`, {
      template,
      name,
      description,
      engine: 'handlebars',
    });
    console.log(body.message);
  }

  pushTemplates = async () => {
    await this.providerMonthlyReport();
    await this.weeklyTemplate();
  }
}

const uploadTemplates = new UploadWeeklyTemplate();
uploadTemplates.pushTemplates();

export default uploadTemplates;
