const providers = {
  providers:
        [{
          id: 1,
          name: 'Uber Kenya',
          providerUserId: 1,
          deletedAt: null,
          user: {
            id: 1,
            name: 'John smith',
            slackId: '345qq',
            phoneNo: null,
            email: 'john.smith@gmail.com',
            defaultDestinationId: null,
            routeBatchId: null,
            createdAt: '2018-11-14T00:00:00.000Z',
            updatedAt: '2018-11-14T00:00:00.000Z'
          }
        }],
  totalPages: 1,
  pageNo: 1,
  totalItems: 1,
  itemsPerPage: 3
};
const successMessage = '1 of 1 page(s).';
const paginatedData = {
  pageMeta: {
    page: '1',
    pageSize: 3
  },
  providers:
        [{
          id: 1,
          name: 'Uber Kenya',
          providerUserId: 1,
          deletedAt: null,
          user: {
            id: 1,
            name: 'John smith',
            slackId: '345qq',
            phoneNo: null,
            email: 'john.smith@gmail.com',
            defaultDestinationId: null,
            routeBatchId: null,
            createdAt: '2018-11-14T00:00:00.000Z',
            updatedAt: '2018-11-14T00:00:00.000Z'
          }
        }]
};

const returnedData = {
  pageMeta: {
    page: '1',
    pageSize: 3
  },
  providers: [
    {
      id: 1,
      name: 'Uber Kenya',
      providerUserId: 1,
      deletedAt: null,
      user: {
        id: 1,
        name: 'John smith',
        slackId: '345qq',
        phoneNo: null,
        email: 'john.smith@gmail.com',
        defaultDestinationId: null,
        routeBatchId: null,
        createdAt: '2018-11-14T00:00:00.000Z',
        updatedAt: '2018-11-14T00:00:00.000Z'
      }
    }
  ]
};

