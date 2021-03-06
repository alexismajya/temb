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
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
var LocationService = /** @class */ (function () {
    function LocationService(http, cookie) {
        this.http = http;
        this.cookie = cookie;
        this.baseUrl = environment.tembeaBackEndUrl + "/api/v1/locations";
    }
    LocationService.prototype.getById = function (id) {
        var token = this.cookie.get('tembea_token');
        var httpOptions = {
            headers: new HttpHeaders({ 'Authorization': token }),
        };
        return this.http.get(this.baseUrl + "/" + id, httpOptions);
    };
    LocationService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, CookieService])
    ], LocationService);
    return LocationService;
}());
export { LocationService };
//# sourceMappingURL=locations.service.js.map