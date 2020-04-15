module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Homebases', 'currency', {
    type: Sequelize.STRING,
    allowNull: true,
  }),

  down: (queryInterface) => queryInterface.removeColumn('Homebases', 'currency')
};
