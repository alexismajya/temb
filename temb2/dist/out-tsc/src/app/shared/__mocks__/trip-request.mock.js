import * as moment from 'moment';
import { TripRequest, TripStatus } from '../models/trip-request.model';
import { Users } from '../models/users.model';
var user = new Users().deserialize({
    id: 123,
    name: 'OOOOOO PPPPPP',
    email: 'AAA.BBB@CCC.DDD',
    slackId: 'ZZZZZZ'
});
export var tripRequestMock = new TripRequest().deserialize({
    name: 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
    status: TripStatus.APPROVED,
    arrivalTime: null,
    type: 'Regular Trip',
    departureTime: moment('2019-12-22T21:00:00.000Z'),
    requestedOn: moment('2019-02-26T09:07:52.185Z'),
    department: 'Finance-demo-update',
    origin: {
        address: 'kisangani'
    },
    destination: {
        address: 'Rubavu'
    },
    rider: user,
    requester: user,
    approvedBy: user,
    provider: {
        name: 'Uber Kenya',
        email: 'uberkenya@uber.com',
        phoneNumber: '08040404040',
    },
    id: 1,
    trip: {
        originId: 12,
        destinationId: 13,
        providerId: 20,
        driverId: 10,
        declinedById: 10,
        origin: {
            address: 'kisangani'
        },
        destination: {
            address: 'Rubavu'
        },
        provider: {
            name: 'provider'
        },
        requester: {
            name: 'rungano'
        },
        department: {
            name: 'department'
        },
        rider: {
            name: 'rider'
        },
        approver: {
            name: 'approver'
        },
        confirmer: {
            name: 'confirmer'
        },
        decliner: {
            name: 'decliner'
        }
    }
});
export var pastTripMock = [
    new TripRequest().deserialize({
        name: 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
        status: TripStatus.COMPLETED,
        arrivalTime: null,
        type: 'Regular Trip',
        departureTime: '2019-12-22T21:00:00.000Z',
        requestedOn: '2019-02-26T09:07:52.185Z',
        department: 'Finance-demo-update',
        destination: 'Andela Nairobi',
        pickup: 'Jomo Kenyatta Airport',
        rider: user,
        requester: user,
        approvedBy: user
    }),
    new TripRequest().deserialize({
        name: 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
        status: TripStatus.OPSDECLINE,
        arrivalTime: null,
        type: 'Regular Trip',
        departureTime: '2019-12-22T21:00:00.000Z',
        requestedOn: '2019-02-26T09:07:52.185Z',
        department: 'Finance-demo-update',
        destination: 'Andela Nairobi',
        pickup: 'Jomo Kenyatta Airport',
        rider: user,
        requester: user,
        approvedBy: user
    }),
    new TripRequest().deserialize({
        name: 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
        status: TripStatus.MANAGERDECLINE,
        arrivalTime: null,
        type: 'Regular Trip',
        departureTime: '2019-12-22T21:00:00.000Z',
        requestedOn: '2019-02-26T09:07:52.185Z',
        department: 'Finance-demo-update',
        destination: 'Andela Nairobi',
        pickup: 'Jomo Kenyatta Airport',
        rider: user,
        requester: user,
        approvedBy: user
    }),
    new TripRequest().deserialize({
        name: 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
        status: TripStatus.CANCELLED,
        arrivalTime: null,
        type: 'Regular Trip',
        departureTime: '2019-12-22T21:00:00.000Z',
        requestedOn: '2019-02-26T09:07:52.185Z',
        department: 'Finance-demo-update',
        destination: 'Andela Nairobi',
        pickup: 'Jomo Kenyatta Airport',
        rider: user,
        requester: user,
        approvedBy: user
    }),
    new TripRequest().deserialize({
        name: 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
        status: TripStatus.APPROVED,
        arrivalTime: null,
        type: 'Regular Trip',
        departureTime: '3019-12-22T21:00:00.000Z',
        requestedOn: '2019-02-26T09:07:52.185Z',
        department: 'Finance-demo-update',
        destination: 'Andela Nairobi',
        pickup: 'Jomo Kenyatta Airport',
        rider: user,
        requester: user,
        approvedBy: user
    }),
    new TripRequest().deserialize({
        name: 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
        status: TripStatus.APPROVED,
        arrivalTime: null,
        type: 'Regular Trip',
        departureTime: '2018-12-22T21:00:00.000Z',
        requestedOn: '2019-02-26T09:07:52.185Z',
        department: 'Finance-demo-update',
        destination: 'Andela Nairobi',
        pickup: 'Jomo Kenyatta Airport',
        rider: user,
        requester: user,
        approvedBy: user
    })
];
//# sourceMappingURL=trip-request.mock.js.map