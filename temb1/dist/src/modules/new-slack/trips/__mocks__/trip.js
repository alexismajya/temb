"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trip = {
    id: 2,
    requestId: 32,
    departmentId: 23,
    tripStatus: 'Approved',
    destination: { address: 'Dubai' },
    origin: { address: 'New York' },
    pickup: {},
    departureDate: new Date().toISOString(),
    departureTime: new Date().toISOString(),
    requestDate: new Date(),
    requester: { slackId: '1234' },
    requestedById: 6,
    riderId: 6,
    rider: { slackId: '3456' },
    homebase: { channel: 'HU123' },
    decliner: { slackId: 'U1727U' },
    driver: { id: 767 },
    department: { headId: 3, head: { id: 4, slackId: 'U234' } },
    cab: {
        driverName: 'Dave',
        driverPhoneNo: '6789009876',
        regNumber: 'JK 321 LG',
    },
    approver: {
        slackId: 'slackId',
    },
};
//# sourceMappingURL=trip.js.map