export interface IProviderUser {
  name: string;
  email: string;
  slackId: string;
  phoneNo?: string;
}

export enum ProviderNotificationChannels {
  'Slack Direct Message' = '0',
  'Slack Channel' = '1',
  'Email' = '2',
  'WhatsApp' = '3',
}

export interface IProviderInventory {
  id?: number;
  name?: string;
  email?: string;
  phoneNo?: string;
  providerUserId?: number;
  user?: IProviderUser;
}

export class ProviderModel implements IProviderInventory {
  constructor(
    public name?: string,
    public email?: string,
    public phoneNo?: string,
    public channelId?: string,
    public notificationChannel = ProviderNotificationChannels.Email,
  ) { }
}

export interface IProviderToken {
  token?: string;
}
export interface IProviderModel {
  name?: string;
  email?: string;
  phoneNo?: string;
  channelId?: string;
  notificationChannel?: string;
}
