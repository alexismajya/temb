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
export var responseMock = {
    success: true,
    message: 'Department created successfully',
    department: {
        createdAt: '2019-03-13T07:06:00.340Z',
        headId: 15,
        id: 34,
        location: 'Nairobi',
        name: 'New',
        status: 'Active',
        teamId: 'TE2K8PGF8',
        updatedAt: '2019-03-13T07:06:00.340Z'
    }
};
export var payloadMock = {
    email: 'allan.imire@andela.com',
    location: 'Nairobi',
    name: 'HOD98'
};
var MockError = /** @class */ (function (_super) {
    __extends(MockError, _super);
    function MockError(status, message) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        _this.message = message;
        _this.error = {
            message: message
        };
        return _this;
    }
    return MockError;
}(Error));
export { MockError };
//# sourceMappingURL=add-department-mock.js.map