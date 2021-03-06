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
export var providerConfirmMock = {
    message: 'Confirmation received',
    payload: {
        providerId: 7,
        driverName: 'Test Driver',
        driverPhoneNo: '+23481989388390',
        vehicleModel: 'Avensisz',
        vehicleRegNo: 'LSK-23-HJS'
    }
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
//# sourceMappingURL=confirm-trip.mocks.js.map