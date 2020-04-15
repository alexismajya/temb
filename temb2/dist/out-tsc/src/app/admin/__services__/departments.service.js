var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DepartmentsModel } from 'src/app/shared/models/departments.model';
import 'rxjs/add/operator/map';
var DepartmentsService = /** @class */ (function () {
    function DepartmentsService(http) {
        this.http = http;
        this.teamUrl = environment.teamUrl;
        this.departmentsUrl = environment.tembeaBackEndUrl + "/api/v1/departments";
    }
    DepartmentsService.prototype.get = function (size, page) {
        return this.http.get(this.departmentsUrl + "?size=" + size + "&page=" + page).map(function (departments) {
            return new DepartmentsModel().deserialize(departments);
        });
    };
    DepartmentsService.prototype.add = function (data) {
        var homebaseId = localStorage.getItem('HOMEBASE_ID');
        return this.http.post(this.departmentsUrl, __assign({}, data, { slackUrl: this.teamUrl, homebaseId: homebaseId }));
    };
    DepartmentsService.prototype.delete = function (id) {
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: { id: id, }
        };
        return this.http.delete(environment.tembeaBackEndUrl + "/api/v1/departments", httpOptions);
    };
    DepartmentsService.prototype.update = function (id, name, email) {
        var content = {
            name: name,
            headEmail: email
        };
        return this.http.put(environment.tembeaBackEndUrl + "/api/v1/departments/" + id, content);
    };
    DepartmentsService = __decorate([
        Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], DepartmentsService);
    return DepartmentsService;
}());
export { DepartmentsService };
//# sourceMappingURL=departments.service.js.map