
export const isEdit = true;

export const isEditFalse = false;

export const pickupSelect = {
  type: 'external_select',
  action_id: 'pickup',
  placeholder: {
    text: 'Select a pickup location',
    type: 'plain_text',
  },
  initial_option: {
    text: {
      text: 'Andela Nairobi',
      type: 'plain_text',
    },
    value: 'Andela Nairobi',
  },
};
export const destinationSelect = {
  type: 'static_select',
  action_id: 'destination',
  placeholder: {
    text: 'Select destination',
    type: 'plain_text',
  },
  initial_option: {
    text: {
      text: 'US Embassy',
      type: 'plain_text',
    },
    value: 'US Embassy',
  },
  options: [
    {
      text: {
        text: 'Decide later',
        type: 'plain_text',
      },
      value: 'To Be Decided',
    },
    {
      text: {
        text: 'Andela Nairobi',
        type: 'plain_text',
      },
      value: 'Andela Nairobi',
    },
    {
      text: {
        text: 'Epic Tower',
        type: 'plain_text',
      },
      value: 'Epic Tower',
    },
    {
      text: {
        text: 'US Embassy',
        type: 'plain_text',
      },
      value: 'US Embassy',
    },
    {
      text: {
        text: 'VFS Centre',
        type: 'plain_text',
      },
      value: 'VFS Centre',
    },
    {
      text: {
        text: 'Jomo Kenyatta Airport',
        type: 'plain_text',
      },
      value: 'Jomo Kenyatta Airport',
    },
    {
      text: {
        text: 'Nairobi Guest House',
        type: 'plain_text',
      },
      value: 'Nairobi Guest House',
    },
    {
      text: {
        text: 'Morningside Apartments USIU road',
        type: 'plain_text',
      },
      value: 'Morningside Apartments USIU road',
    },
    {
      text: {
        text: 'Safari Park Hotel',
        type: 'plain_text',
      },
      value: 'Safari Park Hotel',
    },
    {
      text: {
        text: 'Lymack Suites',
        type: 'plain_text',
      },
      value: 'Lymack Suites',
    },
  ],
};

export const cachedFlightNumber = 'dasdsad';

export const cachedDate = '2020-02-15';

export const cachedTime = '20:00';

export const cachedReason = 'reason';

