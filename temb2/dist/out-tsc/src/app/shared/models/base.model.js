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
var BaseInventoryModel = /** @class */ (function () {
    function BaseInventoryModel() {
    }
    return BaseInventoryModel;
}());
export { BaseInventoryModel };
var DriverInventoryModel = /** @class */ (function (_super) {
    __extends(DriverInventoryModel, _super);
    function DriverInventoryModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DriverInventoryModel;
}(BaseInventoryModel));
export { DriverInventoryModel };
var CabInventoryModel = /** @class */ (function (_super) {
    __extends(CabInventoryModel, _super);
    function CabInventoryModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CabInventoryModel;
}(BaseInventoryModel));
export { CabInventoryModel };
//# sourceMappingURL=base.model.js.map