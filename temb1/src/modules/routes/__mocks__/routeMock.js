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
const successMessage = 'Percentage Usage Generated';
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
const percentages = [];
const mostUsedRoute = {
  Route: 'N/A',
  numberOfTimes: 0
};
const leastUsedRoute = {
  Route: 'N/A',
  numberOfLeastUsedTime: 0
};
const formatDate = () => {
  const date = new Date();

  const format = `${date.getFullYear()}-${
    !(String(date.getMonth()).length === 1)
      ? date.getMonth() + 1
      : `0${date.getMonth() + 1}`
  }-${
    !(String(date.getDate()).length === 1)
      ? date.getDate() + 1
      : `0${date.getDate() + 1}`
  }`;
  return format;
};
// route record
const newRoute = {
  name: 'Kisangani',
  imageUrl: null,
  destinationId: 1,
  homebaseId: 1
};
// route batch
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
// route use record
const newRouteUseRecord = {
  batchId: 1,
  batchUseDate: formatDate(),
  confirmedUsers: 1,
};

export {
  batchRecords, successMessage, returnedObject, percentages, mostUsedRoute,
  leastUsedRoute, newRoute, newRouteBatch, newRouteUseRecord, formatDate
};
