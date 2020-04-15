"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GoogleMapsHelpers {
    static isCoordinate(coordinateString) {
        return coordinateString.trim().match(/^[-?\d]+(\.[\d]+)?,[ ]*[-?\d]+(\.[\d]+)?$/);
    }
    static coordinateStringToArray(coordinateString) {
        if (!this.isCoordinate(coordinateString)) {
            throw Error('coordinate string must be in the format '
                + '`(23,34) OR (233.144, -233.444) OR (-23,34)`...etc');
        }
        return coordinateString.split(',');
    }
}
exports.default = GoogleMapsHelpers;
//# sourceMappingURL=index.js.map