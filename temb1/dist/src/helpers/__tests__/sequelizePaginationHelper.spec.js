"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelizePaginationHelper_1 = __importDefault(require("../sequelizePaginationHelper"));
const tripRequestMock_1 = __importDefault(require("../__mocks__/tripRequestMock"));
const errorHandler_1 = __importDefault(require("../errorHandler"));
describe('SequelizePaginationHelper', () => {
    it('should be instance of SequelizePaginationHelper', () => {
        const sequelizeResult = new sequelizePaginationHelper_1.default(tripRequestMock_1.default, {});
        expect(sequelizeResult).toBeInstanceOf(sequelizePaginationHelper_1.default);
    });
    describe('SequelizePaginationHelper_getTotalPages', () => {
        it('should return totalpages if model is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const sequelizeResult = new sequelizePaginationHelper_1.default(tripRequestMock_1.default, {});
            const totalPage = yield sequelizeResult.getTotalPages();
            expect(totalPage).toEqual(2);
        }));
        it('should return totalpages if filters is not passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const sequelizeResult = new sequelizePaginationHelper_1.default(tripRequestMock_1.default);
            const totalPage = yield sequelizeResult.getTotalPages();
            expect(totalPage).toEqual(2);
        }));
    });
    describe('SequelizePaginationHelper_getPageItems', () => {
        it('should have a specific behaviour', () => __awaiter(void 0, void 0, void 0, function* () {
            const sequelizeResult = new sequelizePaginationHelper_1.default(tripRequestMock_1.default, {});
            const { data: pageItems } = yield sequelizeResult.getPageItems();
            expect(pageItems).not.toBeFalsy();
        }));
    });
    describe('SequelizePaginationHelper_getPageNo', () => {
        let mockModel;
        let sequelizeResult;
        const mockFilter = { where: { test: 'dummy where' } };
        beforeEach(() => {
            mockModel = {
                count: jest.fn(),
                findAll: jest.fn(),
            };
            sequelizeResult = new sequelizePaginationHelper_1.default(mockModel, mockFilter);
        });
        it('should have a specific behaviour', () => __awaiter(void 0, void 0, void 0, function* () {
            mockModel.count.mockResolvedValue(54);
            let pageItems = yield sequelizeResult.getPageNo(0);
            expect(mockModel.count).toHaveBeenCalledWith(mockFilter);
            expect(pageItems).toEqual(1);
            pageItems = yield sequelizeResult.getPageNo(2);
            expect(pageItems).toEqual(2);
            pageItems = yield sequelizeResult.getPageNo(6);
            expect(pageItems).toEqual(6);
            pageItems = yield sequelizeResult.getPageNo(7);
            expect(pageItems).toEqual(6);
        }));
    });
    describe('deserializeSort', () => {
        describe('validate invalid sortParam', () => {
            it('should returns undefined when an empty string is passed'
                + ' in as an argument', () => {
                const result = sequelizePaginationHelper_1.default.deserializeSort('');
                expect(result).toBeUndefined();
            });
            it('should throw error when invalid param is provided ', () => {
                const assertError = (param) => {
                    try {
                        sequelizePaginationHelper_1.default.deserializeSort(param);
                    }
                    catch (error) {
                        expect(error)
                            .toBeInstanceOf(errorHandler_1.default);
                        expect(error.message)
                            .toEqual(sequelizePaginationHelper_1.default.sortErrorMessage);
                        expect(error.statusCode)
                            .toEqual(400);
                    }
                };
                assertError('desc');
                assertError('asc');
                assertError('asc,desc');
                assertError('asc,name,id,');
            });
        });
        describe('valid sort param', () => {
            it('should return deserialized sort array', () => {
                const assertResult = (data, predicate, direction) => {
                    expect(data)
                        .toHaveProperty('predicate');
                    expect(data)
                        .toHaveProperty('direction');
                    expect(data).toEqual({ predicate, direction });
                };
                let result = sequelizePaginationHelper_1.default.deserializeSort('name');
                expect(result).toBeInstanceOf(Array);
                expect(result.length).toEqual(1);
                assertResult(result[0], 'name', 'desc');
                result = sequelizePaginationHelper_1.default.deserializeSort('name,asc');
                expect(result).toBeInstanceOf(Array);
                expect(result.length).toEqual(1);
                assertResult(result[0], 'name', 'asc');
                result = sequelizePaginationHelper_1.default.deserializeSort('id,desc,name,asc');
                expect(result).toBeInstanceOf(Array);
                expect(result.length).toEqual(2);
                assertResult(result[0], 'id', 'desc');
                assertResult(result[1], 'name', 'asc');
            });
        });
    });
    describe('serializeObject', () => {
        it('should remove nested dataValues', () => {
            const testObject = {
                dataValues: {
                    name: 'Mubarak',
                    school: {
                        dataValues: {
                            name: 'University of Ilorin'
                        }
                    }
                }
            };
            const result = sequelizePaginationHelper_1.default.deserializeObject(testObject);
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('school');
            expect(result.school).toHaveProperty('name');
        });
    });
});
//# sourceMappingURL=sequelizePaginationHelper.spec.js.map