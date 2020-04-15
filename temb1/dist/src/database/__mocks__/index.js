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
const sequelize_typescript_1 = require("sequelize-typescript");
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const modelPaths = path_1.default.join(__dirname, '../models');
exports.mockDatabase = new sequelize_typescript_1.Sequelize({
    models: [modelPaths],
    database: 'tembea_test_db',
    dialect: 'sqlite',
    storage: '../../../temp/tembea_test_db',
});
class MockRepository {
    constructor(model, data = []) {
        this.data = data;
        this.uniqueViolation = (value) => this.data.find((entry) => entry[value[0]] === value[1]);
        this.model = exports.mockDatabase.getRepository(model);
    }
    wrapInModel(value) {
        return Object.assign(Object.assign({}, value), { get: (options) => {
                if (!options || options.plain) {
                    return value;
                }
            }, getDataValue: () => value });
    }
    findByPk(identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const pkField = this.model.primaryKeyAttribute;
            const result = this.data.find((m) => m[pkField] === identifier);
            return Promise.resolve(this.wrapInModel(result));
        });
    }
    create(values, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const newObject = Object.assign(Object.assign({}, values), { id: this.data.length });
            this.data.push(newObject);
            return Promise.resolve(this.wrapInModel(newObject));
        });
    }
    update(values, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [[key, value]] = Object.entries(options.where);
            const modelAttributes = this.model.rawAttributes;
            const normalValues = Object.entries(values).map((v) => typeof v[1] === 'object' ? Object.entries(v[1])[0] : v);
            const uniqueEntries = Object.entries(normalValues).filter((k) => modelAttributes[k[1][0]].unique);
            const violation = uniqueEntries.some(this.uniqueViolation);
            if (violation)
                return new Error();
            const existingIndex = this.data
                .findIndex((d) => d[key.toString()] === value);
            const existing = this.data[existingIndex];
            const updated = Object.assign({}, existing);
            if (existing) {
                Object.assign(updated, values);
                this.data.splice(existingIndex, 1, updated);
                return Promise.resolve([1, [this.wrapInModel(updated)]]);
            }
            return Promise.resolve([0, [this.wrapInModel(updated)]]);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [[key, value]] = Object.entries(options.where);
            const result = this.data.find((one) => one[`${key}`] === value);
            return Promise.resolve(this.wrapInModel(result));
        });
    }
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let allEntries = this.data;
            const { where } = options;
            if (Object.values(where).length) {
                const [[key, value]] = Object.entries(where);
                const stringValue = value && typeof value === 'string' ? value.trim() :
                    typeof value === 'number' ? value.toString() :
                        value && (value !== '%') ? value[sequelize_1.Op.iLike].replace(/[\$%]/g, '')
                            : null;
                allEntries = stringValue
                    ? this.data.filter((e) => e[key.toString()] === stringValue)
                    : allEntries;
            }
            const result = allEntries.map((e) => this.wrapInModel(e));
            return Promise.resolve(result);
        });
    }
    count(countOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = this.data.length;
            const { where } = countOptions || { where: null };
            if (Object.values(where).length) {
                const [key, value] = Object.entries(where);
                const resultData = this.data.filter((e) => e[key.toString()] === value);
                result = resultData.length;
            }
            return Promise.resolve(result);
        });
    }
}
exports.MockRepository = MockRepository;
function getMockRepository(model) {
    return exports.mockDatabase.getRepository(model);
}
exports.default = getMockRepository;
//# sourceMappingURL=index.js.map