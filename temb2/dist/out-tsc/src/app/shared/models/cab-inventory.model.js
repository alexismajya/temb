var CabInventoryModel = /** @class */ (function () {
    function CabInventoryModel() {
        this.cabs = [];
    }
    CabInventoryModel.prototype.deserialize = function (input) {
        Object.assign(this, input);
        return this;
    };
    return CabInventoryModel;
}());
export { CabInventoryModel };
var CabModel = /** @class */ (function () {
    function CabModel(id, regNumber, capacity, model, providerId) {
        this.id = id;
        this.regNumber = regNumber;
        this.capacity = capacity;
        this.model = model;
        this.providerId = providerId;
    }
    return CabModel;
}());
export { CabModel };
//# sourceMappingURL=cab-inventory.model.js.map