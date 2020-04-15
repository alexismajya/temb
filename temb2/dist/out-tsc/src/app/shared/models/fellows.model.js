var FellowsModel = /** @class */ (function () {
    function FellowsModel() {
        this.fellows = [];
    }
    FellowsModel.prototype.deserialize = function (input) {
        Object.assign(this, input);
        return this;
    };
    return FellowsModel;
}());
export { FellowsModel };
//# sourceMappingURL=fellows.model.js.map