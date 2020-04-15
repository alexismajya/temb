"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validHomeBStopMock = jest.fn().mockResolvedValue({
    distanceInMetres: 900,
    distanceInKm: '0.9Km'
});
exports.invalidHomeBStopMock = jest.fn().mockResolvedValue({
    distanceInMetres: 2900,
    distanceInKm: '2.9Km'
});
//# sourceMappingURL=googleMapHelpersMock.js.map