"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RolesHelper_1 = __importDefault(require("../RolesHelper"));
describe('RoleHelper', () => {
    it('should return roles and locations object', () => {
        const roles = [{ homebase: { id: 1, name: 'Kampala' }, role: { name: 'Admin' } },
            { homebase: { id: 2, name: 'Kampala' }, role: { name: 'Super Admin' } }];
        const result = RolesHelper_1.default.mapLocationsAndRoles(roles);
        expect(result).toEqual({
            locations: [{ id: 1, name: 'Kampala', role: 'Admin' },
                { id: 2, name: 'Kampala', role: 'Super Admin' }],
            RoleBasedAccessControl: { SuperAdmin: [2], Admin: [1] }
        });
    });
});
//# sourceMappingURL=RoleHelper.spec.js.map