"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleMapsError_1 = __importDefault(require("../googleMapsError"));
describe('GoogleMapsError', () => {
    it('should need an instance of error', () => {
        const testErrorMessage = 'A test error';
        const testError = new googleMapsError_1.default(404, testErrorMessage);
        expect(testError.message).toEqual(testErrorMessage);
        expect(testError.code).toEqual(404);
    });
});
//# sourceMappingURL=googleMapsError.spec.js.map