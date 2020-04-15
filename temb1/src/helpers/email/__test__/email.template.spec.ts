import { MailTemplate } from '../email.template';
import { mockInformation as data } from '../../../modules/providers/notifications/__mocks__/mockInformation';

describe(MailTemplate, () => {
  it('should create template for sending notification to a provider', () => {
    const func = MailTemplate.getProviderTripNotificationTemplate(data);
    expect(func).toEqual(expect.stringContaining('We hope this email finds you well'));
  });

  it('should create email template even when there is no phone number', () => {
    data.tripDetails.rider.phoneNo = null;
    const func = MailTemplate.getProviderTripNotificationTemplate(data);
    expect(func).toEqual(expect.stringContaining('We hope this email finds you well'));
  });
});
