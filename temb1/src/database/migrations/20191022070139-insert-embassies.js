/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-escape */
import { forEachOf, each } from 'async';
import embassiesByCountry from '../../utils/embassies.json';

module.exports = {
  up: (queryInterface) => new Promise((resolve, reject) => {
    let embassiesStore = [];
    forEachOf(embassiesByCountry, async (embassies, countryName, callback) => {
      const [[{ id }]] = await queryInterface.sequelize.query(
        `select id from "Countries" where name=\'${countryName}\'`
      );
      embassies.map((embassy) => {
        embassy.countryId = id;
        return embassy;
      });
      embassiesStore = [...embassiesStore, ...embassies];
      callback();
    }, () => {
      each(embassiesStore, async (embassy, callback) => {
        const [[{ id: locationId }], temp] = await queryInterface.sequelize.query(
          `INSERT INTO "Locations" (longitude,latitude, "createdAt", "updatedAt")
               VALUES ('${embassy.coordinates.longitude}',
               '${embassy.coordinates.latitude}', NOW(), NOW())
               returning *`
        );
      
        const [[{ id: addressId }], temp_] = await queryInterface.sequelize.query(
          `INSERT INTO "Addresses" ("locationId",address,"createdAt", "updatedAt")
               VALUES ('${locationId}',
               '${embassy.address}', NOW(), NOW())
               returning *`
        );
      
        await queryInterface.sequelize.query(
          `INSERT INTO "Embassies" (name,"addressId","countryId","createdAt", "updatedAt")
               VALUES ('${embassy.name}','${addressId}',
               '${embassy.countryId}', NOW(), NOW())
               returning *`
        );
        callback();
      }, () => {
        resolve({});
      });
    });
  }),
  down: () => Promise.resolve()
};
