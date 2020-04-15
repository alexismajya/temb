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
const reschedule_helper_1 = __importDefault(require("../reschedule.helper"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const SlackViews_1 = require("../../../extensions/SlackViews");
describe(reschedule_helper_1.default, () => {
    const teamdetails = { teamId: 'U123', botToken: 'xoxp-123' };
    const tripId = 123;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.mock('../../../extensions/SlackViews');
        jest.spyOn(SlackViews_1.SlackViews.prototype, 'open');
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
            .mockResolvedValue(teamdetails.botToken);
    }));
    describe(reschedule_helper_1.default.getRescheduleModal, () => {
        it('should add reschedullar modal', () => {
            const func = reschedule_helper_1.default.getRescheduleModal(tripId, teamdetails.botToken);
            expect(typeof func).toBe('object');
            expect(func.type).toEqual('modal');
            expect(func.title.text).toEqual('Reschedule Trip');
        });
    });
    describe(reschedule_helper_1.default.sendRescheduleModal, () => {
        it('should send reschedule modal', () => __awaiter(void 0, void 0, void 0, function* () {
            const payloadData = {
                team: {
                    id: teamdetails.teamId,
                },
                trigger_id: '123',
            };
            yield reschedule_helper_1.default.sendRescheduleModal(payloadData, tripId);
            expect(SlackViews_1.SlackViews.prototype.open)
                .toHaveBeenCalledWith(payloadData.trigger_id, expect.any(Object));
        }));
    });
});
//# sourceMappingURL=reschedule.helper.spec.js.map