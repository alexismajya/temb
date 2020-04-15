var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
var RoleService = /** @class */ (function () {
    function RoleService(http) {
        this.http = http;
        this.rolesUrl = environment.tembeaBackEndUrl + "/api/v1/roles";
        this.usersUrl = environment.tembeaBackEndUrl + "/api/v1/users";
    }
    RoleService.prototype.getRoles = function () {
        return this.http.get(this.rolesUrl);
    };
    RoleService.prototype.assignRoleToUser = function (data) {
        return this.http.post(this.rolesUrl + "/user", data);
    };
    RoleService.prototype.deleteUserRole = function (id) {
        return this.http.delete(this.rolesUrl + "/user/" + id);
    };
    RoleService.prototype.getUsers = function (name) {
        if (name) {
            return this.http.get(this.usersUrl + "?name=" + name);
        }
        return this.http.get(this.usersUrl);
    };
    RoleService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], RoleService);
    return RoleService;
}());
export { RoleService };
//# sourceMappingURL=roles.service.js.map