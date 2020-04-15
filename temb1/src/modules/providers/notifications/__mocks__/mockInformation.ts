const mockInformation = {
  url: 'thisisistoken',
  name: 'mailTemplate',
  timezone: 'Africa/Lagos',
  tripDetails:{
    origin: { address: 'kigali' },
    destination: { address: 'kenya' },
    rider: { name: 'john doe', phoneNo: '+250786601003' },
    departureTime: '2019-12-12',
    noOfPassengers: 5,
  },
};

const mockProviderInformation = {
  id:1,
  name: 'john',
  channelId: 'channel123',
  email: 'johndoe@mail.com',
  phoneNo: '+240786601005',
  notificationChannel: '0',
  homebaseId: 1,
  providerId: 1,
  verified: false,
  user:{
    slackId: 'slackId',
    email: 'john@gmail.com',
    name: 'john',
  },
};

const mockTeamDetailInformation = {
  teamId: 'team456',
  botToken: 'token',
};

export {
    mockInformation,
    mockProviderInformation,
    mockTeamDetailInformation,
};
