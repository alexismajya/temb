import SlackNotifications from '../../slack/SlackPrompts/Notifications';
import {
    SlackButtonAction,
    SlackAttachment,
  } from '../../slack/SlackModels/SlackMessageModels';
import BugsnagHelper from '../../../helpers/bugsnagHelper';
import { IProviderNotification, IProvider } from './notification.interface';

export class DirectMessage implements IProviderNotification{
  sendVerificationMessage(provider: IProvider, options: any): Promise<void> {
    return Promise.resolve(); // we do not need verification
  }

  async notifyNewTripRequest(provider: IProvider,
    tripDetails: any, teamDetails: any) {
    try {
      const { name, user: { slackId } } = provider;
      const { id: tripId } = tripDetails;
      const directMessageId = await SlackNotifications.getDMChannelId(slackId,
        teamDetails.botToken);
      const attachment = new SlackAttachment();
      const fields = SlackNotifications.notificationFields(tripDetails);
      attachment.addFieldsOrActions('actions',
    [new SlackButtonAction('assign-cab', 'Accept', `${tripId}`)]);
      attachment.addFieldsOrActions('fields', fields);
      attachment.addOptionalProps('provider_actions', 'fallback', '#FFCCAA', 'default');
      const message = SlackNotifications.createDirectMessage(directMessageId,
      `A trip has been assigned to *${name}*,`
      + 'please assign a driver and a cab', [attachment]);
      await SlackNotifications.sendNotification(message, teamDetails.botToken);
    } catch (error) { BugsnagHelper.log(error); }
  }
}
