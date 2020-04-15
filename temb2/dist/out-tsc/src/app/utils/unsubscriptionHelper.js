var SubscriptionHelper = /** @class */ (function () {
    function SubscriptionHelper() {
    }
    SubscriptionHelper.unsubscribeHelper = function (subscriptions) {
        subscriptions.forEach(function (subscription) {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    };
    return SubscriptionHelper;
}());
export default SubscriptionHelper;
//# sourceMappingURL=unsubscriptionHelper.js.map