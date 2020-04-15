"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const batchRecords = [[{
            BatchUseRecordID: 1,
            userAttendStatus: 'NotConfirmed',
            RouteRecordID: 1,
            RouteBatchID: 1002,
            RouteBatchName: 'A',
            Route: 'Rowe Center',
            RouteID: 1008,
            batchUseDate: '2019-05-07'
        },
        {
            BatchUseRecordID: 2,
            userAttendStatus: 'NotConfirmed',
            RouteRecordID: 1,
            RouteBatchID: 1002,
            RouteBatchName: 'B',
            Route: 'Rowe Center',
            RouteID: 1008,
            batchUseDate: '2019-05-07'
        },
    ]];
exports.batchRecords = batchRecords;
const successMessage = 'Percentage Usage Generated';
exports.successMessage = successMessage;
const returnedObject = {
    mostUsedBatch: {
        emptyRecord: {
            Route: 'N/A',
            RouteBatch: '',
            percentageUsage: 0,
            users: 0
        }
    },
    leastUsedBatch: {
        emptyRecord: {
            Route: 'N/A',
            RouteBatch: '',
            percentageUsage: 0,
            users: 0
        }
    },
    dormantRouteBatches: []
};
exports.returnedObject = returnedObject;
const percentages = [];
exports.percentages = percentages;
const mostUsedRoute = {
    Route: 'N/A',
    numberOfTimes: 0
};
exports.mostUsedRoute = mostUsedRoute;
const leastUsedRoute = {
    Route: 'N/A',
    numberOfLeastUsedTime: 0
};
exports.leastUsedRoute = leastUsedRoute;
const formatDate = () => {
    const date = new Date();
    const format = `${date.getFullYear()}-${!(String(date.getMonth()).length === 1)
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`}-${!(String(date.getDate()).length === 1)
        ? date.getDate() + 1
        : `0${date.getDate() + 1}`}`;
    return format;
};
exports.formatDate = formatDate;
const newRoute = {
    name: 'Kisangani',
    imageUrl: null,
    destinationId: 1,
    homebaseId: 1
};
exports.newRoute = newRoute;
const newRouteBatch = {
    takeOff: '11h:45',
    capacity: '5',
    inUse: 1,
    status: 'Active',
    comments: 'fake comment',
    batch: 'kunu batch',
    cabId: 1,
    driverId: 1,
    homebaseId: 1
};
exports.newRouteBatch = newRouteBatch;
const newRouteUseRecord = {
    batchId: 1,
    batchUseDate: formatDate(),
    confirmedUsers: 1,
};
exports.newRouteUseRecord = newRouteUseRecord;
//# sourceMappingURL=routeMock.js.map