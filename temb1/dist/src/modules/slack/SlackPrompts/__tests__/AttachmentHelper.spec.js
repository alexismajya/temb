"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AttachmentHelper_1 = __importDefault(require("../notifications/AttachmentHelper"));
describe('AttachmentHelper', () => {
    describe('AttachmentHelper_commentAttachment', () => {
        it('should get a null when their is no manager and Opps has no comment', () => {
            const routeRequest = { managerComment: '', opsComment: '' };
            const res = AttachmentHelper_1.default.commentAttachment(routeRequest);
            expect(res).toBeNull();
        });
        it('should create attachment when manager and Opps has comment', () => {
            const routeRequest = { managerComment: 'LGTM', opsComment: 'LGTM' };
            const res = AttachmentHelper_1.default.commentAttachment(routeRequest);
            expect(res).toBeTruthy();
        });
        it('should create attachment when only Opps has comment', () => {
            const routeRequest = { managerComment: '', opsComment: 'LGTM' };
            const res = AttachmentHelper_1.default.commentAttachment(routeRequest);
            expect(res).toBeTruthy();
        });
    });
});
//# sourceMappingURL=AttachmentHelper.spec.js.map