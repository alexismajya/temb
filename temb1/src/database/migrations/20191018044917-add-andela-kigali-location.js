let homebaseId;
const insertDefaultLocationsQuery = (
  { longitude, latitude, address }
) => `
DO $$
  DECLARE locationId integer;
  BEGIN
  INSERT INTO "Locations" (latitude, longitude, "createdAt", "updatedAt")
    SELECT '${latitude}', '${longitude}', NOW(), NOW()
      FROM  "Locations"
      WHERE NOT EXISTS (
        SELECT latitude,longitude
         FROM "Locations" 
         WHERE latitude ='${latitude}' AND longitude='${longitude}'
      )
    LIMIT 1;
  SELECT id INTO locationId
    FROM "Locations"
    WHERE latitude='${latitude}' AND longitude='${longitude}';
  INSERT INTO "Addresses" ("locationId", address,"homebaseId",  "createdAt", "updatedAt", "isDefault")
   VALUES ( locationId,'${address}','${homebaseId}', NOW(), NOW(), TRUE)
   ON CONFLICT(address) DO UPDATE SET "homebaseId" = '${homebaseId}';
  UPDATE "Homebases" SET "locationId" = locationId WHERE id=${homebaseId};
 END $$`;


const homebases = [

  {
    address: 'Andela Kigali',
    latitude: '-1.96291',
    longitude: '30.06443'
  },
];

module.exports = {
  up: async (queryInterface) => {
    const [[{ id }]] = await queryInterface.sequelize.query(
      'select id from "Homebases" where name=\'Kigali\''
    );
    homebaseId = id;

    const commonLocations = homebases.map(async (longitude, latitude, address) => {
      const sql = insertDefaultLocationsQuery(longitude, latitude, address);
      await queryInterface.sequelize.query(sql);
    });
    await Promise.all(commonLocations);
  },
  down: () => Promise.resolve()

};
