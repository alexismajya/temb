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
const engagement_service_1 = require("../engagement.service");
const database_1 = __importDefault(require("../../../database"));
const engagementMocks_1 = require("../__mocks__/engagementMocks");
const { models: { Engagement } } = database_1.default;
describe('Engagement Service', () => {
    let engagementFindOrCreate;
    let engagementFindByPk;
    beforeEach(() => {
        engagementFindOrCreate = jest.spyOn(Engagement, 'findOrCreate');
        engagementFindByPk = jest.spyOn(Engagement, 'findByPk');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create engagement', () => __awaiter(void 0, void 0, void 0, function* () {
        const { startDate, endDate, workHours, fellow, partner, fellowId, partnerId, } = engagementMocks_1.engagement;
        engagementFindOrCreate.mockResolvedValue([engagementMocks_1.engagement]);
        const result = yield engagement_service_1.engagementService.findOrCreateEngagement(workHours, fellow, partner, startDate, endDate);
        expect(engagementFindOrCreate).toHaveBeenCalled();
        expect(engagementFindOrCreate.mock.calls[0][0].where)
            .toEqual({
            fellowId,
            partnerId,
        });
        expect(result).toEqual(engagementMocks_1.engagement);
    }));
    it('should update engagement', () => __awaiter(void 0, void 0, void 0, function* () {
        const { startDate, endDate, workHours } = engagementMocks_1.updateEngagement;
        const update = jest.fn();
        engagementFindByPk.mockResolvedValue(Object.assign(Object.assign({}, engagementMocks_1.updateEngagement), { update }));
        const result = yield engagement_service_1.engagementService
            .updateEngagement(engagementMocks_1.updateEngagement.id, engagementMocks_1.updateEngagement);
        expect(engagementFindByPk).toHaveBeenCalled();
        expect(update.mock.calls[0][0])
            .toEqual({
            startDate,
            endDate,
            workHours,
        });
        expect(result)
            .toEqual(Object.assign(Object.assign({}, engagementMocks_1.updateEngagement), { update }));
    }));
    it('should get engagement', () => __awaiter(void 0, void 0, void 0, function* () {
        engagementFindByPk.mockResolvedValue(Object.assign({}, engagementMocks_1.engagement));
        const result = yield engagement_service_1.engagementService.getEngagement(engagementMocks_1.engagement.id);
        expect(engagementFindByPk).toHaveBeenCalled();
        expect(result).toEqual(engagementMocks_1.engagement);
    }));
});
//# sourceMappingURL=engagement.service.spec.js.map