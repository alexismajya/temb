"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    static sendResponse(res, code, success, message, data) {
        return res.status(code).json({
            success,
            message,
            data
        });
    }
}
exports.getPaginationMessage = (pageMeta) => (`${pageMeta.pageNo} of ${pageMeta.totalPages} page(s).`);
exports.default = Response;
//# sourceMappingURL=responseHelper.js.map