const viableProviders = [
  {
    id: 1,
    name: 'Uber Kenya',
    providerUserId: 1,
    deletedAt: null,
    user: {
      id: 1,
      name: 'John smith',
      slackId: '345qq',
      phoneNo: null,
      email: 'john.smith@gmail.com',
      defaultDestinationId: null,
      routeBatchId: null,
      createdAt: '2018-11-14T00:00:00.000Z',
      updatedAt: '2018-11-14T00:00:00.000Z'
    }
  }
];
const mockGetCabsData = {
  pageMeta: {
    totalPages: 1,
    page: 1,
    totalResults: 3,
    pageSize: 100
  },
  data: [
    {
      id: 1,
      name: 'Uber Kenya',
      providerUserId: 1,
      user: {
        name: 'John smith',
        phoneNo: null,
        email: 'john.smith@gmail.com'
      }
    },
    {
      id: 2,
      name: 'Taxify Kenya',
      providerUserId: 2,
      user: {
        name: 'Derrick jones',
        phoneNo: null,
        email: 'derrick.jones@gmail.com'
      }
    },
    {
      id: 3,
      name: 'Endesha Kenya',
      providerUserId: 3,
      user: {
        name: 'Abishai Omari',
        phoneNo: null,
        email: 'abishai.omari@andela.com'
      }
    }
  ]
};
const mockProviderRecordByProviderId = {
  get: ({ plain }) => (plain ? {
    id: 1,
    name: 'Uber Kenya',
    providerUserId: 1,
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z',
    notificationChannel: '0',
    deletedAt: null
  } : null)
};
const mockProviderRecord = {
  id: 1,
  name: 'Uber Kenya',
  providerUserId: 1,
  createdAt: '2019-04-01T12:07:13.002Z',
  updatedAt: '2019-04-01T12:07:13.002Z',
  notificationChannel: '0',
  deletedAt: null
};
const mockProviderRecordById = {
  id: 1,
  name: 'Uber Kenya',
  providerUserId: 1,
  createdAt: '2019-04-01T12:07:13.002Z',
  updatedAt: '2019-04-01T12:07:13.002Z',
  notificationChannel: '0',
  deletedAt: null
};
const mockProvidersRecords = [
  {
    id: 1,
    name: 'Uber Kenya',
    providerUserId: 1,
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z',
    notificationChannel: '0',
    deletedAt: null
  },
  {
    id: 2,
    name: 'Uber Kigali',
    providerUserId: 2,
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z',
    notificationChannel: '1',
    deletedAt: null
  },
  {
    id: 3,
    name: 'Uber Kenya',
    providerUserId: 3,
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z',
    notificationChannel: '0',
    deletedAt: null
  },
  {
    id: 4,
    name: 'Uber Kigali',
    providerUserId: 4,
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z',
    notificationChannel: '1',
    deletedAt: null
  }
];
const mockCreatedProvider = [
  {
    dataValues: mockProviderRecord,
    get: () => mockProviderRecord
  },
  true
];
const mockCabsData = {
  cabs: [
    {
      regNumber: 'SMK 319 JK',
      capacity: 4,
      model: 'subaru',
      providerId: 1,
      location: 'Lagos',
    },
    {
      regNumber: 'LND 419 CN',
      capacity: 4,
      model: 'toyota',
      providerId: 1,
      location: 'Wakanda'
    }
  ],
  cabsFiltered: [
    {
      get: () => ({
        regNumber: 'SMK 319 JK',
        capacity: 4,
        model: 'subaru',
        providerId: 1,
        location: 'Lagos'
      })
    },
    {
      get: () => ({
        regNumber: 'SMK 319 JK',
        capacity: 4,
        model: 'subaru',
        providerId: 1,
        location: 'Lagos'
      })
    }
  ],
  mockCabUpdateData: {
    driverName: 'Muhwezi Deo'
  }
};
const mockDriver = {
  id: 1,
  driverPhoneNo: '07345345435',
  driverName: 'Jarvis',
  email: 'jarvis@mail',
  createdAt: '2019-01-01 03:00:00+03',
  updatedAt: '2019-01-01 03:00:00+03',
  deletedAt: null
};
const mockDriversData = [mockDriver, mockDriver, mockDriver];
const newProviders = {
  pageMeta: {
    totalPages: 1,
    page: 1,
    totalResults: 1,
    pageSize: 3,
    pageNo: 1,
  },
  providers: [
    {
      id: 1,
      name: 'Uber Kenya',
      channelId: null,
      email: 'john.smith@gmail.com',
      phoneNo: null,
      notificationChannel: '2',
      providerUserId: 1,
      homebaseId: 2,
      verified: false,
      routeBatchId: null,
      slackId: '345qq',
      createdAt: '2018-11-14T00:00:00.000Z',
      updatedAt: '2018-11-14T00:00:00.000Z',
      defaultDestinationId: null,
      deletedAt: null,
      user: null,
      homebase: {
        id: 2,
        name: 'Nairobi',
        country: {
          name: 'John smith',
          id: 1,
          status: 'Active'
        }
      }
    }
  ]
};
const newPaginatedData = {
  pageMeta: {
    totalPages: 1,
    page: 1,
    totalResults: 1,
    pageSize: 3,
    pageNo: 1,
  },
  providers: [
    {
      id: 1,
      name: 'Uber Kenya',
      channelId: null,
      email: 'john.smith@gmail.com',
      phoneNo: null,
      notificationChannel: '2',
      providerUserId: 1,
      homebaseId: 2,
      verified: false,
      routeBatchId: null,
      slackId: '345qq',
      createdAt: '2018-11-14T00:00:00.000Z',
      updatedAt: '2018-11-14T00:00:00.000Z',
      defaultDestinationId: null,
      deletedAt: null,
      user: null,
      homebase: {
        id: 2,
        name: 'Nairobi',
        country: {
          name: 'John smith',
          id: 1,
          status: 'Active'
        }
      }
    }
  ]
};
export {
  providers,
  paginatedData,
  successMessage,
  returnedData,
  viableProviders,
  mockGetCabsData,
  mockCreatedProvider,
  mockProviderRecord,
  mockCabsData,
  mockDriversData,
  mockProvidersRecords,
  mockProviderRecordByProviderId,
  mockProviderRecordById,
  newProviders,
  newPaginatedData
};
