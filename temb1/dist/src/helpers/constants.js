"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SIZE = 100;
exports.SLACK_DEFAULT_SIZE = 10;
exports.MAX_INT = 4294967295;
exports.messages = {
    VALIDATION_ERROR: 'Validation error occurred, see error object for details',
    MISSING_TEAM_URL: "Missing 'teamUrl' in request header",
    INVALID_TEAM_URL: 'Unrecognized teamUrl',
};
exports.TRIP_LIST_TYPE = Object.freeze({
    PAST: 'history',
    UPCOMING: 'upcoming'
});
exports.LOCATION_CORDINATES = Object.freeze({
    NAIROBI: '-1.219539, 36.886215',
    KAMPALA: '0.3427609, 32.5893855',
    KIGALI: '-1.96291, 30.06443'
});
exports.HOMEBASE_NAMES = Object.freeze({
    KAMPALA: 'Kampala',
    NAIROBI: 'Nairobi',
    KIGALI: 'Kigali',
    CAIRO: 'Cario',
    LAGOS: 'Lagos'
});
exports.DEFAULT_LOCATIONS = [
    {
        longitude: 36.9260693,
        latitude: -1.3227102,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 36.7848955,
        latitude: -1.2519367,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 36.8104947,
        latitude: -1.2343935,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 36.8511383,
        latitude: -1.239622,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 36.886215,
        latitude: -1.219539,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 30.06443,
        latitude: -1.219539,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 36.879841,
        latitude: -1.219918,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 36.883281,
        latitude: -1.226404,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 36.838365,
        latitude: -1.214048,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 32.626282,
        latitude: 0.379828,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 32.443930,
        latitude: 0.045382,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 32.592348,
        latitude: 0.299964,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 32.5893855,
        latitude: 0.3427609,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 32.5826399,
        latitude: -0.3251655,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 32.5944254,
        latitude: 0.3636539,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 32.611807,
        latitude: -0.3166228,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 32.5727795,
        latitude: 0.3189207,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
    {
        longitude: 32.5888808,
        latitude: 0.320358,
        createdAt: '2019-05-08 10:00:00.326000',
        updatedAt: '2019-05-08 10:00:00.006000'
    },
];
exports.DEFAULT_ADDRESSES = [
    {
        address: 'Jomo Kenyatta Airport',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'VFS Centre',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'US Embassy',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Nairobi Guest House',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Andela Nairobi',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Morningside Apartments USIU road',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Safari Park Hotel',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Lymack Suites',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Najjera',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Entebbe Airport',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'US Embassy Kampala',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Andela Kampala',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Golden Tulip',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Kisasi',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Fusion Arena',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Watoto Church',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
    {
        address: 'Garden City',
        createdAt: '2019-04-09',
        updatedAt: '2019-05-08 10:00:00.326000'
    },
];
exports.providerErrorMessage = ':warning:Unsuccessful request. None of the available providers has a cab and a driver. '
    + 'Kindly update this information to proceed with approval';
//# sourceMappingURL=constants.js.map