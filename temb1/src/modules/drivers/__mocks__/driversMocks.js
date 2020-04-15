const payload = {
  driverName: 'Muhwezi Deo2',
  driverNumber: 'UB5422424344',
  driverPhoneNo: '0705331111',
  providerId: 1
};

const drivers = {
  data: [
    {
      get: () => ({
        id: 1,
        driverName: 'James Savali',
        driverPhoneNo: '708989098',
        driverNumber: '254234',
        providerId: 1,
        email: 'savali@gmail.com'
      })
    },
    {
      get: () => ({
        id: 2,
        driverName: 'Muhwezi Deo',
        driverPhoneNo: '908989098',
        driverNumber: '254235',
        providerId: 2,
        email: 'deo@gmail.com'
      })
    },
  ],
  pageMeta: {
    totalPages: 16, pageNo: 2, totalItems: 160, itemsPerPage: 10
  }

};

const findAllMock = [
  {
    get: ({ plain }) => {
      if (plain) {
        return {
          id: 1,
          driverName: 'James Savali',
          driverPhoneNo: '708989098',
          driverNumber: '254234',
          providerId: 1,
          email: 'savali@gmail.com'
        };
      }
    }
  },
  {
    get: ({ plain }) => {
      if (plain) {
        return {
          id: 2,
          driverName: 'Muhwezi Deo',
          driverPhoneNo: '908989098',
          driverNumber: '254235',
          providerId: 2,
          email: 'deo@gmail.com'
        };
      }
    }
  },
];

const paginatedData = {
  pageMeta: {
    totalPages: 1,
    page: 1,
    totalResults: 26,
    pageSize: 100
  },
  drivers
};

const overloadPayload = {
  driverName: 'Muhwezi Deo2',
  driverNumber: 'UB5422424344',
  model: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    + 'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,'
    + 'when an unknown printer took a galley of type and scrambled it to make a type'
    + 'specimen book. It has survived not',
};

const returnedData = {
  data: [
    {
      id: 1,
      driverName: 'James Savali',
      driverNumber: '254234',
      driverPhoneNo: '708989098',
      email: 'savali@gmail.com',
      providerId: 1,
    },
    {
      driverName: 'Muhwezi Deo',
      driverNumber: '254235',
      driverPhoneNo: '908989098',
      email: 'deo@gmail.com',
      id: 2,
      providerId: 2,
    },
  ],
  pageMeta: {
    totalPages: 1, pageNo: 1, totalItems: 1, itemsPerPage: 3
  }
};


const successMessage = '1 of 1 page(s).';
const payloadData = {
  payload,
  overloadPayload,
  drivers,
  paginatedData,
  successMessage,
  returnedData,
  findAllMock
};

export default payloadData;
