import { ShortenTextPipe } from './shorten-text.pipe';
describe('ShortenTextPipe', function () {
    var pipe;
    beforeEach(function () {
        pipe = new ShortenTextPipe();
    });
    it('should create an instance', function () {
        expect(pipe).toBeTruthy();
    });
    it('should shorten the text', function () {
        var newText = pipe.transform('Winterfell', 6);
        expect(newText).toEqual('Winter...');
    });
    it('should return the original text if text length does not exceed the max', function () {
        var newText = pipe.transform('Arya');
        expect(newText).toEqual('Arya');
    });
});
//# sourceMappingURL=shorten-text.pipe.spec.js.map