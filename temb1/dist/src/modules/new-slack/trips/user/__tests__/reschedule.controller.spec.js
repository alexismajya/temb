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
const reschedule_controller_1 = require("../reschedule.controller");
const database_1 = __importDefault(require("../../../../../database"));
const { models: { TeamDetails } } = database_1.default;
describe(reschedule_controller_1.RescheduleController, () => {
    let teamId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const teamDetail = yield TeamDetails.findAll({ limit: 1 });
        teamId = teamDetail[0].teamId;
    }));
    describe(reschedule_controller_1.RescheduleController.getRescheduleModal, () => {
        it('should add reschedullar modal', () => {
            const func = reschedule_controller_1.RescheduleController.getRescheduleModal(1);
            expect(typeof func).toBe('object');
            expect(func.type).toEqual('modal');
            expect(func.title.text).toEqual('Reschedule Trip');
        });
    });
    describe(reschedule_controller_1.RescheduleController.sendRescheduleModal, () => {
        it('should send reschedule modal', () => __awaiter(void 0, void 0, void 0, function* () {
            const payloadData = {
                team: {
                    id: teamId,
                },
            };
            yield reschedule_controller_1.RescheduleController.sendRescheduleModal(payloadData, Number(teamId));
        }));
    });
});
//# sourceMappingURL=reschedule.controller.spec.js.map