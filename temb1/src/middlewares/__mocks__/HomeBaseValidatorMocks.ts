const mockedFoundOpsEmail = {
  get: ({ plain }: { plain: boolean }) => {
    if (plain) {
      return {
        id: 1,
        name: 'Lagos',
        channel: '3',
        opsEmail: 'tembea@andela.com',
        travelEmail: 'tembea@andela.com',
        countryId: 1,
        addressId: 3,
        locationId: 2,
        currency: 'NGN',
        createdAt: '2020-02-10T09:15:39.117Z',
        updatedAt: '2020-02-10T09:15:39.117Z',
        deletedAt: '2020-02-10T09:15:39.117Z',
      };
    }
  },
};
export default mockedFoundOpsEmail;
