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
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { createRequestOption } from 'src/app/utils/request-util';
import { TripRequestService } from './trip-request.service';
var ExportService = /** @class */ (function () {
    function ExportService(http) {
        this.http = http;
        this.exportToPDFUrl = environment.tembeaBackEndUrl + "/api/v1/export/pdf";
        this.exportToCSVUrl = environment.tembeaBackEndUrl + "/api/v1/export/csv";
    }
    ExportService.prototype.exportData = function (tableName, sort, filterParams, dataType) {
        var params;
        if (filterParams) {
            var reqDate = TripRequestService.flattenDateFilter(filterParams);
            params = createRequestOption(reqDate);
        }
        var applicationType = "application/" + dataType;
        var url = dataType === 'pdf' ? this.exportToPDFUrl : this.exportToCSVUrl;
        return this.http.get(url + "?table=" + tableName + "&sort=" + sort, {
            params: params,
            responseType: 'arraybuffer',
            headers: { 'Accept': applicationType }
        }).pipe(retry(3));
    };
    ExportService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], ExportService);
    return ExportService;
}());
export { ExportService };
//# sourceMappingURL=export.component.service.js.map