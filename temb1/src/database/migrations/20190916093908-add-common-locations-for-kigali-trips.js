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
 END $$`;


const homebases = [

  {
    address: 'Kigali Town',
    latitude: '-1.9438041',
    longitude: '30.0573785'
  },
  {
    address: 'Nyarutarama',
    latitude: '-1.9399016',
    longitude: '30.0912846'
  },
  {
    address: 'Remera - Giporoso',
    latitude: '-1.9617383',
    longitude: '30.118053'
  },
  {
    address: 'Remera - Kisementi',
    latitude: '-1.9596079',
    longitude: '30.1077379'
  },
  {
    address: 'Kimironko Market',
    latitude: '-1.9499194',
    longitude: '30.1240101'
  },
  {
    address: 'Kimironko Mushimire',
    latitude: '-1.9378325',
    longitude: '30.1300016'
  },
  {
    address: 'Gikondo Nyenyeri/SGEM',
    latitude: '-1.9702954',
    longitude: '30.0744106'
  },
  {
    address: 'Gikondo Rebero',
    latitude: '-1.9971846',
    longitude: '30.0758746'
  },
  {
    address: 'Kicukiro Center',
    latitude: '-1.9682097',
    longitude: '30.0497678'
  },
  {
    address: 'Kicukiro Nyanza',
    latitude: '-1.9926543',
    longitude: '30.0842685'
  },
  {
    address: 'Kicukiro Nyanza',
    latitude: '-1.9926543',
    longitude: '30.0842685'
  },
  {
    address: 'Kimihurura',
    latitude: '-1.9539082',
    longitude: '30.0783684'
  },
  {
    address: 'Kacyiru',
    latitude: '-1.9539082',
    longitude: '30.0696712'
  },
  {
    address: 'Gacuriro',
    latitude: '-1.9204667',
    longitude: '30.0802016'
  },
  {
    address: 'Kibagabaga',
    latitude: '-1.9335588',
    longitude: '30.1120716'
  },
  {
    address: 'Kanombe',
    latitude: '-1.9976589',
    longitude: '30.1083749'
  },

  {
    address: 'Kigali International Airport',
    latitude: '-1.9630737',
    longitude: '30.1328098'
  },
  {
    address: 'Kigali International Airport',
    latitude: '-1.9630737',
    longitude: '30.1328098'
  },
  {
    address: 'Kabeza',
    latitude: '-1.9706755',
    longitude: '30.1150114'
  },
  {
    address: 'Nyabugogo',
    latitude: '-1.9378936',
    longitude: '30.0460034'
  },
  {
    address: 'Nyamirambo',
    latitude: '-1.9942641',
    longitude: '30.028989'
  },
  {
    address: 'Kinamba',
    latitude: '-1.9339158',
    longitude: '30.0624876'
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Addresses', 'isDefault', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

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
  down: (queryInterface) => queryInterface.removeColumn('Addresses', 'isDefault')

};
