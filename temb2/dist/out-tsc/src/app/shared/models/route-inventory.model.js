var RouteInventoryModel = /** @class */ (function () {
    function RouteInventoryModel() {
        this.routes = [];
    }
    RouteInventoryModel.prototype.deserialize = function (input) {
        Object.assign(this, input);
        return this;
    };
    return RouteInventoryModel;
}());
export { RouteInventoryModel };
//# sourceMappingURL=route-inventory.model.js.map