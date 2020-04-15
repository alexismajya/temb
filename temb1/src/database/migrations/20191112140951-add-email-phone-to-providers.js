module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Providers',
      'email',
      {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      }
    ),
    queryInterface.addColumn(
      'Providers',
      'phoneNo',
      {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      }
    ),
    queryInterface.addColumn(
      'Providers',
      'notificationChannel',
      {
        type: Sequelize.ENUM('0', '1', '2', '3'),
        allowNull: false,
        defaultValue: '0',
      }
    ),
    queryInterface.addColumn(
      'Providers',
      'verified',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    ),
    queryInterface.changeColumn(
      'Providers',
      'providerUserId', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    ),
    queryInterface.removeColumn('Providers', 'isDirectMessage'),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Providers', 'email'),
    queryInterface.removeColumn('Providers', 'phoneNo'),
    queryInterface.removeColumn('Providers', 'verified'),
    queryInterface.removeColumn('Providers', 'notificationChannel'),
    queryInterface.changeColumn('Providers', 'providerUserId', {
      type: Sequelize.INTEGER,
      allowNull: false
    }),
    queryInterface.addColumn('Providers', 'isDirectMessage', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }),
    queryInterface.sequelize.query('DROP TYPE "enum_Providers_notificationChannel"'),
  ])
};
