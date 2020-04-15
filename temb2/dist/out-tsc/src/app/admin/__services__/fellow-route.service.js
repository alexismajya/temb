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
import { FellowRoutesModel } from 'src/app/shared/models/fellow-routes.model';
import 'rxjs/add/operator/map';
var FellowRouteService = /** @class */ (function () {
    function FellowRouteService(http) {
        this.http = http;
        this.fellowRoutesUrl = environment.tembeaBackEndUrl + "/api/v1/fellowActivity";
        this.httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
    }
    FellowRouteService.prototype.getFellowRoutes = function (fellowId, pageSize, pageNo, sort) {
        return this.http.get(this.fellowRoutesUrl + "?id=" + fellowId + "&size=" + pageSize + "&sort=" + sort + "&page=" + pageNo)
            .map(function (fellowRoutes) {
            var fellowRoutesModel = new FellowRoutesModel().deserialize(fellowRoutes);
            return fellowRoutesModel;
        });
    };
    FellowRouteService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], FellowRouteService);
    return FellowRouteService;
}());
export { FellowRouteService };
//# sourceMappingURL=fellow-route.service.js.map