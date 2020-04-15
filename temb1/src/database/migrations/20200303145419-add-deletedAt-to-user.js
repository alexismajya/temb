module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Users',
      'deletedAt',
      Sequelize.DATE
    )
  ]),
  
  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('Users', 'deletedAt')
  ])
};
