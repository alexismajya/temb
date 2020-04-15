module.exports = {
  up: (queryInterface) => queryInterface.sequelize.transaction((t) => Promise.all([
    queryInterface.removeColumn('TeamDetails', 'webhookConfigUrl', { transaction: t }),
    queryInterface.removeColumn('TeamDetails', 'userId', { transaction: t }),
    queryInterface.removeColumn('TeamDetails', 'userToken', { transaction: t }),
    queryInterface.removeColumn('TeamDetails', 'opsChannelId', { transaction: t })
  ])),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((t) => Promise.all([
    queryInterface.addColumn('TeamDetails', 'webhookConfigUrl', {
      unique: true,
      type: Sequelize.STRING,
      allowNull: true,
    }, { transaction: t }),
    queryInterface.addColumn('TeamDetails', 'userId', {
      unique: true,
      type: Sequelize.STRING,
      allowNull: true,
    }, { transaction: t }),
    queryInterface.addColumn('TeamDetails', 'userToken', {
      unique: true,
      type: Sequelize.STRING,
      allowNull: true,
    }, { transaction: t }),
    queryInterface.addColumn('TeamDetails', 'opsChannelId', {
      allowNull: true,
      type: Sequelize.STRING,
      defaultValue: 'opsChannelId'
    }, { transaction: t })
  ]))
};
