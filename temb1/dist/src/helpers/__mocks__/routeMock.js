"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const singleRouteDetails = {
    id: 1003,
    name: "O'Conner Roads",
    imageUrl: null,
    destination: {
        id: 1003,
    }
};
exports.singleRouteDetails = singleRouteDetails;
const routeBatch = {
    id: 1,
    takeOff: '03:00',
    capacity: 4,
    status: 'Active',
    routeId: 1003,
    cabId: 3,
    cabDetails: {
        id: 3,
        regNumber: 'IKR 409 KI',
        capacity: '8',
        model: 'toyota',
        providerId: 3,
        createdAt: '2019-01-14T00:00:00.000Z',
        updatedAt: '2019-01-14T00:00:00.000Z',
        deletedAt: null
    },
    route: singleRouteDetails,
    driver: {
        id: 1,
        driverName: 'Pied Piper',
        driverPhoneNo: '708989098',
        driverNumber: '254234',
        providerId: 1,
        email: 'pp@gmail.com',
        createdAt: '2019-01-01T00:00:00.000Z',
        updatedAt: '2019-01-01T00:00:00.000Z',
        deletedAt: null
    },
    riders: [
        {
            id: 14,
            name: 'Test User',
            slackId: 'UXXXXX',
            phoneNo: null,
            email: 'oneuser@mail.com',
            defaultDestinationId: null,
            routeBatchId: 1001,
            createdAt: '2019-08-09T00:00:02.727Z',
            updatedAt: '2019-08-09T00:00:02.727Z'
        }
    ]
};
exports.routeBatch = routeBatch;
const batch = {
    id: 2,
    status: 'Active',
    takeOff: '03:00',
    capacity: 4,
    batch: 'B',
    comments: null,
    inUse: 0,
    name: "O'Conner Roads",
    destination: '17013 Misael Locks',
    driverName: 'Tej Parker',
    driverPhoneNo: '352.211.6285 x032',
    regNumber: 'IKR 409 KI'
};
exports.batch = batch;
const routeDetails = {
    route: {
        id: 1005,
        routeBatch: [
            {
                id: 1001,
                batch: 'A',
            },
            {
                id: 1021,
                batch: 'B',
            }
        ]
    },
    created: false
};
exports.routeDetails = routeDetails;
const returnNullPercentage = [{
        Route: 'Twila Centers', RouteBatch: 'B', percentageUsage: 0, users: 1
    }];
exports.returnNullPercentage = returnNullPercentage;
const record = [{
        BatchUseRecordID: 3,
        userAttendStatus: 'NotConfirmed',
        RouteRecordID: 2,
        RouteBatchID: 1003,
        RouteBatchName: 'B',
        Route: 'Twila Centers',
        RouteID: 1006,
        batchUseDate: '2019-05-07'
    }];
exports.record = record;
const returnedPercentage = [{
        Route: 'Twila Centers', RouteBatch: 'B', percentageUsage: 100, users: 1
    }];
exports.returnedPercentage = returnedPercentage;
const confirmedRecord = [{
        BatchUseRecordID: 3,
        userAttendStatus: 'Confirmed',
        RouteRecordID: 2,
        RouteBatchID: 1003,
        RouteBatchName: 'B',
        Route: 'Twila Centers',
        RouteID: 1006,
        batchUseDate: '2019-05-07'
    }];
exports.confirmedRecord = confirmedRecord;
const percentagesList = [{
        Route: 'Twila Centers',
        RouteBatch: 'A',
        users: 7,
        percentageUsage: 14
    },
    {
        Route: 'Twila Center',
        RouteBatch: 'B',
        users: 5,
        percentageUsage: 20
    }];
exports.percentagesList = percentagesList;
const singlePercentageArray = [{
        Route: 'Twila Centers',
        RouteBatch: 'A',
        users: 7,
        percentageUsage: 14
    }];
exports.singlePercentageArray = singlePercentageArray;
const returnedMaxObj = {
    Route: 'Twila Center',
    RouteBatch: 'B',
    users: 5,
    percentageUsage: 20
};
exports.returnedMaxObj = returnedMaxObj;
const returnedMinObj = {
    Route: 'Twila Centers',
    RouteBatch: 'A',
    users: 7,
    percentageUsage: 14
};
exports.returnedMinObj = returnedMinObj;
const emptyRecord = {
    Route: 'N/A',
    RouteBatch: '',
    percentageUsage: 0,
    users: 0
};
exports.emptyRecord = emptyRecord;
const routeResult = {
    totalPages: 1,
    pageNo: 1,
    itemsPerPage: 100,
    totalItems: [{
            inUse: '4',
            id: 1003,
            status: 'Active',
            capacity: 5,
            takeOff: '03:00',
            batch: 'B',
            comments: 'Voluptatem quos in.',
            count: '4',
        }],
    routes: [
        batch
    ]
};
exports.routeResult = routeResult;
const LocationCoordinates = {
    lat: '1.34243535',
    lng: '-1.32424324'
};
exports.LocationCoordinates = LocationCoordinates;
const returnedLocation = {
    id: 1,
    latitude: '1.34243535',
    longitude: '-1.34243535',
    createdAt: '2019-05-09 13:00:00.326+03',
    updatedAt: '2019-05-09 13:00:00.326+03'
};
exports.returnedLocation = returnedLocation;
const returnedAddress = {
    id: 1,
    address: 'Andela Kenya',
    location: {
        latitude: '-1.34243535',
        longitude: '1.34243535'
    },
    createdAt: '2019-05-09 13:00:00.326+03',
    updatedAt: '2019-05-09 13:00:00.326+03',
};
exports.returnedAddress = returnedAddress;
const returnedSingleRoute = [Object.assign({}, singleRouteDetails)];
exports.returnedSingleRoute = returnedSingleRoute;
const newRouteWithBatchData = {
    routeName: 'Old Town Road',
    destination: {
        address: 'Roysambu Stage',
        coordinates: {
            lat: '-12.3242343',
            lng: '98.34324342'
        },
        takeOffTime: '12:30',
        capacity: 10,
        providerId: 1,
        imageUrl: 'this-url'
    }
};
exports.newRouteWithBatchData = newRouteWithBatchData;
//# sourceMappingURL=routeMock.js.map