"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const startDate = 'AAAAAA';
const endDate = 'BBBBBB';
const workHours = 'CCC-DDD';
const id = 12;
const providerUserDetails = {
    id: 1,
    name: 'Andela Kenya',
    providerUserId: 15,
    user: {},
    isDirectMessage: true,
};
const fellow = {
    id: 1,
    slackId: 'FFFFFF',
    email: 'BBBBBB.CCCCCC@localhost'
};
const partner = {
    name: 'GGGGGG',
    id: 1
};
const fellowId = fellow.id;
const partnerId = partner.id;
const updateStartDate = 'AAAAAA';
const updateEndDate = 'BBBBBB';
const updateWorkHours = 'CCC-DDD';
exports.engagement = {
    id,
    startDate,
    endDate,
    workHours,
    fellowId,
    partnerId,
    fellow,
    partner
};
exports.updateEngagement = Object.assign(Object.assign({}, exports.engagement), { startDate: updateStartDate, endDate: updateEndDate, workHours: updateWorkHours });
exports.mockRouteRequestData = {
    routeRequest: {
        dataValues: {
            id: 12,
            status: 'Pending',
            managerComment: 'ZZZZZZZ',
            opsComment: 'XXXXXX',
            routeImageUrl: 'Pending',
            distance: 3.02,
            busStopDistance: 1.02,
        },
        botToken: 'XXXXXXXXX'
    },
    dataValues: {
        id: 12,
        status: 'Pending',
        managerComment: 'ZZZZZZZ',
        opsComment: 'XXXXXX',
        routeImageUrl: 'Pending',
        distance: 3.02,
        busStopDistance: 1.02,
    },
    id: 12,
    status: 'Pending',
    managerComment: 'Z',
    opsComment: 'XXXXXX',
    routeImageUrl: 'Pending',
    distance: 3.02,
    busStopDistance: 1.02,
    manager: {
        id: 1,
        slackId: 1,
        email: 'AAAAAA.BBBBBB@localhost',
    },
    busStop: {
        id: 1,
        address: 'AAAAAA',
        locationId: 1
    },
    home: {
        id: 1,
        address: 'BBBBBB',
        locationId: 1
    },
    engagement: {
        id: 1,
        startDate: '2018-01-30T23:00:00.000Z',
        endDate: '2019-01-30T23:00:00.000Z',
        workHours: '20:00 - 1:20',
        fellow,
        partner
    }
};
exports.mockRouteData = {
    id: 12,
    status: 'Inactive',
    vehicle: 'ZZZZZZZ',
    name: 'XXXXXX',
    imageUrl: 'IIIIII',
    takeOff: 'Pending',
    capacity: 3,
    comments: 'AAAAAA',
    destination: 'AAAAAA',
    inUse: 'AAAAAA',
};
const riders = [{ email: 'AAA.BBB@CCC.DDD', slackId: 'ABCDEF', id: 123 }];
const destination = { id: 456, address: 'BBBBBB' };
const route = {
    id: 1, name: 'ZZZZZZ', imageUrl: 'https://image-url', destination, routeBatch: [{ batch: 'A' }]
};
const cabDetails = {
    id: 1, capacity: 4, regNumber: 'CCCCCC', model: 'saburu'
};
exports.batchDetails = {
    inUse: 1,
    batch: 'A',
    capacity: 1,
    takeOff: 'DD:DD',
    comments: 'EEEEEE',
    imageUrl: 'https://image-url',
    status: 'Active',
};
exports.departmentMocks = [
    {
        dataValues: {
            name: 'Mathematics',
            id: 1,
            head: {
                dataValues: {
                    id: 1
                }
            }
        }
    }
];
exports.departmentDetails = {
    get: () => (exports.departmentDetails),
    name: 'Mathematics',
    id: 1,
    head: {
        dataValues: {
            id: 1
        }
    }
};
exports.departmentMocks2 = [
    {
        get: ({ plain }) => {
            if (plain) {
                return exports.departmentDetails;
            }
        }
    },
    {
        get: () => (exports.departmentDetails)
    }
];
exports.mockRouteBatchData = Object.assign({ cabDetails, route, riders }, exports.batchDetails);
exports.mockDataMissingTeamUrl = {
    newOpsStatus: 'decline',
    comment: 'some comment',
    provider: providerUserDetails
};
exports.mockDeclinedRouteRequest = {
    newOpsStatus: 'decline',
    comment: 'some comment',
    teamUrl: 'tembea.slack.com',
};
exports.mockDataMissingParams = {
    newOpsStatus: 'approve',
    comment: 'some comment',
    reviewerEmail: 'test.buddy2@andela.com',
    teamUrl: 'andela.slack.com'
};
exports.mockDataInvalidComment = {
    newOpsStatus: 'decline',
    comment: '',
    teamUrl: 'tembea.slack.com',
};
exports.mockDataInvalidCapacity = {
    newOpsStatus: 'approve',
    comment: 'comment',
    teamUrl: 'tembea.slack.com',
    routeName: 'ParksWay',
    takeOff: '2:30',
    cabRegNumber: 'ABC 123',
    provider: providerUserDetails
};
exports.mockDataInvalidTakeOffTime = {
    newOpsStatus: 'approve',
    comment: 'comment',
    teamUrl: 'tembea.slack.com',
    routeName: 'ParksWay',
    takeOff: 'Take Off',
    provider: providerUserDetails
};
exports.mockDataCorrectRouteRequest = {
    newOpsStatus: 'approve',
    comment: 'some comment',
    teamUrl: 'tembea.slack.com',
    routeName: 'ParksWay',
    takeOff: '9:30',
    cabRegNumber: 'ABC 123',
    provider: providerUserDetails
};
exports.mockCabsData = {
    cabs: [
        {
            regNumber: 'SMK 319 JK',
            capacity: 4,
            model: 'subaru',
            providerId: 1,
            location: 'Lagos'
        },
        {
            regNumber: 'LND 419 CN',
            capacity: 4,
            model: 'toyota',
            providerId: 1,
            location: 'Wakanda'
        },
        {
            regNumber: 'IKR 409 KI',
            capacity: 8,
            model: 'toyota',
            providerId: 1,
            location: 'Kampala'
        },
        {
            regNumber: 'APP 519 DT',
            capacity: 4,
            model: 'prado',
            providerId: 2,
            location: 'Nairobi'
        }
    ],
    cabsFiltered: [
        {
            regNumber: 'SMK 319 JK',
            capacity: 4,
            model: 'subaru',
            providerId: 1,
            location: 'Lagos'
        },
        {
            regNumber: 'LND 419 CN',
            capacity: 4,
            model: 'toyota',
            providerId: 1,
            location: 'Wakanda'
        }
    ],
    mockCabUpdateData: {
        driverName: 'Muhwezi Deo'
    }
};
exports.routeData = {
    id: 1,
    batchUseDate: '2018-05-03',
    batch: {
        id: 1001,
        takeOff: '09:50',
        status: 'Activ',
        comments: 'Went to the trip',
        routeId: 1001,
        cabId: 10,
        cabDetails: {
            driverName: 'Kafuuma Henry',
            driverPhoneNo: 256772312456,
            regNumber: 'UBE321A'
        },
        route: {
            routeId: 1001,
            name: 'Hoeger Pine',
            destination: {
                locationId: 1002,
                address: '629 O\'Connell Flats'
            }
        }
    }
};
exports.data = {
    id: 2,
    userId: 15,
    batchRecordId: 2,
    userAttendStatus: 'NotConfirmed',
    reasonForSkip: null,
    rating: null,
    user: {
        id: 15,
        name: 'Ronald Okello',
        slackId: 'UG93CNE',
        email: 'ronald.okello@andela.com'
    },
    routeUseRecord: {
        id: 2,
        departureDate: '2019-04-03 03:00',
        routeId: 1002,
        batch: {
            batchId: 1003,
            takeOff: '03:00',
            status: 'Active',
            comments: 'Consequatur cumque est veritatis unde quae.'
        },
        cabDetails: {
            cabId: 1,
            driverName: 'Dominic Toretto',
            driverPhoneNo: '(566) 790-4855',
            regNumber: 'SMK 319 JK'
        }
    }
};
exports.mockReturnedCountryData = {
    name: 'Kenya',
    topLevelDomain: [
        '.ke'
    ],
    alpha2Code: 'KE',
    alpha3Code: 'KEN',
    callingCodes: [
        '254'
    ],
    capital: 'Nairobi',
    altSpellings: [
        'KE',
        'Republic of Kenya',
        'Jamhuri ya Kenya'
    ],
    region: 'Africa',
    subregion: 'Eastern Africa',
    population: 47251000,
    latlng: [
        1,
        38
    ]
};
exports.mockCountryError = {
    status: 404,
    message: 'Country not found'
};
exports.mockCreatedHomebase = {
    homebase: {
        id: 1,
        name: 'Nairobi',
        countryId: 1,
        channel: 'UO23D',
        createdAt: '2019-04-01T12:07:13.002Z',
        updatedAt: '2019-04-01T12:07:13.002Z',
        deletedAt: null,
        addressId: 1
    },
    isNewHomebase: true
};
exports.mockLocation = {
    longitude: '30,654123',
    latitude: '0,123001',
};
exports.mockNewHomebase = {
    get: () => (Object.assign({}, exports.mockCreatedHomebase.homebase)),
    dataValues: Object.assign({}, exports.mockCreatedHomebase.homebase),
    _options: {
        isNewRecord: true
    }
};
exports.mockCountry = {
    id: 1,
    name: 'Kenya',
    status: 'Active',
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z'
};
exports.mockExistingHomebase = {
    homebase: {
        id: 1,
        name: 'Nairobi',
        countryId: 1,
        createdAt: '2019-04-01T12:07:13.002Z',
        updatedAt: '2019-04-01T12:07:13.002Z'
    },
    isNewHomeBase: false
};
exports.mockGetCabsData = {
    pageMeta: {
        totalPages: 1,
        page: 1,
        totalResults: 3,
        pageSize: 100
    },
    data: [
        {
            id: 1,
            name: 'Uber Kenya',
            providerUserId: 1,
            user: {
                name: 'John smith',
                phoneNo: null,
                email: 'john.smith@gmail.com'
            }
        },
        {
            id: 2,
            name: 'Taxify Kenya',
            providerUserId: 2,
            user: {
                name: 'Derrick jones',
                phoneNo: null,
                email: 'derrick.jones@gmail.com'
            }
        },
        {
            id: 3,
            name: 'Endesha Kenya',
            providerUserId: 3,
            user: {
                name: 'Abishai Omari',
                phoneNo: null,
                email: 'abishai.omari@andela.com'
            }
        }
    ]
};
exports.mockProviderRecord = {
    id: 1,
    name: 'Uber Kenya',
    providerUserId: 1,
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z',
    deletedAt: null
};
exports.mockCreatedProvider = [
    {
        dataValues: exports.mockProviderRecord,
        get: () => exports.mockProviderRecord
    },
    true
];
exports.mockReturnedProvider = {
    provider: exports.mockProviderRecord,
    isNewProvider: true
};
exports.mockProvider = {
    provider: {
        id: 1,
        name: 'Uber Kenya',
        providerUserId: 1,
        createdAt: '2019-04-01T12:07:13.002Z',
        updatedAt: '2019-04-01T12:07:13.002Z'
    }
};
exports.mockExistingProvider = {
    provider: {
        id: 1,
        name: 'Uber Kenya',
        providerUserId: 1,
        createdAt: '2019-04-01T12:07:13.002Z',
        updatedAt: '2019-04-01T12:07:13.002Z',
        deletedAt: null
    },
    isNewProvider: false
};
exports.mockUser = {
    id: 1,
    name: 'Allan Mogusu'
};
exports.mockHomebaseResponse = {
    totalPages: 1,
    homebases: [{
            id: 1,
            homebaseName: 'Nairobi',
            country: 'Kenya',
            createdAt: '2019-05-05T10:57:31.476Z',
            updatedAt: '2019-05-05T10:57:31.476Z'
        },
        {
            id: 2,
            homebaseName: 'Kampala',
            country: 'Uganda',
            createdAt: '2019-05-05T10:57:31.476Z',
            updatedAt: '2019-05-05T10:57:31.476Z'
        }
    ],
    pageNo: 1,
    totalItems: 2,
    itemsPerPage: 10
};
exports.mockGetHomebaseResponse = {
    totalPages: 1,
    homebases: [{
            id: 1,
            homebaseName: 'Nairobi',
            country: 'Kenya',
            createdAt: '2019-05-05T10:57:31.476Z',
            updatedAt: '2019-05-05T10:57:31.476Z'
        }
    ],
    pageNo: 1,
    totalItems: 1,
    itemsPerPage: 10
};
exports.mockRecord = [{
        id: 9,
        batchId: 1009,
        confirmedUsers: 0,
        unConfirmedUsers: 1,
        skippedUsers: 0,
        pendingUsers: 0,
        batchUseDate: '2019-07-26',
        createdAt: '2019-07-24T14:24:12.970Z',
        updatedAt: '2019-07-24T15:11:01.861Z',
        batch: {
            id: 1,
            takeOff: '03:00',
            batch: 'B',
            route: {
                name: 'Nicholaus Wells',
                destination: {
                    address: '77548 Smith Corner'
                }
            },
            BatchUseRecords: [{ rating: 3 }, { rating: 5 }]
        }
    }];
exports.mockDriver = {
    id: 1,
    driverPhoneNo: '07345345435',
    driverName: 'Jarvis',
    email: 'jarvis@mail',
    createdAt: '2019-01-01 03:00:00+03',
    updatedAt: '2019-01-01 03:00:00+03',
    deletedAt: null
};
exports.mockDriversData = [exports.mockDriver, exports.mockDriver, exports.mockDriver];
exports.mockUserLeavesRouteHandler = {
    payload: {
        user: { id },
        team: { id }
    },
    userName: 'name',
    routeName: 'name',
    riders: [1]
};
exports.getMockTrip = ({ destinationId, departmentId, riderId, noOfPassengers, }) => ({
    destinationId,
    riderId,
    name: 'Trip to London',
    reason: 'Testing the flow',
    departmentId,
    tripStatus: 'Pending',
    departureTime: new Date(new Date().getTime() - 864000000).toISOString(),
    requestedById: riderId,
    originId: 1,
    noOfPassengers,
    tripType: 'Regular Trip'
});
//# sourceMappingURL=index.js.map