"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEdit = true;
exports.isEditFalse = false;
exports.pickupSelect = {
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
exports.destinationSelect = {
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
exports.cachedFlightNumber = 'dasdsad';
exports.cachedDate = '2020-02-15';
exports.cachedTime = '20:00';
exports.cachedReason = 'reason';
exports.expectedViewIsEditFalse = [
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
exports.expectedViewIsEditTrue = [
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
exports.tripPayload = {
    tripDetails: {
        tripNotes: 'udpate_note',
    },
};
exports.tripPayloadEmpty = {
    tripDetails: {
        tripNotes: '',
    },
};
exports.tripTypeAirportTransfer = 'Airport Transfer';
exports.tripType = '';
exports.flightTripDetails = {
    flightNumber: 'dsawe',
    date: '2020-02-07',
    time: '20:00',
    reason: 'reason valid',
    pickup: 'Andela Nairobi',
    destination: 'Nairobi Guest House',
    flightDateTime: '2020-02-07T17:00:00.000Z',
    dateTime: '2020-02-07T14:00:00.000Z',
};
exports.tripDetails = {
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
exports.checkFlightResponse = [
    '2019-12-19',
    'FL11TGH',
    '12:35',
    'Andela Nairobi',
    'Embassy of Senegal',
    'dfgsfd sfdgdf',
    '2019-12-19T09:35:00.000Z',
    '2019-12-19T07:35:00.000Z',
];
exports.checkFlightEmptyResponse = ['', '', '', '', '', '', '', ''];
exports.checkTripResponse = [
    '2019-12-19',
    'Andela Nairobi',
    'Embassy of Senegal',
    '12:35',
    'dfgsfd sfdgdf',
    '2019-12-19T07:35:00.000Z',
    '2019-12-19T09:35:00.000Z',
];
exports.checkTripEmptyResponse = ['', '', '', '', '', '', ''];
exports.generatedOption = [
    {
        text: {
            text: 'test',
            type: 'plain_text',
        },
        value: 'test',
    },
];
exports.tripInfo = {
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
exports.responseUrl = 'https://hooks.slack.com/actions/TS2CN6CDQ/945436240982/zfHTnL2ONQXFiONirS6Ge67G';
exports.allDepartments = [
    {
        text: 'TDD',
        value: 1,
    },
    {
        text: 'Engineering',
        value: 2,
    },
];
exports.homeBaseName = 'Nairobi';
exports.addresses = [
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
exports.undefinedOption = undefined;
exports.otherOption = {
    text: {
        text: 'Others',
        type: 'plain_text',
    },
    value: 'Others',
};
//# sourceMappingURL=index.js.map