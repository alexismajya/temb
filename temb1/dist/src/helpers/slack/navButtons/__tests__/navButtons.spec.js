"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
describe('Navigation Buttons', () => {
    it('should return an object', () => {
        const attachment = index_1.default('step_back', 'some_callbackId');
        expect(attachment.actions.length).toEqual(2);
    });
});
//# sourceMappingURL=navButtons.spec.js.map