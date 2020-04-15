module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Homebases', 'opsEmail', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    }),
    queryInterface.addColumn('Homebases', 'travelEmail', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    }),
  ]),
  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('Homebases', 'opsEmail'),
    queryInterface.removeColumn('Homebases', 'travelEmail')
  ])
};
