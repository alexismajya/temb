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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../database");
const feedback_service_1 = require("../feedback.service");
describe('Feedback service', () => {
    const mockFeedbackData = {
        get: () => {
            return { id: 1, feedback: 'my feedback', userId: 1 };
        },
    };
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create feedback successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const spy = jest.spyOn(database_1.Feedback, 'create').mockResolvedValue(mockFeedbackData);
        const result = yield feedback_service_1.feedbackService.createFeedback({ userId: 1, feedback: 'the feedback' });
        expect(result).toEqual(mockFeedbackData.get());
        expect(spy).toBeCalled();
    }));
});
//# sourceMappingURL=FeedbackService.spec.js.map