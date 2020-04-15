"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const countryMock = {
    id: 1,
    name: 'Kenya',
    status: 'Active',
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z'
};
exports.countryMock = countryMock;
const deletedCountryMock = {
    id: 1,
    name: 'Kenya',
    status: 'Inactive',
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z'
};
exports.deletedCountryMock = deletedCountryMock;
const mockError = {
    error: {
        status: 404,
        message: 'Country was not found'
    },
};
exports.mockError = mockError;
const mockAPIFail = {
    name: 'RequestError',
    error: 'Could not find this address'
};
exports.mockAPIFail = mockAPIFail;
//# sourceMappingURL=countryHelperMock.js.map