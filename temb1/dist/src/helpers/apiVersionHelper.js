"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiVersionHelper {
    static getApiVersion(req) {
        const version = req.originalUrl.split('/')[2];
        return version ? version.toLowerCase() : version;
    }
}
exports.default = ApiVersionHelper;
//# sourceMappingURL=apiVersionHelper.js.map