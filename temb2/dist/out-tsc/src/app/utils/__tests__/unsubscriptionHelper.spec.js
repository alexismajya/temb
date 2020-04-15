import SubscriptionHelper from '../unsubscriptionHelper';
describe('SubscriptionHelper', function () {
    it('should unsubscribe from events', function () {
        jest.spyOn(SubscriptionHelper, 'unsubscribeHelper').mockImplementation(jest.fn());
        SubscriptionHelper.unsubscribeHelper(['a', 'b']);
        expect(SubscriptionHelper.unsubscribeHelper).toHaveBeenCalled();
    });
});
//# sourceMappingURL=unsubscriptionHelper.spec.js.map