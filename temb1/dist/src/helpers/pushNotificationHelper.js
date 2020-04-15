"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_push_1 = __importDefault(require("web-push"));
const environment_1 = __importDefault(require("../config/environment"));
class PushNotificationHelper {
    constructor(webpush = web_push_1.default) {
        this.webpush = webpush;
        this.sendPushNotification = ({ subscription, message: { title, body } }) => {
            const notificationPayload = {
                notification: {
                    title,
                    body,
                    icon: 'https://res.cloudinary.com/dodfpnbik/image/upload/v1581928412/favicon_hle2l4.png',
                },
            };
            this.webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
            return true;
        };
        this.webpush.setVapidDetails(`mailto:${environment_1.default.TEMBEA_EMAIL_ADDRESS}`, environment_1.default.VAPID_PUBLIC_KEY, environment_1.default.VAPID_PRIVATE_KEY);
    }
}
exports.PushNotificationHelper = PushNotificationHelper;
const pushNotificationHelper = new PushNotificationHelper();
exports.default = pushNotificationHelper;
//# sourceMappingURL=pushNotificationHelper.js.map