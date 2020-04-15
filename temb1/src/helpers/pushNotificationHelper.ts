import Webpush from 'web-push';
import environment from '../config/environment';

export class PushNotificationHelper {
  constructor(private webpush = Webpush) {
    this.webpush.setVapidDetails(
      `mailto:${environment.TEMBEA_EMAIL_ADDRESS}`,
      environment.VAPID_PUBLIC_KEY,
      environment.VAPID_PRIVATE_KEY,
    );
  }

  sendPushNotification = (
    { subscription, message: { title, body } }: {subscription: any, message: any},
  ) => {
    const notificationPayload = {
      notification: {
        title,
        body,
        icon: 'https://res.cloudinary.com/dodfpnbik/image/upload/v1581928412/favicon_hle2l4.png',
      },
    };
    this.webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
    return true;
  }
}

const pushNotificationHelper = new PushNotificationHelper();
export default pushNotificationHelper;
