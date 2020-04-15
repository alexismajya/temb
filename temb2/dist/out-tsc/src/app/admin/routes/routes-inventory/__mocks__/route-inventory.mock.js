export var routesMock = [
    {
        id: 1,
        status: 'Inactive',
        takeOff: '11:33',
        capacity: 4,
        batch: 'A',
        comments: '',
        inUse: 2,
        name: 'Trainer',
        destination: 'Home',
        driverName: 'Food',
        driverPhoneNo: '+23480232',
        regNumber: 'WEK123'
    },
    {
        id: 2,
        status: 'Active',
        takeOff: '11:33',
        capacity: 4,
        batch: 'A',
        comments: '',
        inUse: 2,
        name: 'Trainer',
        destination: 'Home',
        driverName: 'Food',
        driverPhoneNo: '+23480232',
        regNumber: 'WEK123'
    }
];
export var editMockPayload = {
    success: true,
    route: {
        batch: 'A',
        capacity: 22,
        inUse: 10,
        name: 'Grace Islands',
        regNumber: 'SMK 319 JK',
        status: 'Inactive',
        takeOff: '22:00',
        providerId: 1
    }
};
//# sourceMappingURL=route-inventory.mock.js.map