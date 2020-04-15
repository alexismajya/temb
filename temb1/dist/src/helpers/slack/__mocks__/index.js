"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUserFromDb = { dataValues: { id: 45, slackId: 'U4500' } };
exports.slackUserMock = {
    real_name: 'dummyReal',
    profile: { email: 'dummyReal@local.host' },
    id: 'U4500'
};
exports.testTripFromDb = {
    dataValues: {
        tripStatus: 'Approved',
        approvedById: exports.testUserFromDb.dataValues.slackId
    },
    update: () => Promise.resolve(true)
};
exports.testDepartmentFromDb = {
    dataValues: {
        id: 1,
        name: 'SWAT',
        head: exports.testUserFromDb
    }
};
exports.createNewUserMock = {
    user: {
        real_name: 'dummyReal',
        profile: { email: 'dummyReal@local.host', real_name: 'dummyReal' },
        id: 'U4500'
    }
};
exports.newUser = {
    real_name: 'santos',
    profile: { email: 'tembea@tem.com' },
    id: 'U4500'
};
//# sourceMappingURL=index.js.map