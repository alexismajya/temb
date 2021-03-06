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
import { CabModel } from 'src/app/shared/models/cab-inventory.model';
export var responseMock = {
    success: true,
    message: 'You have successfully created a cab',
    cab: {
        id: 30,
        driverName: 'Ahmed',
        driverPhoneNo: '09046785378',
        regNumber: 'FKJ-47',
        capacity: '7',
        model: 'Lamborghini Aventador S LP 740-4 Roadster',
        location: 'Lagos',
        updatedAt: '2019-04-14T10:22:01.291Z',
        createdAt: '2019-04-14T10:22:01.291Z'
    }
};
export var createCabMock = {
    driverName: 'Ahmed',
    driverPhoneNo: '09046785378',
    regNumber: 'FKJ-47',
    capacity: '7',
    model: 'Lamborghini Aventador S LP 740-4 Roadster',
    location: 'Lagos',
};
export var getCabsMock = {
    pageMeta: {
        totalPages: 2,
        page: 1,
        totalResults: 4,
        pageSize: 2
    },
    cabs: [
        {
            driverName: 'Dominic Toretto',
            driverPhoneNo: '1-287-064-9116 x185',
            regNumber: 'SMK 319 JK',
            capacity: 4,
            model: 'subaru',
            location: 'Lagos'
        },
        {
            driverName: 'Dominic Toretto',
            driverPhoneNo: '1-287-064-9116 x185',
            regNumber: 'SMK 319 JK',
            capacity: 4,
            model: 'subaru',
            location: 'Lagos'
        },
        {
            driverName: 'Dominic Toretto',
            driverPhoneNo: '1-287-064-9116 x185',
            regNumber: 'SMK 319 JK',
            capacity: 4,
            model: 'subaru',
            location: 'Lagos'
        },
        {
            driverName: 'Dominic Toretto',
            driverPhoneNo: '1-287-064-9116 x185',
            regNumber: 'SMK 319 JK',
            capacity: 4,
            model: 'subaru',
            location: 'Lagos'
        }
    ]
};
export var updateCabMock = new CabModel(1, 'SMK 319 JE', 4, 'subaru', 1);
export var updateResponse = {
    success: true,
    message: 'Cab details updated successfully',
    data: {
        id: 1,
        regNumber: 'SMK 319 JE',
        capacity: '4',
        model: 'subaru',
        deletedAt: null,
        providerId: 1
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
//# sourceMappingURL=add-cabs-mock.js.map