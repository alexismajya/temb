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
const trips_helper_1 = __importDefault(require("../trips.helper"));
const trip_helpers_1 = __importDefault(require("../../manager/trip.helpers"));
const trip_1 = require("../../__mocks__/trip");
const slack_block_models_1 = require("../../../models/slack-block-models");
describe(trips_helper_1.default, () => {
    describe(trips_helper_1.default.getDelayedTripApprovalMessage, () => {
        it('should send a approval message when user delayed', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_helpers_1.default, 'getApprovalPromptMessage').mockResolvedValue('message');
            yield trips_helper_1.default.getDelayedTripApprovalMessage(trip_1.trip);
            expect(trip_helpers_1.default.getApprovalPromptMessage).toBeCalled();
        }));
    });
    describe(trips_helper_1.default.getOpsApprovalMessageForManager, () => {
        it('should send a message to a manager when ops approved a trip', () => {
            const message = trips_helper_1.default.getOpsApprovalMessageForManager(trip_1.trip, 'channelId');
            expect(message).toBeInstanceOf(slack_block_models_1.BlockMessage);
        });
    });
});
//# sourceMappingURL=trips.helper.spec.js.map