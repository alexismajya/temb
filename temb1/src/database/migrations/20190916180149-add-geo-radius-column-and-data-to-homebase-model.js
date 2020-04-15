const location = [
  {
    name: 'Nairobi',
    latitude: '-1.219539',
    longitude: '36.886215'
  },
  {
    name: 'Kampala',
    latitude: '-0.320358',
    longitude: '32.5888808'
  }
];

const locationQuery = ({ name, latitude, longitude }) => `
DO $$
  DECLARE homebaseId integer;
  DECLARE locationId integer;
  BEGIN
  SELECT id INTO homeBaseId FROM "Homebases" WHERE name='${name}';
  INSERT INTO "Locations" ("latitude", "longitude", "createdAt", "updatedAt")
  VALUES( '${latitude}', '${longitude}', NOW(), NOW()) RETURNING id INTO locationId;
  UPDATE "Homebases" SET "locationId"=locationId WHERE id = homeBaseId;
  END $$`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Homebases', 'locationId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Locations',
        key: 'id',
        as: 'location'
      },
    });
    const locationQueries = location.map(async (name, latitude, longitude) => {
      const sql = locationQuery(name, latitude, longitude);
      await queryInterface.sequelize.query(sql);
    });
    await Promise.all(locationQueries);
  },
  down: (queryInterface) => queryInterface.removeColumn('Homebases', 'locationId')
};
