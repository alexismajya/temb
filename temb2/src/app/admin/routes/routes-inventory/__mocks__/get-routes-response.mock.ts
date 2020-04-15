const driverMock = {
  id: 2,
        driverName: 'Jack Black',
        driverPhoneNo: '908989098',
        driverNumber: '254235',
        providerId: 2,
        email: 'deo@gmail.com',
};

const cabDetailsMock = {
  id: 2,
  regNumber: 'LND 419 CN',
  capacity: 4,
  model: 'toyota',
  providerId: 1
};

const homebaseMock = {
  id: 1,
  homebaseName: 'Nairobi',
  country: {
    name: 'Kenya',
    id: 1,
    status: 'Active'
  }
};

const routeMock = {
  id: 1004,
  name: 'Jones Spring',
  imageUrl: null,
  destinationId: 1004,
  homebaseId: 1,
  destination: {
    id: 1004,
    address: '2081 Kuhlman Route',
  }
};

const getRoutesResponseMock = {
    pageMeta: {
      totalPages: 20,
      page: 7,
      totalResults: 100,
      pageSize: 2,
    },
    routes: [
      {
        id: 1,
        status: 'Inactive',
        takeOff: '03:00',
        capacity: 8,
        batch: 'E',
        inUse: 4,
        route: routeMock,
        cabDetails: cabDetailsMock,
        driver: driverMock,
        homebase: homebaseMock,
        riders: []
      },
      {
        id: 2,
        status: 'active',
        takeOff: '04:00',
        capacity: 8,
        batch: 'D',
        comments: 'Ipsum discdc molestiae.',
        inUse: 0,
        route: routeMock,
        cabDetails: cabDetailsMock,
        driver: driverMock,
        homebase: homebaseMock
      },
      {
        id: 3,
        status: 'active',
        takeOff: '05:00',
        capacity: 6,
        batch: 'A',
        comments: 'molestiae.',
        inUse: 1,
        route: routeMock,
        cabDetails: cabDetailsMock,
        driver: driverMock,
        homebase: homebaseMock
        },
        {
          id: 4,
          status: 'Inactive',
          takeOff: '03:60',
          capacity: 8,
          batch: 'E',
          comments: 'dvdv molestiae.',
          inUse: 0,
          route: routeMock,
          cabDetails: cabDetailsMock,
          driver: driverMock,
          homebase: homebaseMock
        },
        {
          id: 5,
          status: 'Inactive',
          takeOff: '04:00',
          capacity: 8,
          batch: 'P',
          comments: 'Ipdvdvdvsue.',
          inUse: 5,
          route: routeMock,
          cabDetails: cabDetailsMock,
          driver: driverMock,
          homebase: homebaseMock
        }
    ]
};

export default getRoutesResponseMock;
