module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Cabs', 'color', {
    type: Sequelize.STRING,
    allowNull: true,
  }),

  down: (queryInterface) => queryInterface.removeColumn('Cabs', 'color')
};
