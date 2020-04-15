import { ProviderReportSender } from '../providerReportSender';
import BugsnagHelper from '../../bugsnagHelper';
import providerMonthlyReport from '../../../modules/report/providerMonthlyReport';
import { finalData2, finalData1 } from '../__mocks__/providerReportMock';
import EmailService from '../../../modules/emails/EmailService';

describe('Provider Monthly Sender', () => {
  const providerReportSender = new ProviderReportSender(
    {
      sendMail: jest.fn(),
      client: jest.fn(() => {}),
    }
  );
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('send', () => {
    it('should send mail to expected recipients', async () => {
      jest.spyOn(providerMonthlyReport, 'generateData')
        .mockImplementation(() => (new Promise((resolve) => resolve({
          ...finalData2,
          ...finalData1
        }))));
      jest.spyOn(providerReportSender, 'sendMail').mockResolvedValue(true);
      await providerReportSender.sendEamilReport();
      expect(providerReportSender.sendMail).toHaveBeenCalled();
    });

    it('should send mail to expected recipients', async () => {
      jest.spyOn(providerMonthlyReport, 'generateData')
        .mockImplementation(() => (new Promise((resolve) => resolve({}))));
      jest.spyOn(providerReportSender, 'sendMail').mockResolvedValue(true);
      await providerReportSender.sendEamilReport();
      expect(providerReportSender.sendMail).toHaveBeenCalledTimes(0);
    });

    it('should log to bugsnag if something goes wrong', async () => {
      jest.spyOn(providerMonthlyReport, 'generateData')
        .mockImplementation(() => (new Promise((resolve) => resolve({
          ...finalData2,
          ...finalData1
        }))));
      const mockError = new Error('failed to send mail');
      jest.spyOn(providerReportSender, 'sendMail').mockRejectedValue(mockError);
      jest.spyOn(BugsnagHelper, 'log').mockReturnValue('');
      await providerReportSender.sendEamilReport();
      expect(BugsnagHelper.log).toHaveBeenCalledWith(mockError);
    });
  });

  describe('sendMail', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });
    it('should send mail to expected people', async () => {
      await providerReportSender.sendMail('nairobiOps@gmail.com',
        finalData1['nairobiOps@gmail.com']);
      expect(providerReportSender.emailService.sendMail).toHaveBeenCalled();
    });

    it('should log to bugsnag if something goes wrong', async () => {
      delete process.env.TEMBEA_MAIL_ADDRESS;
      jest.spyOn(BugsnagHelper, 'log');
      await providerReportSender.sendMail('nairobiOps@gmail.com',
        finalData1['nairobiOps@gmail.com']);

      expect(BugsnagHelper.log).toHaveBeenCalledWith('TEMBEA_MAIL_ADDRESS  has not been set in the .env');
    });
  });
});
