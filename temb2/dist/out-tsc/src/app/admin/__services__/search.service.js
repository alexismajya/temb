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
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/__services__/auth.service';
var SearchService = /** @class */ (function () {
    function SearchService(http, auth) {
        this.http = http;
        this.auth = auth;
        this.baseUrl = environment.tembeaBackEndUrl + "/api/v2/";
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.auth.tembeaToken,
            }),
        };
    }
    SearchService.prototype.searchData = function (terms, status, defaultTerm) {
        var _this = this;
        return terms.debounceTime(1000)
            .distinctUntilChanged()
            .switchMap(function (term) {
            var trimmedTerm = term.trim();
            var _a = _this.getQueryAndTerm(status, trimmedTerm, defaultTerm), routesQuery = _a[0], searchTerm = _a[1];
            return _this.searchItems(routesQuery, searchTerm);
        })
            .map(function (items) {
            return items.data;
        });
    };
    SearchService.prototype.getQueryAndTerm = function (status, trimmedTerm, defaultTerm) {
        if (/^[A-Z0-9]/ig.test(trimmedTerm)) {
            return [status + "?name=", trimmedTerm];
        }
        return [status + "?", defaultTerm];
    };
    SearchService.prototype.searchItems = function (resourceEndpoint, term) {
        return this.http.get("" + this.baseUrl + resourceEndpoint + term, this.httpOptions);
    };
    SearchService = __decorate([
        Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [HttpClient,
            AuthService])
    ], SearchService);
    return SearchService;
}());
export { SearchService };
//# sourceMappingURL=search.service.js.map