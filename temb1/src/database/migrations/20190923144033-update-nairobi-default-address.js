const nairobiDefaultLocations = [
  {
    longitude: 36.886215,
    latitude: -1.219539,
    address: 'Andela Nairobi',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 36.886215,
    latitude: -1.219539,
    address: 'Epic Tower'
  },
  {
    longitude: 36.7848955,
    latitude: -1.2519367,
    address: 'VFS Centre',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'

  },
  {
    longitude: 36.8104947,
    latitude: -1.2343935,
    address: 'US Embassy',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 36.9260693,
    latitude: -1.3227102,
    address: 'Jomo Kenyatta Airport',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 36.8511383,
    latitude: -1.239622,
    address: 'Nairobi Guest House',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 36.879841,
    latitude: -1.219918,
    address: 'Morningside Apartments USIU road',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 36.883281,
    latitude: -1.226404,
    address: 'Safari Park Hotel',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  },
  {
    longitude: 36.838365,
    latitude: -1.214048,
    address: 'Lymack Suites',
    createdAt: '2019-04-09',
    updatedAt: '2019-05-08 10:00:00.326000'
  }
];

module.exports = {
  up: async (queryInterface) => {
    const updates = nairobiDefaultLocations.map(({ address }) => queryInterface.sequelize.query(`
      UPDATE "Addresses" SET "isDefault" = TRUE WHERE "address" LIKE '%${address}%'
    `));

    await Promise.all(updates);
  },

  down: () => Promise.resolve()
};
