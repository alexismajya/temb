import { ShortenNamePipe } from './shorten-name.pipe';
describe('ShortenNamePipe', function () {
    it('create an instance', function () {
        var pipe = new ShortenNamePipe();
        expect(pipe).toBeTruthy();
    });
    it('should transform name', function () {
        var pipe = new ShortenNamePipe();
        var result = pipe.transform('', { max: 1 });
        expect(result).toEqual('NA');
        result = pipe.transform('AAAAAA', { max: 8 });
        expect(result).toEqual('AAAAAA');
        result = pipe.transform(null, { max: 8, fallbackText: 'yes' });
        expect(result).toEqual('yes');
        result = pipe.transform('AAAAAAAAAA', { max: 8 });
        expect(result).toEqual('AAAAAAAA...');
        result = pipe.transform('AAAAAA BBBBBB', { max: 8 });
        expect(result).toEqual('A.BBBBBB');
        result = pipe.transform('AAAAAA BBBBBB CCCCCCCCCC', { max: 8 });
        expect(result).toEqual('A.B.CCCCC...');
    });
});
//# sourceMappingURL=shorten-name.pipe.spec.js.map