export const expectedViewIsEditFalse = [
  {
    type: 'input',
    block_id: 'pickup',
    optional: false,
    element: {
      type: 'external_select',
      action_id: 'pickup',
      placeholder: {
        text: 'Select a pickup location',
        type: 'plain_text',
      },
      initial_option: {
        text: {
          text: 'Andela Nairobi',
          type: 'plain_text',
        },
        value: 'Andela Nairobi',
      },
    },
    label: {
      text: 'Pick-up Location',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'destination',
    optional: false,
    element: {
      type: 'static_select',
      action_id: 'destination',
      placeholder: {
        text: 'Select destination',
        type: 'plain_text',
      },
      initial_option: {
        text: {
          text: 'US Embassy',
          type: 'plain_text',
        },
        value: 'US Embassy',
      },
      options: [
        {
          text: {
            text: 'Decide later',
            type: 'plain_text',
          },
          value: 'To Be Decided',
        },
        {
          text: {
            text: 'Andela Nairobi',
            type: 'plain_text',
          },
          value: 'Andela Nairobi',
        },
        {
          text: {
            text: 'Epic Tower',
            type: 'plain_text',
          },
          value: 'Epic Tower',
        },
        {
          text: {
            text: 'US Embassy',
            type: 'plain_text',
          },
          value: 'US Embassy',
        },
        {
          text: {
            text: 'VFS Centre',
            type: 'plain_text',
          },
          value: 'VFS Centre',
        },
        {
          text: {
            text: 'Jomo Kenyatta Airport',
            type: 'plain_text',
          },
          value: 'Jomo Kenyatta Airport',
        },
        {
          text: {
            text: 'Nairobi Guest House',
            type: 'plain_text',
          },
          value: 'Nairobi Guest House',
        },
        {
          text: {
            text: 'Morningside Apartments USIU road',
            type: 'plain_text',
          },
          value: 'Morningside Apartments USIU road',
        },
        {
          text: {
            text: 'Safari Park Hotel',
            type: 'plain_text',
          },
          value: 'Safari Park Hotel',
        },
        {
          text: {
            text: 'Lymack Suites',
            type: 'plain_text',
          },
          value: 'Lymack Suites',
        },
      ],
    },
    label: {
      text: 'Destination',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'flightNumber',
    optional: false,
    element: {
      type: 'plain_text_input',
      action_id: 'flightNumber',
      multiline: false,
      initial_value: '',
      placeholder: {
        text: 'Enter flight number',
        type: 'plain_text',
      },
    },
    label: {
      text: 'Flight Number',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'date',
    optional: false,
    element: {
      type: 'datepicker',
      initial_date: '2020-02-10',
      action_id: 'date',
      placeholder: {
        text: 'select date',
        type: 'plain_text',
      },
    },
    label: {
      text: 'Select Flight Date',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'time',
    optional: false,
    element: {
      type: 'plain_text_input',
      action_id: 'time',
      multiline: false,
      initial_value: '',
      placeholder: {
        text: 'HH:mm',
        type: 'plain_text',
      },
    },
    label: {
      text: 'Time',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'reason',
    optional: false,
    element: {
      type: 'plain_text_input',
      action_id: 'reason',
      multiline: true,
      initial_value: '',
      placeholder: {
        text: 'Enter reason for booking the trip',
        type: 'plain_text',
      },
    },
    label: {
      text: 'Reason',
      type: 'plain_text',
    },
  },
];

export const expectedViewIsEditTrue = [
  {
    type: 'input',
    block_id: 'pickup',
    optional: false,
    element: {
      type: 'external_select',
      action_id: 'pickup',
      placeholder: {
        text: 'Select a pickup location',
        type: 'plain_text',
      },
      initial_option: {
        text: {
          text: 'Andela Nairobi',
          type: 'plain_text',
        },
        value: 'Andela Nairobi',
      },
    },
    label: {
      text: 'Pick-up Location',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'destination',
    optional: false,
    element: {
      type: 'static_select',
      action_id: 'destination',
      placeholder: {
        text: 'Select destination',
        type: 'plain_text',
      },
      initial_option: {
        text: {
          text: 'US Embassy',
          type: 'plain_text',
        },
        value: 'US Embassy',
      },
      options: [
        {
          text: {
            text: 'Decide later',
            type: 'plain_text',
          },
          value: 'To Be Decided',
        },
        {
          text: {
            text: 'Andela Nairobi',
            type: 'plain_text',
          },
          value: 'Andela Nairobi',
        },
        {
          text: {
            text: 'Epic Tower',
            type: 'plain_text',
          },
          value: 'Epic Tower',
        },
        {
          text: {
            text: 'US Embassy',
            type: 'plain_text',
          },
          value: 'US Embassy',
        },
        {
          text: {
            text: 'VFS Centre',
            type: 'plain_text',
          },
          value: 'VFS Centre',
        },
        {
          text: {
            text: 'Jomo Kenyatta Airport',
            type: 'plain_text',
          },
          value: 'Jomo Kenyatta Airport',
        },
        {
          text: {
            text: 'Nairobi Guest House',
            type: 'plain_text',
          },
          value: 'Nairobi Guest House',
        },
        {
          text: {
            text: 'Morningside Apartments USIU road',
            type: 'plain_text',
          },
          value: 'Morningside Apartments USIU road',
        },
        {
          text: {
            text: 'Safari Park Hotel',
            type: 'plain_text',
          },
          value: 'Safari Park Hotel',
        },
        {
          text: {
            text: 'Lymack Suites',
            type: 'plain_text',
          },
          value: 'Lymack Suites',
        },
      ],
    },
    label: {
      text: 'Destination',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'flightNumber',
    optional: false,
    element: {
      type: 'plain_text_input',
      action_id: 'flightNumber',
      multiline: false,
      initial_value: 'dasdsad',
      placeholder: {
        text: 'Enter flight number',
        type: 'plain_text',
      },
    },
    label: {
      text: 'Flight Number',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'date',
    optional: false,
    element: {
      type: 'datepicker',
      initial_date: '2020-02-15',
      action_id: 'date',
      placeholder: {
        text: 'select date',
        type: 'plain_text',
      },
    },
    label: {
      text: 'Select Flight Date',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'time',
    optional: false,
    element: {
      type: 'plain_text_input',
      action_id: 'time',
      multiline: false,
      initial_value: '20:00',
      placeholder: {
        text: 'HH:mm',
        type: 'plain_text',
      },
    },
    label: {
      text: 'Time',
      type: 'plain_text',
    },
  },
  {
    type: 'input',
    block_id: 'reason',
    optional: false,
    element: {
      type: 'plain_text_input',
      action_id: 'reason',
      multiline: true,
      initial_value: 'reason',
      placeholder: {
        text: 'Enter reason for booking the trip',
        type: 'plain_text',
      },
    },
    label: {
      text: 'Reason',
      type: 'plain_text',
    },
  },
];

export const tripPayload = {
  tripDetails: {
    tripNotes: 'udpate_note',
  },
};

export const tripPayloadEmpty = {
  tripDetails: {
    tripNotes: '',
  },
};

export const tripTypeAirportTransfer = 'Airport Transfer';

export const tripType = '';

export const flightTripDetails = {
  flightNumber: 'dsawe',
  date: '2020-02-07',
  time: '20:00',
  reason: 'reason valid',
  pickup: 'Andela Nairobi',
  destination: 'Nairobi Guest House',
  flightDateTime: '2020-02-07T17:00:00.000Z',
  dateTime: '2020-02-07T14:00:00.000Z',
};

export const tripDetails = {
  id: 4,
  flightNumber: 'FL11TGH',
  date: '2019-12-19',
  pickup: 'Andela Nairobi',
  destination: 'Embassy of Senegal',
  time: '12:35',
  reason: 'dfgsfd sfdgdf',
  dateTime: '2019-12-19T07:35:00.000Z',
  flightDateTime: '2019-12-19T09:35:00.000Z',
  embassyVisitDateTime: '2019-12-19T09:35:00.000Z',
  tripNotes: 'I always travel with first class',
};

export const checkFlightResponse = [
  '2019-12-19',
  'FL11TGH',
  '12:35',
  'Andela Nairobi',
  'Embassy of Senegal',
  'dfgsfd sfdgdf',
  '2019-12-19T09:35:00.000Z',
  '2019-12-19T07:35:00.000Z',
];

export const checkFlightEmptyResponse = ['', '', '', '', '', '', '', ''];

export const checkTripResponse = [
  '2019-12-19',
  'Andela Nairobi',
  'Embassy of Senegal',
  '12:35',
  'dfgsfd sfdgdf',
  '2019-12-19T07:35:00.000Z',
  '2019-12-19T09:35:00.000Z',
];

export const checkTripEmptyResponse = ['', '', '', '', '', '', ''];

export const generatedOption = [
  {
    text: {
      text: 'test',
      type: 'plain_text',
    },
    value: 'test',
  },
];

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
  // @ts-ignore
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

export const addresses = [
  'Andela Nairobi',
  'Epic Tower',
  'US Embassy',
  'VFS Centre',
  'Jomo Kenyatta Airport',
  'Nairobi Guest House',
  'Morningside Apartments USIU road',
  'Safari Park Hotel',
  'Lymack Suites',
  'Others',
];

export const undefinedOption: any = undefined;

export const otherOption = {
  text: {
    text: 'Others',
    type: 'plain_text',
  },
  value: 'Others',
};
