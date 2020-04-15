"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockedValue = {
    routes: [
        {
            name: 'my trip to the dojo',
            status: 'DeclinedByManager',
            arrivalTime: null,
            type: 'Regular Trip',
            departureTime: '2018-11-16T06:30:00.000Z',
            requestedOn: '2018-12-03T00:00:00.000Z',
            department: 'People',
            destination: 'the dojo',
            pickup: 'the dojo',
            rider: {
                name: 'Opeoluwa Iyi-kuyoro',
                email: 'opeoluwa.iyi-kuyoro@andela.com',
                slackId: 'UE1920ZNW'
            },
            requester: {
                name: 'Opeoluwa Iyi-kuyoro',
                email: 'opeoluwa.iyi-kuyoro@andela.com',
                slackId: 'UE1920ZNW'
            }
        }
    ]
};
exports.mockedValue = mockedValue;
const tripInfo = {
    dataValues: {
        name: 'Kico',
        tripStatus: 'Confirm',
        departureTime: new Date(),
        arrivalTime: new Date(),
        createdAt: new Date(),
        tripType: 'A',
        noOfPassenger: 8
    }
};
exports.tripInfo = tripInfo;
const resultValue = {
    data: {
        pageMeta: {
            page: 1,
            pageSize: 100,
            totalPages: 2,
            totalResults: 1,
        },
    },
    message: '1 of 2 page(s).',
    success: true
};
exports.resultValue = resultValue;
const response = {
    status: jest
        .fn(() => ({
        json: jest.fn(() => { })
    }))
        .mockReturnValue({ json: jest.fn() })
};
exports.response = response;
const mockTrip = {
    trip: [{
            id: 3,
            name: 'my trip to the dojo',
            reason: null,
            tripType: 'Regular Trip',
            tripDetailId: null,
            riderId: 6,
            noOfPassengers: 1,
            departmentId: 3,
            tripStatus: 'DeclinedByManager',
            originId: 1,
            destinationId: 1,
            cost: null,
            departureTime: '2018-11-16 09:30:00.000 +00:00',
            arrivalTime: null,
            requestedById: 6,
            approvedById: null,
            confirmedById: 3,
            declinedById: 6,
            operationsComment: 'derick has it',
            cabId: 5
        }]
};
exports.mockTrip = mockTrip;
const updatedValue = [
    1,
    [{
            name: 'my trip to the dojo',
            status: 'DeclinedByManager',
            arrivalTime: null,
            type: 'Regular Trip',
            departureTime: '2018-11-16T06:30:00.000Z',
            requestedOn: '2018-12-03T00:00:00.000Z',
            department: 'People',
            destination: 'the dojo',
            pickup: 'the dojo',
            rider: {
                name: 'Opeoluwa Iyi-kuyoro',
                email: 'opeoluwa.iyi-kuyoro@andela.com',
                slackId: 'UE1920ZNW'
            },
            requester: {
                name: 'Opeoluwa Iyi-kuyoro',
                email: 'opeoluwa.iyi-kuyoro@andela.com',
                slackId: 'UE1920ZNW'
            }
        }]
];
exports.updatedValue = updatedValue;
const mockAirportTransferTrip = {
    id: 1,
    name: 'From JFK to LAX',
    reason: 'explore?',
    tripType: 'Airport Transfer',
    tripDetail: {
        flightNumber: 'FL6921GG'
    },
    rider: {},
    noOfPassengers: 2,
    department: {},
};
exports.mockAirportTransferTrip = mockAirportTransferTrip;
const providerMock = {
    id: 1,
    name: 'Provider Test Name',
    providerUserId: 1,
    isDirectMessage: true,
    user: {
        id: 1,
        email: 'provider_email@email.com',
        phoneNo: '08001111111',
        slackId: 'upng'
    }
};
exports.providerMock = providerMock;
const mockedTravelTrips = {
    data: [
        {
            departmentId: 3,
            departmentName: 'People',
            totalTrips: '1',
            averageRating: '3.00',
            totalCost: '70'
        },
        {
            departmentId: 5,
            departmentName: 'D0 Programs',
            totalTrips: '2',
            averageRating: '4.00',
            totalCost: '120'
        }
    ]
};
exports.mockedTravelTrips = mockedTravelTrips;
const tripInformation = {
    noOfPassengers: 2,
    origin: { address: 'pickup' },
    destination: { address: 'destination' },
    rider: { name: 'passenger', phoneNo: '90993444' },
    createdAt: '',
    departureTime: '',
    cab: { regNumber: '', model: '' },
    driver: { driverName: '', driverPhoneNo: '' },
    confirmer: { slackId: 'DADAD' }
};
exports.tripInformation = tripInformation;
//# sourceMappingURL=index.js.map