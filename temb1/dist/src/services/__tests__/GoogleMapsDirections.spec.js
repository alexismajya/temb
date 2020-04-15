"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const GoogleMapsDirections_1 = __importDefault(require("../googleMaps/GoogleMapsDirections"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
describe('Google Maps Directions', () => {
    beforeAll(() => {
        bugsnagHelper_1.default.log = jest.fn(() => { });
    });
    it('should fetch the direction', () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.get = jest.fn(() => ({
            data: 'Correct data'
        }));
        const res = yield GoogleMapsDirections_1.default.getDirections('origin', 'destination');
        expect(res).toEqual('Correct data');
    }));
    it('should catch axios error', () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.get = jest.fn(() => {
            throw new Error('Random error');
        });
        yield GoogleMapsDirections_1.default.getDirections('origin', 'destination');
        expect(bugsnagHelper_1.default.log).toHaveBeenCalledTimes(1);
    }));
});
//# sourceMappingURL=GoogleMapsDirections.spec.js.map