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
import { environment } from 'src/environments/environment';
import 'rxjs/add/operator/map';
import { AISData } from 'src/app/shared/models/ais.model';
var AisService = /** @class */ (function () {
    function AisService(httpClient) {
        this.httpClient = httpClient;
        this.baseUrl = environment.tembeaBackEndUrl + "/api/v1/ais";
    }
    AisService.prototype.getResponse = function (email) {
        var httpOptions = {
            params: {
                email: email
            }
        };
        return this.httpClient.get(this.baseUrl, httpOptions)
            .map(function (data) {
            var aisData;
            aisData = data.aisUserData;
            return new AISData().deserialize(aisData);
        });
    };
    AisService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], AisService);
    return AisService;
}());
export { AisService };
//# sourceMappingURL=ais.service.js.map