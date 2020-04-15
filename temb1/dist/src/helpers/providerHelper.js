"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
class ProviderHelper {
    static serializeDetails(modelDetails) {
        let info = {};
        if (modelDetails) {
            const { createdAt, updatedAt, deletedAt } = modelDetails, details = __rest(modelDetails, ["createdAt", "updatedAt", "deletedAt"]);
            info = details;
        }
        return info;
    }
    static get defaultPageable() {
        return {
            page: 1,
            size: constants_1.MAX_INT
        };
    }
    static paginateData(totalPages, page, totalResults, pageSize, status, key) {
        return {
            pageMeta: {
                totalPages, page, totalResults, pageSize
            },
            [key]: status
        };
    }
    static generateProvidersLabel(providers) {
        return providers.map((provider) => {
            const { name: label, id: providerId } = provider;
            const data = {
                label,
                value: providerId.toString()
            };
            return data;
        });
    }
    static getProviderDetailsFromReq(payload) {
        let { page, size, providerId } = payload;
        page = page || 1;
        size = size || constants_1.DEFAULT_SIZE;
        providerId = providerId || null;
        const pageable = { page, size };
        const where = { providerId };
        return {
            page,
            size,
            providerId,
            pageable,
            where
        };
    }
}
exports.default = ProviderHelper;
//# sourceMappingURL=providerHelper.js.map