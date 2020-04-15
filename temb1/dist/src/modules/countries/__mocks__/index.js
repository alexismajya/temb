"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockCountryCreationResponse = {
    countries: [
        {
            get: () => ({
                id: 1,
                name: 'Kenya',
                status: 'Active',
                createdAt: '2019-04-01T12:07:13.002Z',
                updatedAt: '2019-04-01T12:07:13.002Z'
            }),
            id: 1,
        },
    ]
};
exports.mockReturnedCountryData = {
    _options: {
        isNewRecord: true
    },
    dataValues: {
        id: 1,
        name: 'Kenya',
        status: 'Active',
        createdAt: '2019-04-01T12:07:13.002Z',
        updatedAt: '2019-04-01T12:07:13.002Z'
    },
    get: () => ({
        id: 1,
        name: 'Kenya',
        status: 'Active',
        createdAt: '2019-04-01T12:07:13.002Z',
        updatedAt: '2019-04-01T12:07:13.002Z'
    })
};
exports.response = {
    status: jest
        .fn(() => ({
        json: jest.fn(() => { })
    }))
        .mockReturnValue({ json: jest.fn() })
};
exports.mockUpdatedData = {
    id: 1,
    name: 'Uganda',
    status: 'Active',
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z'
};
exports.mockCountryDetails = {
    id: 1,
    name: 'Uganda',
    status: 'Active',
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z',
    count: 1,
    rows: 1
};
exports.mockCountryZeroRow = {
    id: 1,
    name: 'Uganda',
    status: 'Active',
    createdAt: '2019-04-01T12:07:13.002Z',
    updatedAt: '2019-04-01T12:07:13.002Z',
    count: 1,
    rows: 0
};
exports.mockNewCountry = {
    country: [
        {
            id: 1,
            name: 'Kenya',
            status: 'Active',
            createdAt: '2019-04-01T12:07:13.002Z',
            updatedAt: '2019-04-01T12:07:13.002Z'
        }
    ],
    isNewCountry: true
};
exports.mockExistingCountry = {
    country: [
        {
            id: 1,
            name: 'Kenya',
            status: 'Active',
            createdAt: '2019-04-01T12:07:13.002Z',
            updatedAt: '2019-04-01T12:07:13.002Z'
        }
    ],
    isNewCountry: false
};
exports.mockCreateCountry = {
    name: 'Create Country'
};
exports.mockDeleteCountry = {
    name: 'Ghana'
};
exports.mockUpdateCountry = {
    name: 'Create Country',
    newName: 'Ghana'
};
//# sourceMappingURL=index.js.map