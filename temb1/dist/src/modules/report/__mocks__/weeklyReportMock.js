"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUserTrip1 = {
    id: 2,
    name: 'name',
    email: 'email_tip@gmail.com',
    trips: [
        {
            id: 1,
            tripstatus: 'Completed',
            tripType: 'Airport Transfer',
        },
        {
            id: 2,
            tripstatus: 'Completed',
            tripType: 'Embassy Visit',
        },
        {
            id: 3,
            tripstatus: 'Completed',
            tripType: 'Regular Trip',
        },
    ],
    createdAt: '2020-01-22T22:00:00.000Z',
    updatedAt: '2020-01-22T22:00:00.000Z',
};
exports.mockUserRoute = {
    id: 1,
    name: 'name',
    email: 'email_route@gmail.com',
    routes: [{
            id: 1,
            rating: 3,
            userAttendStatus: 'Confirmed',
        }],
    createdAt: '2020-01-22T22:00:00.000Z',
    updatedAt: '2020-01-22T22:00:00.000Z',
};
exports.mockUserRoute2 = {
    id: 2,
    name: 'name',
    email: 'email_tip@gmail.com',
    routes: [{
            id: 2,
            rating: 3,
            userAttendStatus: 'Confirmed',
        }],
    createdAt: '2020-01-22T22:00:00.000Z',
    updatedAt: '2020-01-22T22:00:00.000Z',
};
exports.mockEmailData = {
    'emial@gmail.com': {
        embassyVisit: 0,
        regularTrip: 0,
        airportTransfer: 1,
        date: 'January 4, 2020',
        name: 'Willliam',
        total: 2,
        routeTrip: 1,
    },
    'email@andela.com': {
        embassyVisit: 2,
        regularTrip: 1,
        airportTransfer: 0,
        date: 'January 4, 2020',
        name: 'Davis Kabiswa',
        total: 5,
        routeTrip: 2,
    },
};
exports.userEmails = ['emial@gmail.com', 'email@andela.com'];
//# sourceMappingURL=weeklyReportMock.js.map