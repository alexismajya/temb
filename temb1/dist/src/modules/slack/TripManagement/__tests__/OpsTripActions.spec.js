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
const OpsTripActions_1 = __importDefault(require("../OpsTripActions"));
const InteractivePromptsHelpers_1 = __importDefault(require("../../helpers/slackHelpers/InteractivePromptsHelpers"));
const InteractivePrompts_1 = __importDefault(require("../../SlackPrompts/InteractivePrompts"));
describe('sendUserCancellation', () => {
    it('Should send user cancellation update', () => __awaiter(void 0, void 0, void 0, function* () {
        const [channel, botToken, trip, userId, timeStamp] = ['operations', 'xyz098', {}, '123409864'];
        jest.spyOn(InteractivePromptsHelpers_1.default, 'addOpsNotificationTripFields').mockResolvedValue({});
        jest.spyOn(InteractivePrompts_1.default, 'messageUpdate').mockResolvedValue();
        yield OpsTripActions_1.default.sendUserCancellation(channel, botToken, trip, userId, timeStamp);
        expect(InteractivePrompts_1.default.messageUpdate).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=OpsTripActions.spec.js.map