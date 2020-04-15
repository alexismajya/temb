import DateDialogHelper from '../../dateHelper';

describe('dateHelpers', () => {
  describe('transform date', () => {
    it('should transform to iso format when no timezone', () => {
      const input = '30/06/2019 09:00';
      const dateValue = DateDialogHelper.transformDate(input);
      const expected = '2019-06-30T09:00:00.000Z';
      expect(dateValue).toEqual(expected);
    });

    it('should apply timezone difference when present', () => {
      const input = '30/06/2019 09:00';
      const dateValue = DateDialogHelper.transformDate(input, 'America/Los_Angeles');
      const expected = new Date(Date.UTC(2019, 5, 30, 16));
      expect(dateValue).toEqual(expected.toISOString());
    });

    it('should return null for invalid date', () => {
      const input = '32/23/2019 09:00';
      const dateValue = DateDialogHelper.transformDate(input, 'America/Los_Angeles');
      expect(dateValue).toEqual(null);
    });

    it('should make it timezone neutral', () => {
      const time = '2019-10-30T15:50:00+02:00';
      const expectedTime = '2019-10-30T13:50:00.000Z';
      const result = DateDialogHelper.transformToUtcIsoDate(time);
      expect(result).toEqual(expectedTime);
    });
  });
});
