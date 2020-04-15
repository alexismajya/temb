const replaceEnum = require('sequelize-replace-enum-postgres').default;

module.exports = {
  up: (queryInterface) => replaceEnum({
    queryInterface,
    tableName: 'TripRequests',
    columnName: 'tripStatus',
    defaultValue: 'Pending',
    newValues: ['Pending',
      'Approved',
      'DeclinedByManager',
      'DeclinedByOps',
      'Confirmed',
      'InTransit',
      'Cancelled',
      'Completed',
      'PendingConfirmation'],
    enumName: 'enum_TripRequests_tripStatus'
  }),

  down: (queryInterface) => replaceEnum({
    queryInterface,
    tableName: 'TripRequests',
    columnName: 'tripStatus',
    defaultValue: 'Pending',
    newValues: ['Pending',
      'Approved',
      'DeclinedByManager',
      'DeclinedByOps',
      'Confirmed',
      'InTransit',
      'Cancelled',
      'Completed'],
    enumName: 'enum_TripRequests_tripStatus'
  })
};
