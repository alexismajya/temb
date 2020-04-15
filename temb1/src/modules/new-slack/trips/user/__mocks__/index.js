export const tripInfo = {
  forMe: true,
  reason: 'valid reason',
  passengers: 1,
  homeBaseName: 'Nairobi',
  departmentId: '2',
  department: 'Engineering',
  pickupId: 6,
  pickupLat: -1.239622,
  pickupLong: 36.8511383,
  id: 'USF6AGS8Y',
  name: 'rugumbirajordybastien',
  dateTime: '2020-02-08 20:00',
  pickup: 'Nairobi Guest House',
  tripType: 'Regular Trip',
  destinationLat: -1.219539,
  destinationLong: 36.886215,
  destinationId: 2,
  destination: 'Epic Tower',
  othersDestination: null,
  distance: 'unknown',
};
export const responseUrl = 'https://hooks.slack.com/actions/TS2CN6CDQ/945436240982/zfHTnL2ONQXFiONirS6Ge67G';
  
export const allDepartments = [
  {
    text: 'TDD',
    value: 1,
  },
  {
    text: 'Engineering',
    value: 2,
  },
];
export const homeBaseName = 'Nairobi';

export const payload = {
  type: 'block_actions',
  team: { id: 'TS2CN6CDQ', domain: 'andela-g3y2604' },
  user: {
    id: 'USF6AGS8Y',
    username: 'rugumbirajordybastien',
    name: 'rugumbirajordybastien',
    team_id: 'TS2CN6CDQ'
  },
  api_app_id: 'ASF6NDHPX',
  token: 'aGtXvqfu8cTkcVGyXkIOkhdt',
  container: {
    type: 'message',
    message_ts: '1581169868.000200',
    channel_id: 'DSHCD5EK0',
    is_ephemeral: true
  },
  trigger_id: '945157012231.886430216466.dca91de96bc42ef5c3654ce347036f3f',
  channel: { id: 'DSHCD5EK0', name: 'directmessage' },
  response_url: 'https://hooks.slack.com/actions/TS2CN6CDQ/942840238164/eRweIF4VyXUiKNm1Tu56V4bj',
  actions: [
    {
      action_id: 'user_trip_edit',
      block_id: 'user_trip_confirm_trip_request',
      value: 'edit',
      style: 'primary',
      type: 'button',
      action_ts: '1581175311.528414'
    }
  ]
};

export const pickupSubmission = {
  rider: 'USF6AGS8Y',
  reason: 'reason',
  passengers: '0',
  department: 'TDD',
  date: '2020-02-08',
  time: '20:00',
  pickup: 'US Embassy',
  othersPickup: undefined
};

export const context = {
  homebase: {
    id: 4,
    name: 'Nairobi',
    channel: 'CSFHKFNSH',
    addressId: 1,
    locationId: 40,
    currency: 'KES'
  },
  botToken: 'xoxb-886430216466-899227892816-ppyQmFL67FuZUlIV2Y1B1gRo'
};

export const destinationSubmission = {
  destination: 'Epic Tower',
  othersDestination: undefined,
};
