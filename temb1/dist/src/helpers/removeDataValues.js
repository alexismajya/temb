"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RemoveDataValues {
    static filter(data) {
        return (data && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, 'dataValues')) || Array.isArray(data);
    }
    static removeDataValues(newData) {
        if (!RemoveDataValues.filter(newData)) {
            return newData;
        }
        if (Array.isArray(newData))
            return newData.map(RemoveDataValues.removeDataValues);
        const sorted = Object.assign({}, newData.dataValues);
        Object.keys(sorted)
            .filter((k) => RemoveDataValues.filter(sorted[k]))
            .forEach((key) => {
            sorted[key] = Array.isArray(sorted[key])
                ? sorted[key].map(RemoveDataValues.removeDataValues)
                : RemoveDataValues.removeDataValues(sorted[key]);
        });
        return sorted;
    }
}
exports.default = RemoveDataValues;
//# sourceMappingURL=removeDataValues.js.map