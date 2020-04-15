"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RolesHelper {
    static mapLocationsAndRoles(roles) {
        const locations = [];
        const RoleBasedAccessControl = {
            SuperAdmin: [],
            Admin: []
        };
        roles.map((roleObject) => {
            const locationObject = {};
            locationObject.id = roleObject.homebase.id;
            locationObject.name = roleObject.homebase.name;
            locationObject.role = roleObject.role.name;
            locations.push(locationObject);
            if (roleObject.role.name === 'Admin') {
                return RoleBasedAccessControl.Admin.push(roleObject.homebase.id);
            }
            return RoleBasedAccessControl.SuperAdmin.push(roleObject.homebase.id);
        });
        return { locations, RoleBasedAccessControl };
    }
}
exports.default = RolesHelper;
//# sourceMappingURL=RolesHelper.js.map