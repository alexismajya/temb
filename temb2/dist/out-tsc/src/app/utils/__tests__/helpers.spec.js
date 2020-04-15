import * as moment from 'moment';
import { getStartAndEndDate, getDatesForPreviousWeek } from '../helpers';
describe('Helpers', function () {
    describe('getStartAndEndDate', function () {
        it('should return start and end dates based on the day (Weekend)', function () {
            var today = moment('09/07/2019');
            var _a = getStartAndEndDate(today), startDate = _a[0], endDate = _a[1];
            expect(startDate).toEqual('2019-09-02');
            expect(endDate).toEqual('2019-09-06');
        });
        it('should return start and end dates based on the day (Weekday)', function () {
            var today = moment('09/05/2019');
            var _a = getDatesForPreviousWeek(today), startDate = _a[0], endDate = _a[1];
            expect(startDate).toEqual('2019-08-26');
            expect(endDate).toEqual('2019-08-30');
        });
    });
});
//# sourceMappingURL=helpers.spec.js.map