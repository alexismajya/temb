export var ProviderNotificationChannels;
(function (ProviderNotificationChannels) {
    ProviderNotificationChannels["Slack Direct Message"] = "0";
    ProviderNotificationChannels["Slack Channel"] = "1";
    ProviderNotificationChannels["Email"] = "2";
    ProviderNotificationChannels["WhatsApp"] = "3";
})(ProviderNotificationChannels || (ProviderNotificationChannels = {}));
var ProviderModel = /** @class */ (function () {
    function ProviderModel(name, email, phoneNo, channelId, notificationChannel) {
        if (notificationChannel === void 0) { notificationChannel = ProviderNotificationChannels.Email; }
        this.name = name;
        this.email = email;
        this.phoneNo = phoneNo;
        this.channelId = channelId;
        this.notificationChannel = notificationChannel;
    }
    return ProviderModel;
}());
export { ProviderModel };
//# sourceMappingURL=provider.model.js.map