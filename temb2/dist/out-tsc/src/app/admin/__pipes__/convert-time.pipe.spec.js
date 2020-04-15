import { ConvertTimePipe } from './convert-time.pipe';
describe('ConvertTimePipe', function () {
    var pipe;
    beforeEach(function () {
        pipe = new ConvertTimePipe();
    });
    it('create an instance', function () {
        expect(pipe).toBeTruthy();
    });
    it('returns 12hr time when providing 24hr time ', function () {
        var result = ['01:00PM', '03:00PM'].join('<span class="text-in-value"> to </span>');
        expect(pipe.transform('13:00-15:00')).toBe(result);
    });
    it('returns AM when providing time less than 12', function () {
        var result = ['01:00AM', '03:00AM'].join('<span class="text-in-value"> to </span>');
        expect(pipe.transform('01:00-03:00')).toBe(result);
    });
    it('returns 12 when provided with 00', function () {
        var result = ['12:30AM', '08:00AM'].join('<span class="text-in-value"> to </span>');
        expect(pipe.transform('00:30-08:00')).toBe(result);
    });
});
//# sourceMappingURL=convert-time.pipe.spec.js.map