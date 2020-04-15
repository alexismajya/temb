var DepartmentsModel = /** @class */ (function () {
    function DepartmentsModel() {
        this.departments = [];
    }
    DepartmentsModel.prototype.deserialize = function (input) {
        Object.assign(this, input);
        return this;
    };
    return DepartmentsModel;
}());
export { DepartmentsModel };
var Department = /** @class */ (function () {
    function Department(name, email) {
        this.name = name;
        this.email = email;
    }
    return Department;
}());
export { Department };
//# sourceMappingURL=departments.model.js.map