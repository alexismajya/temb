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
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment } from './../../../environments/environment';
var BaseInventoryService = /** @class */ (function () {
    function BaseInventoryService(baseUrl, http) {
        this.baseUrl = baseUrl;
        this.http = http;
        this.teamUrl = environment.teamUrl;
        this.httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: { slackUrl: this.teamUrl }
        };
    }
    BaseInventoryService.prototype.get = function (size, page, sort, providerId) {
        return this.http
            .get(this.baseUrl + "?sort=" + sort + "&size=" + size + "&page=" + page + "&providerId=" + providerId);
    };
    BaseInventoryService.prototype.add = function (data) {
        return this.http.post("" + this.baseUrl, __assign({}, data));
    };
    BaseInventoryService.prototype.update = function (data, id) {
        return this.http.put(this.baseUrl + "/" + id, data, this.httpOptions);
    };
    BaseInventoryService.prototype.delete = function (id) {
        return this.http.delete(this.baseUrl + "/" + id, this.httpOptions);
    };
    return BaseInventoryService;
}());
export { BaseInventoryService };
//# sourceMappingURL=base-inventory-service.js.map