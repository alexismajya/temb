import scheduler from 'node-schedule';
import MonthlyReportsJob from '../MonthlyReportsJob';
import { mockWhatsappOptions } from '../../../../modules/notifications/whatsapp/twilio.mocks';

mockWhatsappOptions();

describe('MonthlyReprtsJob', () => {
  it('should scheduleAllMonthlyReports successfully', async () => {
    jest.spyOn(scheduler, 'scheduleJob').mockImplementation(async (start, fn) => {
      await Promise.resolve(fn);
    });

    await MonthlyReportsJob.scheduleAllMonthlyReports();
    expect(scheduler.scheduleJob).toBeCalledTimes(1);
  });
});
