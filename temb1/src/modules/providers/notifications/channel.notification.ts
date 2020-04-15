import SlackNotifications from '../../slack/SlackPrompts/Notifications';
import {
    SlackButtonAction,
    SlackAttachment,
  } from '../../slack/SlackModels/SlackMessageModels';
import BugsnagHelper from '../../../helpers/bugsnagHelper';
import { IProvider, IProviderNotification } from './notification.interface';

export class ChannelNotification implements IProviderNotification{
  sendVerificationMessage(provider: IProvider, options: any): Promise<void> {
    return Promise.resolve(); // we do not need verification here.
  }

  async notifyNewTripRequest(provider: IProvider,
    tripDetails: any, teamDetails: any) {
    try {
      const { channelId, name } = provider;
      const { id: tripId } = tripDetails;
      const attachment = new SlackAttachment();
      const fields = SlackNotifications.notificationFields(tripDetails);
      attachment.addFieldsOrActions('actions',
    [new SlackButtonAction('assign-cab', 'Accept', `${tripId}`)]);
      attachment.addFieldsOrActions('fields', fields);
      attachment.addOptionalProps('provider_actions', 'fallback', '#FFCCAA', 'default');
      const message = SlackNotifications.createDirectMessage(channelId,
      `A trip has been assigned to *${name}*,`
      + 'please assign a driver and a cab', [attachment]);
      await SlackNotifications.sendNotification(message, teamDetails.botToken);
    } catch (error) { BugsnagHelper.log(error); }
  }
}
