module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize
      .query('ALTER TABLE "Homebases" DROP CONSTRAINT "Homebases_travelEmail_key"'),
    queryInterface.sequelize
      .query('ALTER TABLE "Homebases" DROP CONSTRAINT "Homebases_opsEmail_key"'),
    queryInterface.bulkUpdate('Homebases',
      { opsEmail: 'tembea@andela.com' },
      {
        opsEmail: null
      }),
    queryInterface.changeColumn('Homebases', 'opsEmail', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  ]),


  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('Homebases', 'opsEmail', {
      type: Sequelize.STRING,
      defaultValue: false
    }),
    queryInterface.bulkUpdate('Homebases',
      { opsEmail: null },
      {
        opsEmail: 'tembea@andela.com'
      }),
    queryInterface.addConstraint('Homebases', ['travelEmail'], {
      type: 'unique',
      name: 'Homebases_travelEmail_key'
    }),
    queryInterface.addConstraint('Homebases', ['opsEmail'], {
      type: 'unique',
      name: 'Homebases_opsEmail_key'
    }),
  ])
};
