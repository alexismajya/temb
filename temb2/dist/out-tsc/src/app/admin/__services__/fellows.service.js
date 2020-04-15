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
import { environment } from 'src/environments/environment';
import { FellowsModel } from 'src/app/shared/models/fellows.model';
var FellowsService = /** @class */ (function () {
    function FellowsService(http) {
        this.http = http;
        this.httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: { teamUrl: environment.teamUrl }
        };
        this.fellowsUrl = environment.tembeaBackEndUrl + "/api/v1/fellows";
    }
    FellowsService.prototype.getFellows = function (onRoute, size, page) {
        if (size === void 0) { size = 9; }
        if (page === void 0) { page = 1; }
        var queryParams = onRoute ? "size=" + size + "&page=" + page : "onRoute=" + false + "&size=" + size + "&page=" + page;
        return this.http
            .get(this.fellowsUrl + "?" + queryParams)
            .map(function (fellows) {
            return new FellowsModel().deserialize(fellows);
        });
    };
    FellowsService.prototype.removeFellowFromRoute = function (fellowId) {
        var url = environment.tembeaBackEndUrl + "/api/v1/routes/fellows/" + fellowId + "/";
        return this.http.delete(url, this.httpOptions);
    };
    FellowsService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], FellowsService);
    return FellowsService;
}());
export { FellowsService };
//# sourceMappingURL=fellows.service.js.map