"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_template_1 = require("../email.template");
const mockInformation_1 = require("../../../modules/providers/notifications/__mocks__/mockInformation");
describe(email_template_1.MailTemplate, () => {
    it('should create template for sending notification to a provider', () => {
        const func = email_template_1.MailTemplate.getProviderTripNotificationTemplate(mockInformation_1.mockInformation);
        expect(func).toEqual(expect.stringContaining('We hope this email finds you well'));
    });
    it('should create email template even when there is no phone number', () => {
        mockInformation_1.mockInformation.tripDetails.rider.phoneNo = null;
        const func = email_template_1.MailTemplate.getProviderTripNotificationTemplate(mockInformation_1.mockInformation);
        expect(func).toEqual(expect.stringContaining('We hope this email finds you well'));
    });
});
//# sourceMappingURL=email.template.spec.js.map