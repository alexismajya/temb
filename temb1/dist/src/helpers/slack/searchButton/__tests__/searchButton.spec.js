"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
describe('Search Button', () => {
    it('should return an attachment object for search button', () => {
        const attachment = index_1.default('some_callbackId', 'Search');
        expect(attachment.actions.length).toEqual(1);
    });
});
//# sourceMappingURL=searchButton.spec.js.map