"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockedRoles = [
    {
        get: ({ plain }) => {
            if (plain) {
                return {
                    id: 1,
                    name: 'Super Admin',
                };
            }
        },
    },
    {
        get: ({ plain }) => {
            if (plain) {
                return {
                    id: 2,
                    name: 'test',
                };
            }
        },
    },
];
const mockdatas = [{ id: 1, name: 'Super Admin' }, { id: 2, name: 'test' }];
const mockRoleDetails = {
    get: ({ plain }) => {
        if (plain) {
            return {
                id: 1,
                name: 'Super Admin',
            };
        }
    },
};
const mockData = {
    mockedRoles,
    mockdatas,
    mockRoleDetails,
};
exports.default = mockData;
//# sourceMappingURL=mockData.js.map