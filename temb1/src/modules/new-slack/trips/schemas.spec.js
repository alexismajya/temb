  
import moment from 'moment';
import Validators from '../../../helpers/slack/UserInputValidator/Validators';
import { getTripPickupSchema, getDateAndTimeSchema } from './schemas';

describe('schemas', () => {
  describe(getTripPickupSchema, () => {
    const testPickup = () => {
      const [pickup, othersPickup] = ['Nairobi', null];
      const testData = { pickup, othersPickup };
      return {
        data: testData,
        result: Validators.validateSubmission(testData, getTripPickupSchema('Africa/Lagos'))
      };
    };
    it('validate pickup details', async () => {
      const { data, result } = testPickup({ pickup: 'Epic', othersPickup: null });
      expect(result.pickup).toEqual(data.pickup);
      expect(result.othersPickup).toEqual(data.othersPickup);
    });
  });

  describe(getDateAndTimeSchema, () => {
    const testDateTime = (allowance) => {
      const fullDateTime = moment().add(allowance.min, 'minutes')
        .add(allowance.day, 'days').tz('Africa/Lagos');
      const [date, time] = [fullDateTime.format('YYYY-MM-DD'), fullDateTime.format('HH:mm')];
      const testData = { date, time };
      return {
        data: testData,
        result: Validators.validateSubmission(testData, getDateAndTimeSchema('Africa/Lagos')),
      };
    };

    it('should validate date and time', () => {
      const { data, result } = testDateTime({ day: 0, min: 60 });
      expect(result.date).toEqual(data.date);
      expect(result.time).toEqual(data.time);
    });

    it('should throw error for time in the past or less than 30mins away', () => {
      expect(() => testDateTime({ day: 0, min: 10 })).toThrow('validation failed');
    });
  });
});
