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
const removeDataValues_1 = __importDefault(require("../removeDataValues"));
describe('RemoveDataValues', () => {
    it('should test removeDataValues method strips dataValues', () => __awaiter(void 0, void 0, void 0, function* () {
        const tripBefore = {
            dataValues: {
                id: 1,
                name: 'Lagos to Nairobi',
                status: 'Pending',
                rider: {
                    dataValues: {
                        id: 3,
                        name: 'James',
                        head: {
                            dataValues: {
                                id: 10,
                                title: 'Head of department'
                            }
                        }
                    }
                }
            }
        };
        const tripAfter = {
            id: 1,
            name: 'Lagos to Nairobi',
            status: 'Pending',
            rider: {
                id: 3,
                name: 'James',
                head: {
                    id: 10,
                    title: 'Head of department'
                }
            }
        };
        const result = removeDataValues_1.default.removeDataValues(tripBefore);
        expect(result).toEqual(tripAfter);
    }));
    it('should apply to objects in an array', () => {
        const nestedObj = { id: 2, name: 'Tembea' };
        const mainObject = [
            {
                dataValues: {
                    id: 1,
                    name: 'Test 1',
                    users: [
                        {
                            dataValues: nestedObj
                        }
                    ]
                }
            }
        ];
        const after = [
            Object.assign({}, mainObject[0].dataValues)
        ];
        after[0].users[0] = Object.assign({}, nestedObj);
        const result = removeDataValues_1.default.removeDataValues(mainObject);
        expect(result).toEqual(after);
    });
});
//# sourceMappingURL=removeDataValues.spec.js.map