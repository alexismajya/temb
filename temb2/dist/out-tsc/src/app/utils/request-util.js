import { HttpParams } from '@angular/common/http';
export var createRequestOption = function (req) {
    var options = new HttpParams();
    if (req) {
        Object.keys(req).filter(function (key) { return !!req[key]; }).forEach(function (key) {
            if (key !== 'sort') {
                options = options.set(key, req[key]);
            }
        });
    }
    return options;
};
//# sourceMappingURL=request-util.js.map