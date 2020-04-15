import { EmailNotification } from '../email.notification';
import { mockInformation as data } from '../__mocks__/mockInformation';
describe(EmailNotification, () => {
  const emailNotification = new EmailNotification();
  it('should send notification email when a provider assigned to a trip', () => {
    const providerInfo = {
      name: 'gram',
      email: 'test@test.com',
      providerId: 1,
    };
    const func = emailNotification.notifyNewTripRequest(providerInfo, data.tripDetails, 1);
    expect(func).toBeDefined();
  });
});
