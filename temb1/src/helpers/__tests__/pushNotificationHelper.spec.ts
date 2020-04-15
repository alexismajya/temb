import pushNotificationHelper from '../pushNotificationHelper';

describe('Push Notification Helper', () => {
  const subscription = {};
  const message = {
    title: 'Test',
    body: 'Test',
  };
  it('should push a notification', () => {
    const notification = pushNotificationHelper.sendPushNotification({ subscription, message });
    expect(notification).toEqual(true);
  });
});
