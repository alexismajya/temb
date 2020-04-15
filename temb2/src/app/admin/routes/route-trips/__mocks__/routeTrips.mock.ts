import * as moment from 'moment';
const routeTripsResponseMock = {
    pageMeta: {
        itemsPerPage: 10,
        pageNo: 1,
        totalItems: 1,
        totalPages: 2
    },
    data: [
      {
        averageRating: 0,
        batch: {
            takeOff: '03:00',
            batch: 'A',
            route: { destination: { address: '99971 Jacobi Forks' }, name: 'Maurine Courts' },
            cabDetails: { regNumber: 'SMK 319 JK' }
        },
        batchId: 1001,
        batchUseDate: moment (Date.now()),
        confirmedUsers: 0,
        createdAt: '2019-07-25T23:00:01.321Z',
        id: 52,
        pendingUsers: 0,
        skippedUsers: 0,
        unConfirmedUsers: 5,
        updatedAt: '2019-07-26T11:39:02.505Z',
        utilization: '0'
      }
    ]
};

export default routeTripsResponseMock;
