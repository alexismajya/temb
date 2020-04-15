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
const homebase_service_1 = require("../../modules/homebases/homebase.service");
const HomeBaseHelper_1 = __importDefault(require("../HomeBaseHelper"));
describe('HomeBaseHelper', () => {
    let findHomeBaseSpy;
    beforeEach(() => {
        findHomeBaseSpy = jest.spyOn(homebase_service_1.homebaseService, 'getById');
    });
    it('should return false if homebase does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        findHomeBaseSpy.mockResolvedValue(null);
        const result = yield HomeBaseHelper_1.default.checkIfHomeBaseExists(2343);
        expect(result).toBeNull();
    }));
    it('should return false if homebase does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockHomeBase = {
            id: 8,
            countryId: 13,
            channel: 'uuf',
            name: 'Berkshire'
        };
        findHomeBaseSpy.mockResolvedValue(mockHomeBase);
        const result = yield HomeBaseHelper_1.default.checkIfHomeBaseExists(8);
        expect(result).toBe(mockHomeBase);
    }));
});
//# sourceMappingURL=HomeBaseHelper.spec.js.map