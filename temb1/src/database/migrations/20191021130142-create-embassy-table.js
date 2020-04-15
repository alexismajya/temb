module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Embassies', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    addressId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Addresses',
        key: 'id',
      }
    },
    countryId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Countries',
        key: 'id',
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE,
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('Embassies'),
};
