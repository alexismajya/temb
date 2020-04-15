import { ConvertNullValue } from './convert-nullValue.pipe';
describe('ConvertNullValue', function () {
    var pipe;
    beforeEach(function () {
        pipe = new ConvertNullValue();
    });
    it('should create an instance of pipe', function () {
        expect(pipe).toBeTruthy();
    });
    it('should return value if not null', function () {
        var result = pipe.transform('hello');
        expect(result).toBe('hello');
    });
    it('should return provided default if value is null', function () {
        var result = pipe.transform(null, 'NA');
        expect(result).toBe('NA');
    });
});
//# sourceMappingURL=convert-nullValue.pipe.spec.js.map