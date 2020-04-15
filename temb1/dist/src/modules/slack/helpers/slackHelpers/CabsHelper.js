"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CabsHelper {
    static generateCabLabel(cab) {
        let format;
        if (cab.model && cab.regNumber) {
            format = `${cab.model.toUpperCase()} - ${cab.regNumber} - Seats up to ${cab.capacity} people`;
        }
        if (!cab.model) {
            format = `${cab.model || cab.regNumber} - seats up to ${cab.capacity} people`;
        }
        return format;
    }
    static generateDriverLabel(driver) {
        let format = '';
        if (driver.driverName && driver.driverPhoneNo) {
            format = `${driver.driverName.toUpperCase()} - (${driver.driverPhoneNo})`;
        }
        return format;
    }
    static toCabLabelValuePairs(cabs, hasText = false) {
        return cabs.map((val) => {
            let data = {
                label: CabsHelper.generateCabLabel(val),
                value: val.id
            };
            if (hasText) {
                data = {
                    text: CabsHelper.generateCabLabel(val),
                    value: val.id
                };
            }
            return data;
        });
    }
    static toCabDriverValuePairs(drivers, hasText) {
        return drivers.map((val) => {
            const driverLabel = CabsHelper.generateDriverLabel(val);
            const label = { label: driverLabel };
            const text = { text: driverLabel };
            const value = { value: val.id };
            const textOrLabel = hasText ? text : label;
            const data = Object.assign(Object.assign({}, textOrLabel), value);
            return data;
        });
    }
}
exports.default = CabsHelper;
//# sourceMappingURL=CabsHelper.js.map