const currencyQuery = ({ homebase, currency }) => `
  DO $$
  BEGIN
    UPDATE "Homebases" SET "currency" = '${currency}' WHERE name = '${homebase}';
  END $$`;

const homebases = [
  {
    homebase: 'Nairobi',
    currency: 'KES',
  },
  {
    homebase: 'Kampala',
    currency: 'UGX'
  },
  {
    homebase: 'Kigali',
    currency: 'RWF'
  },
  {
    homebase: 'Lagos',
    currency: 'NGN'
  },
  {
    homebase: 'Cairo',
    currency: 'EGP'
  }
];

module.exports = {
  up: async (queryInterface) => {
    const currencyQ = homebases.map((homebase) => queryInterface.sequelize.query(currencyQuery(homebase)));
    await Promise.all(currencyQ);
  },
  down: () => Promise.resolve()
};
