import moment from 'moment';
import jwt from 'jsonwebtoken';
import { Utilities } from '../utilities';
import environment from '../../../config/environment';

describe(Utilities, () => {
  let utilities: Utilities;

  beforeAll(() => {
    utilities = new Utilities(environment);
  });

  it('should create an instance', () => {
    expect(utilities).toBeDefined();
  });

  describe(Utilities.prototype.toSentenceCase, () => {
    it('should crate an instance', () => {
      const testParams = {
        args: 'mubarak imam',
        result: 'Mubarak imam',
      };

      expect(utilities.toSentenceCase(testParams.args))
        .toEqual(testParams.result);
    });
  });

  describe(Utilities.prototype.formatDate, () => {
    it('should format input date', () => {
      const testDate = new Date(1991, 11, 18);
      const testParams = {
        args: testDate.toISOString(),
        result: 'Wed',
      };

      expect(utilities.formatDate(testParams.args))
        .toEqual(expect.stringContaining(testParams.result));
    });
  });

  describe(Utilities.prototype.getPreviousMonth, () => {
    it('should return previous month', () => {
      const lastMonth = moment().subtract(1, 'month').format('MMM, YYYY');
      const result = utilities.getPreviousMonth();
      expect(result).toBe(lastMonth);
    });
  });

  describe(Utilities.prototype.nextAlphabet, () => {
    it('should return next alphabetic character', () => {
      expect(utilities.nextAlphabet('C')).toEqual('D');
    });
  });

  describe(Utilities.prototype.removeHoursFromDate, () => {
    it('should remove hours from data', () => {
      const testParams = {
        args: moment(new Date(1992, 12, 11, 23, 54), 'DD/MM/YYYY HH:mm'),
        expected: moment(new Date(1992, 12, 11, 21, 54)).format('DD/MM/YYYY HH:mm'),
      };
      const result = utilities.removeHoursFromDate(2, testParams.args);
      expect(result).toEqual(testParams.expected);
    });
  });

  describe(Utilities.prototype.getNameFromEmail, () => {
    it('should coin name from email', () => {
      const testParams = {
        args: 'mubarak.imam@andela.com',
        expected: 'Mubarak Imam',
      };
      expect(utilities.getNameFromEmail(testParams.args)).toEqual(testParams.expected);
    });
  });

  describe(Utilities.prototype.formatWorkHours, () => {
    it('should get workhours from and to from string', () => {
      const testParam = {
        args: '12:00 - 19:23',
        result: { from: '12:00 PM', to: '7:23 PM' },
      };

      expect(utilities.formatWorkHours(testParam.args)).toEqual(testParam.result);
    });
  });

  describe(Utilities.prototype.generateToken, () => {
    it('should generate token', () => {
      const testPayload = { name: 'tester' };
      const token = utilities.generateToken('30mins', testPayload);
      expect(token.split('.').length).toEqual(3);
    });
  });

  describe(Utilities.prototype.verifyToken, () => {
    it('should validate token', () => {
      const testSecret = environment.TEMBEA_PRIVATE_KEY;
      const testPayload = { name: 'hello' };
      const testToken = jwt.sign(testPayload, testSecret, {
        algorithm: 'RS256',
      });
      const result = utilities.verifyToken(testToken, 'TEMBEA_PUBLIC_KEY') as any;
      expect(result).toEqual(expect.objectContaining(testPayload));
    });
  });

  describe(Utilities.prototype.mapThroughArrayOfObjectsByKey, () => {
    it('should extract specified prop', () => {
      const testArray = [{ name: 'Mubarak', id: 1 }, { name: 'Imam', id: 2 }];
      const result = utilities.mapThroughArrayOfObjectsByKey(testArray, 'id');
      expect(result.length).toEqual(2);
      expect(result[1]).toEqual(2);
    });
  });

  describe(Utilities.prototype.getLastWeekStartDate, () => {
    it('should return previous month', () => {
      const lastWeekDate = moment().subtract(1, 'weeks').startOf('isoWeek').format('LLL');
      const result = utilities.getLastWeekStartDate('LLL');
      expect(result).toBe(lastWeekDate);
    });
  });

  describe(Utilities.prototype.getPreviousMonthsDate, () => {
    it('should return previous month', () => {
      const date = moment(new Date()).subtract({ months: 1 }).format('YYYY-MM-DD');
      const result = utilities.getPreviousMonthsDate(1);
      expect(result).toBe(date);
    });
  });
});
