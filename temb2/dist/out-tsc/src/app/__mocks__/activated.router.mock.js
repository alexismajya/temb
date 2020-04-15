var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
var ActivatedRouteMock = /** @class */ (function (_super) {
    __extends(ActivatedRouteMock, _super);
    function ActivatedRouteMock(parameters) {
        var _this = _super.call(this) || this;
        _this.queryParams = of(parameters);
        _this.params = of(parameters);
        _this.data = of(__assign({}, parameters, { pagingParams: {
                page: 10,
            } }));
        return _this;
    }
    return ActivatedRouteMock;
}(ActivatedRoute));
export { ActivatedRouteMock };
//# sourceMappingURL=activated.router.mock.js.map