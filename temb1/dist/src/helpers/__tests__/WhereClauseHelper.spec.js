"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const WhereClauseHelper_1 = __importDefault(require("../WhereClauseHelper"));
describe('WhereClauseHelper', () => {
    describe('populateWhereClause', () => {
        it('should return a populated where clause', () => {
            const initialWhere = {};
            const newWhereClause = WhereClauseHelper_1.default.populateWhereClause(true, initialWhere, {
                email: 'testuser@email.com'
            });
            expect(newWhereClause).toEqual({
                email: 'testuser@email.com'
            });
        });
        it('should return the initial where clause if criteria is false', () => {
            const initialWhere = {};
            const newWhereClause = WhereClauseHelper_1.default.populateWhereClause(false, initialWhere, {
                email: 'testuser@email.com'
            });
            expect(newWhereClause).toEqual({});
        });
    });
});
describe('TripHelper for noCab', () => {
    beforeEach(() => {
        jest.mock('sequelize', () => {
            jest.fn(() => ({
                Op: {
                    [Symbol('and')]: 'and',
                    [Symbol('eq')]: 'eq',
                    [Symbol('ne')]: 'eq',
                }
            }));
        });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should return a new where clause', () => {
        const initialWhereClause = {};
        expect(WhereClauseHelper_1.default.getNoCabWhereClause(true, initialWhereClause)).toEqual({
            [sequelize_1.Op.and]: [{
                    cabId: {
                        [sequelize_1.Op.eq]: null
                    }
                },
                {
                    confirmedById: {
                        [sequelize_1.Op.ne]: null
                    }
                }
            ]
        });
    });
    it('should return the original where clause if noCab is false', () => {
        const initialWhereClause = {};
        expect(WhereClauseHelper_1.default.getNoCabWhereClause(false, initialWhereClause)).toEqual({});
    });
});
//# sourceMappingURL=WhereClauseHelper.spec.js.map