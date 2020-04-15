const location = [
  {
    name: 'Nairobi',
    address: 'Andela Nairobi'
  },
  {
    name: 'Kampala',
    address: 'Andela Kampala'
  },
  {
    name: 'Kigali',
    address: 'Kigali Town'
  }
];

const locationQuery = ({ name, address }) => `
DO $$
  DECLARE homebaseId integer;
  DECLARE addressId integer;
  BEGIN
  SELECT id INTO homeBaseId FROM "Homebases" WHERE name='${name}';
  SELECT id INTO addressId FROM "Addresses" WHERE address = '${address}';
  UPDATE "Homebases" SET "addressId" = addressId WHERE id = homebaseId;
  END $$`;

module.exports = {
  up: async (queryInterface) => {
    const locationQueries = location.map(async (name, address) => {
      const sql = locationQuery(name, address);
      await queryInterface.sequelize.query(sql);
    });
    await Promise.all(locationQueries);
  },
  down: () => Promise.resolve()

};
