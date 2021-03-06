import RenameRouteBatch from './routes-inventory.helper';
describe('RenameRouteBatch', function () {
    var routes = [{ name: 'Yaba', batch: 'E', takeOff: '03:00' },
        { name: 'Yaba', batch: 'Q', takeOff: '03:00' },
        { name: 'Yaba', batch: 'V', takeOff: '02:00' },
        { name: 'Nairobi', batch: 'C', takeOff: '03:00' },
        { name: 'Nairobi', batch: 'F', takeOff: '02:00' },
        { name: 'Nairobi', batch: 'B', takeOff: '02:00' }];
    var renameRouteBatch = new RenameRouteBatch(routes, null);
    it('should return the next character', function () {
        expect(renameRouteBatch.nextLetter('A')).toEqual('B');
        expect(renameRouteBatch.nextLetter('Z')).toEqual('A');
    });
    it('should increment a batchString', function () {
        var spy = jest.spyOn(RenameRouteBatch.prototype, 'nextLetter');
        expect(renameRouteBatch.incrementChar('AA')).toEqual('AB');
        expect(renameRouteBatch.incrementChar('ZZ')).toEqual('AAA');
        expect(renameRouteBatch.incrementChar('FZ')).toEqual('GA');
        expect(renameRouteBatch.incrementChar('')).toEqual('A');
        expect(spy).toBeCalledTimes(5);
    });
    it('should update route batches sequentially', function () {
        expect(renameRouteBatch.renameRouteBatches()).toEqual([{ name: 'Yaba', batch: 'A', takeOff: '03:00' },
            { name: 'Yaba', batch: 'B', takeOff: '03:00' },
            { name: 'Yaba', batch: 'A', takeOff: '02:00' },
            { name: 'Nairobi', batch: 'A', takeOff: '03:00' },
            { name: 'Nairobi', batch: 'A', takeOff: '02:00' },
            { name: 'Nairobi', batch: 'B', takeOff: '02:00' }]);
    });
});
//# sourceMappingURL=routes-inventory.helper.spec.js.map