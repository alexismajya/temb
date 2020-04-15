import * as moment from 'moment';
import {getStartAndEndDate, getDatesForPreviousWeek} from '../helpers';

describe('Helpers', () => {
  describe('getStartAndEndDate', () => {
    it('should return start and end dates based on the day (Weekend)', () => {
      const today = moment('09/07/2019');
      const [startDate, endDate] = getStartAndEndDate(today);
      expect(startDate).toEqual('2019-09-02');
      expect(endDate).toEqual('2019-09-06');
    });

    it('should return start and end dates based on the day (Weekday)', () => {
      const today = moment('09/05/2019');
      const [startDate, endDate] = getDatesForPreviousWeek(today);
      expect(startDate).toEqual('2019-08-26');
      expect(endDate).toEqual('2019-08-30');
    });
  });
});
