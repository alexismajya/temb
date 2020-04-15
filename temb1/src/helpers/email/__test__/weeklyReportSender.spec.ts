import weeklyReportGenerator from '../../../modules/report/weeklyReportGenerator';
import { weeklyReportSender as WeeklyReportSender } from '../weeklyReportSender';
import BugsnagHelper from '../../bugsnagHelper';
import userService from '../../../modules/users/user.service';
import {
  mockUserTrip1, mockUserRoute, mockEmailData, userEmails
} from '../../../modules/report/__mocks__/weeklyReportMock';

describe('WeeklyReportSender', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('send', () => {
    it('should send mail to expected recipients', async () => {
      jest.spyOn(WeeklyReportSender, 'getWeeklyEmailReport')
        .mockImplementation(() => (new Promise((resolve) => resolve(mockEmailData))));
      jest.spyOn(WeeklyReportSender, 'sendMail').mockResolvedValue(true);
      await WeeklyReportSender.send();

      expect(WeeklyReportSender.sendMail).toHaveBeenCalled();
    });

    it('should do nothing if no users with trips', async () => {
      jest.spyOn(WeeklyReportSender, 'getWeeklyEmailReport')
        .mockImplementation(() => (new Promise((resolve) => resolve({}))));
      jest.spyOn(WeeklyReportSender, 'sendMail').mockResolvedValue(true);
      await WeeklyReportSender.send();

      expect(WeeklyReportSender.sendMail).toHaveBeenCalledTimes(0);
    });

    it('should log to bugsnag if something goes wrong', async () => {
      jest.spyOn(WeeklyReportSender, 'getWeeklyEmailReport')
        .mockImplementation(() => (new Promise((resolve) => resolve(mockEmailData))));
      const mockError = new Error('failed to send mail');
      jest.spyOn(WeeklyReportSender, 'sendMail').mockRejectedValue(mockError);
      jest.spyOn(BugsnagHelper, 'log').mockReturnValue('');

      await WeeklyReportSender.send();

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
      jest.spyOn(WeeklyReportSender.emailService, 'sendMail')
        .mockImplementation(() => (new Promise((resolve) => resolve(''))));
      await WeeklyReportSender.sendMail(mockEmailData, userEmails);
      expect(WeeklyReportSender.emailService.sendMail).toHaveBeenCalled();
    });

    it('should log to bugsnag if something goes wrong', async () => {
      delete process.env.TEMBEA_MAIL_ADDRESS;
      jest.spyOn(BugsnagHelper, 'log');
      await WeeklyReportSender.sendMail(mockEmailData, userEmails);

      expect(BugsnagHelper.log).toHaveBeenCalledWith('TEMBEA_MAIL_ADDRESS  has not been set in the .env');
    });
  });

  describe('getWeeklyEmailReport', () => {
    it('should return object of name and email', async () => {
      jest.spyOn(userService, 'getWeeklyCompletedTrips')
        .mockImplementation(() => (new Promise((resolve) => resolve([mockUserTrip1]))));
      jest.spyOn(userService, 'getWeeklyCompletedRoutes')
        .mockImplementation(() => (new Promise((resolve) => resolve([mockUserRoute]))));
      jest.spyOn(weeklyReportGenerator, 'generateEmailData');
      await WeeklyReportSender.getWeeklyEmailReport();
      expect(userService.getWeeklyCompletedTrips).toHaveBeenCalled();
      expect(userService.getWeeklyCompletedRoutes).toHaveBeenCalled();
      expect(weeklyReportGenerator.generateEmailData).toHaveBeenCalled();
    });
  });
});
