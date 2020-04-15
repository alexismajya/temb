"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class WhereClauseHelper {
    static populateWhereClause(criteria, where, newValues) {
        if (criteria) {
            return Object.assign(Object.assign({}, where), newValues);
        }
        return where;
    }
    static getNoCabWhereClause(noCab, where) {
        if (noCab) {
            return Object.assign(Object.assign({}, where), { [sequelize_1.Op.and]: [{
                        cabId: {
                            [sequelize_1.Op.eq]: null
                        }
                    },
                    {
                        confirmedById: {
                            [sequelize_1.Op.ne]: null
                        }
                    }
                ] });
        }
        return where;
    }
}
exports.default = WhereClauseHelper;
//# sourceMappingURL=WhereClauseHelper.js.map