"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_notification_1 = require("../email.notification");
const mockInformation_1 = require("../__mocks__/mockInformation");
describe(email_notification_1.EmailNotification, () => {
    const emailNotification = new email_notification_1.EmailNotification();
    it('should send notification email when a provider assigned to a trip', () => {
        const providerInfo = {
            name: 'gram',
            email: 'test@test.com',
            providerId: 1,
        };
        const func = emailNotification.notifyNewTripRequest(providerInfo, mockInformation_1.mockInformation.tripDetails, 1);
        expect(func).toBeDefined();
    });
});
//# sourceMappingURL=email.notification.spec.js.map