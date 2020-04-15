"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pushNotificationHelper_1 = __importDefault(require("../pushNotificationHelper"));
describe('Push Notification Helper', () => {
    const subscription = {};
    const message = {
        title: 'Test',
        body: 'Test',
    };
    it('should push a notification', () => {
        const notification = pushNotificationHelper_1.default.sendPushNotification({ subscription, message });
        expect(notification).toEqual(true);
    });
});
//# sourceMappingURL=pushNotificationHelper.spec.js.map