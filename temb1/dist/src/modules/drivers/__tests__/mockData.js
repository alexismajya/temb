"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockData = {
    _options: { isNewRecord: true },
    dataValues: {
        driverName: 'Muhwezi Deo2',
        driverPhoneNo: '0705331111',
        driverNumber: 'UB5422424344',
        providerId: 1
    }
};
exports.createReq = {
    body: {
        driverName: 'Muhwezi Deo2',
        driverNumber: 'UB5422424344',
        driverPhoneNo: '0705331111',
        providerId: 1
    }
};
exports.expected = {
    driverName: 'Muhwezi Deo2',
    driverNumber: 'UB5422424344',
    driverPhoneNo: '0705331111',
    providerId: 1
};
exports.existingUserMock = {
    _options: { isNewRecord: false },
    dataValues: {}
};
exports.drivers = {
    driverName: 'Muhwezi Deo2',
    driverNumber: 'UB5422424344',
    driverPhoneNo: '0705331111',
    providerId: 1
};
//# sourceMappingURL=mockData.js.map