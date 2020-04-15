const location = [
  {
    name: 'Kigali',
    latitude: '-1.9438041',
    longitude: '30.0573785'
  }
];
  
const locationQuery = ({ name, latitude, longitude }) => `
  DO $$
    DECLARE homebaseId integer;
    DECLARE locationId integer;
    BEGIN
    SELECT id INTO homebaseId FROM "Homebases" WHERE name='${name}';
    SELECT id INTO locationId FROM "Locations" WHERE latitude ='${latitude}' AND longitude='${longitude}';
    UPDATE "Homebases" SET "locationId"=locationId WHERE id = homebaseId;
    END $$`;
  
module.exports = {
  up: async (queryInterface) => {
    const locationQueries = location.map(async (name, latitude, longitude) => {
      const sql = locationQuery(name, latitude, longitude);
      await queryInterface.sequelize.query(sql);
    });
    await Promise.all(locationQueries);
  },
  down: () => Promise.resolve()
  
};
