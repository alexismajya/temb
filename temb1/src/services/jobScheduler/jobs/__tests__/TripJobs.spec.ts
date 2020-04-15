import moment from 'moment';
import TripJobs from '../TripJobs';
import appEvents from '../../../../modules/events/app-event.service';
import TripRequest from '../../../../database/models/trip-request';
import schedulerService from '../../../../modules/shared/scheduler';

const isoDateTimeRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;

describe(TripJobs, () => {
  const testTrip = {
    id: 1,
    departureTime: moment().add(2, 'hours').toISOString(),
    createdAt: moment().toISOString(),
  } as TripRequest;
  const botToken = 'xoxp-14425526';

  describe(TripJobs.scheduleAutoApprove, () => {
    beforeEach(() => {
      jest.spyOn(schedulerService, 'schedule').mockResolvedValue(null);
      jest.spyOn(appEvents, 'broadcast').mockResolvedValue(null);
    });

    afterEach(() => jest.restoreAllMocks());

    it('should call schedulerService', async () => {
      await TripJobs.scheduleAutoApprove({ botToken, data: testTrip });
      expect(schedulerService.schedule).toHaveBeenCalledWith(expect.objectContaining({
        time: expect.stringMatching(isoDateTimeRegex),
      }));
    });

    it('should throw and handle the error', async () => {
      await TripJobs.scheduleAutoApprove({ botToken, data: null });
      expect(appEvents.broadcast).not.toHaveBeenCalled();
      expect(schedulerService.schedule).not.toHaveBeenCalled();
    });
  });

  describe(TripJobs.scheduleTakeOffReminder, () => {
    beforeEach(() => {
      jest.spyOn(schedulerService, 'schedule').mockResolvedValue(null);
    });

    afterEach(() => jest.restoreAllMocks());

    it('should call scheduler', async () => {
      await TripJobs.scheduleTakeOffReminder({ botToken, data: testTrip });
      expect(schedulerService.schedule).toHaveBeenCalledWith(expect.objectContaining({
        isRecurring: false,
        payload: expect.objectContaining({
          key: expect.stringContaining(testTrip.id.toString()),
        }),
      }));
    });

    it('should throw and handle the error', async () => {
      await TripJobs.scheduleTakeOffReminder({ botToken, data: null });
      expect(schedulerService.schedule).not.toHaveBeenCalled();
    });
  });

  describe(TripJobs.scheduleCompletionReminder, () => {
    beforeEach(() => {
      jest.spyOn(schedulerService, 'schedule').mockResolvedValue(null);
    });

    afterEach(() => jest.restoreAllMocks());
    it('should call scheduler', async () => {
      await TripJobs.scheduleCompletionReminder({ botToken, data: testTrip });
      expect(schedulerService.schedule).toHaveBeenCalledWith(expect.objectContaining({
        isRecurring: false,
        payload: expect.objectContaining({
          key: expect.stringContaining(testTrip.id.toString()),
        }),
      }));
    });

    it('should throw and handle the error', async () => {
      await TripJobs.scheduleCompletionReminder({ botToken, data: null });
      expect(schedulerService.schedule).not.toHaveBeenCalled();
    });
  });
});
