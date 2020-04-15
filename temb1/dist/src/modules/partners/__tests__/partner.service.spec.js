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
const partner_service_1 = require("../../../modules/partners/partner.service");
const database_1 = __importDefault(require("../../../database"));
const { models: { Partner } } = database_1.default;
describe('Partner Service', () => {
    let partnerFindOrCreate;
    beforeEach(() => {
        partnerFindOrCreate = jest.spyOn(Partner, 'findOrCreate');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create partner', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'AAAAAA';
        partnerFindOrCreate.mockResolvedValue([{ name }]);
        const result = yield partner_service_1.partnerService.findOrCreatePartner(name);
        expect(partnerFindOrCreate).toHaveBeenCalled();
        expect(result).toEqual({ name });
    }));
});
//# sourceMappingURL=partner.service.spec.js.map