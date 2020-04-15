const kampalaDefaultLocations = [
  {
    longitude: 32.626282,
    latitude: 0.379828,
    address: 'Najjera',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 32.443930,
    latitude: 0.045382,
    address: 'Entebbe Airport',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 32.592348,
    latitude: 0.299964,
    address: 'US Embassy Kampala',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'

  },
  {
    longitude: 32.5893855,
    latitude: 0.3427609,
    address: 'Andela Kampala',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 32.5944254,
    latitude: 0.3636539,
    address: 'Kisasi',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 32.611807,
    latitude: 0.3166228,
    address: 'Fusion Arena',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 32.5727795,
    latitude: 0.3189207,
    address: 'Watoto Church',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 32.5888808,
    latitude: 0.320358,
    address: 'Garden City',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 32.5826399,
    latitude: 0.3251655,
    address: 'Golden Tulip',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  }
];

module.exports = {
  up: async (queryInterface) => {
    const updates = kampalaDefaultLocations.map(({ address }) => queryInterface.sequelize.query(`
      UPDATE "Addresses" SET "isDefault" = TRUE WHERE "address" LIKE '%${address}%'
    `));

    await Promise.all(updates);
  },

  down: () => Promise.resolve()
};
