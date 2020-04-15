import SlackNotifications from '../../Notifications';
import { SlackButtonAction, SlackAttachment } from '../../../SlackModels/SlackMessageModels';
import { getSlackTimeOnly } from '../../../helpers/dateHelpers';

class TripNotifications {
  static async sendCompletionNotification(trip, botToken) {
    const { rider: { slackId } } = trip;

    const directMessageId = await SlackNotifications.getDMChannelId(slackId, botToken);

    const actions = [
      new SlackButtonAction('trip_taken', 'Yes', trip.id),
      new SlackButtonAction('still_on_trip', 'Still on trip', trip.id),
      new SlackButtonAction('not_taken', 'No', trip.id, 'danger')
    ];
    const attachment = new SlackAttachment('', '', '', '', '');
    const fields = SlackNotifications.notificationFields(trip);

    attachment.addFieldsOrActions('actions', actions);
    attachment.addFieldsOrActions('fields', fields);
    attachment.addOptionalProps('trip_completion');

    const message = SlackNotifications.createDirectMessage(directMessageId,
      `Hi! <@${trip.rider.slackId}> Did you take this trip?`, attachment);
    return SlackNotifications.sendNotification(message, botToken);
  }

  /**
   * Sends Trip Reminder Notifications
   * @param {object} trip
   * @returns {void}
   */
  static async sendTripReminderNotifications(trip, token) {
    await Promise.all([
      TripNotifications.sendRiderReminderNotification(trip, token),
      TripNotifications.sendDriverReminderNotification(trip, token),
    ]);
  }

  /**
   * Sends Driver Reminder Notification for upcoming trip
   * @param {object} trip
   * @param {string} slackBotOauthToken
   */
  static async sendDriverReminderNotification(trip, slackBotOauthToken) {
    if (trip.driver.user) {
      const driverDirectMessageId = await SlackNotifications.getDMChannelId(
        trip.driver.user.slackId, slackBotOauthToken
      );
      const driverMessage = `Hello *${trip.driver.driverName}*, the trip you have been assigned to `
      + `from *${trip.origin.address}* to *${trip.destination.address}*, is due for take off at`
      + `*${getSlackTimeOnly(trip.departureTime)}*.`
      + ` Your passenger is <@${trip.rider.slackId}>.`;
      const driverDMmessage = SlackNotifications.createDirectMessage(driverDirectMessageId,
        driverMessage, []);
      return SlackNotifications.sendNotification(driverDMmessage, slackBotOauthToken);
    }
  }

  /**
   * Sends Rider Reminder Notification for upcoming trip
   * @param {object} trip
   * @param {string} slackBotOauthToken
   */
  static async sendRiderReminderNotification(trip, slackBotOauthToken) {
    const { rider: { slackId } } = trip;
    const riderDirectMessageId = await SlackNotifications.getDMChannelId(slackId,
      slackBotOauthToken);
    const driverNameOrSlackId = trip.driver.user ? `<@${trip.driver.user.slackId}>`
      : `*${trip.driver.driverName}*`;
    const riderMessage = `Hello <@${trip.rider.slackId}>, your trip from *${trip.origin.address}* `
    + `to *${trip.destination.address}* takes off at `
    + `*${getSlackTimeOnly(trip.departureTime)}*.\n`
    + `The driver for the trip is ${driverNameOrSlackId}.\n`
    + 'If you need any help, Please feel free to contact the Operations Team. Enjoy :smiley:';
    const riderDMmessage = SlackNotifications.createDirectMessage(riderDirectMessageId,
      riderMessage, []);
    return SlackNotifications.sendNotification(riderDMmessage, slackBotOauthToken);
  }
}
export default TripNotifications;
