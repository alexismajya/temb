export const providerResponseMock = {
  success: true,
  message: 'Provider created successfully',
  provider: {
    id: 2,
    name: 'Taxify Kenya',
    updatedAt: '2019-04-14T10:22:01.291Z',
    createdAt: '2019-04-14T10:22:01.291Z',
    providerUserId: null,
    phoneNo: '2507880000',
    email: 'john@doe.com',
    channelId: null,
    homebaseId: 5,
    notificationChannel: '2',
    verified: false
  }
};

export const createProviderMock = {
  name: 'Uber Ltd',
  email: 'someuser@andela.com',
  notificationChannel: '3',
  phoneNo: '0725053278',
  channelId: '576568959',
};

export const providerTokenMock = {
  token: 'djh12'
};
export enum ProviderNotificationChannels {
  'Slack Direct Message' = '0',
  'Slack Channel' = '1',
  'Email' = '2',
  'WhatsApp' = '3',
}
