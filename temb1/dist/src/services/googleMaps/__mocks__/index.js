"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistanceMock = {
    data: {
        rows: [{
                elements: [{
                        distance: { text: '1.272, 30.33', value: '1.2223, 32.222' }
                    }],
            }]
    }
};
exports.noGoogleKeysMock = {
    data: {
        status: 'REQUEST_DENIED',
    }
};
exports.invalidLocationMock = {
    data: {
        rows: [{
                elements: [{
                        status: 'ZERO_RESULTS',
                    }]
            }]
    }
};
//# sourceMappingURL=index.js.map