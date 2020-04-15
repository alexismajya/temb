import { Sequelize, Model, Repository } from 'sequelize-typescript';
import { Base } from '../../database/base';
import path from 'path';
import { Op, Identifier, NonNullFindOptions, CreateOptions, UpdateOptions, CountOptions } from 'sequelize';

const modelPaths = path.join(__dirname, '../models');

export const mockDatabase = new Sequelize({
  models: [modelPaths],
  database: 'tembea_test_db',
  dialect: 'sqlite',
  storage: '../../../temp/tembea_test_db',
});

export class MockRepository<T extends Base<T>> {
  private readonly model: Repository<T>;
  constructor(model: (new() => T), protected readonly data: T[] = []) {
    this.model = mockDatabase.getRepository(model);
  }

  public wrapInModel<M>(value: M) {
    return {
      ...value,
      get: (options?: any) => {
        if (!options || options.plain) {
          return value;
        }
      },
      getDataValue: () => value,
    } as unknown as Model<M>;
  }

  async findByPk(identifier: Identifier,
    options?: Omit<NonNullFindOptions, 'where'>): Promise<Model<T>> {
    const pkField = this.model.primaryKeyAttribute;
    const result = this.data.find((m: any) => m[pkField] === identifier);
    return Promise.resolve(this.wrapInModel(result));
  }

  async create(values?: object, options?: CreateOptions) {
    const newObject = { ...values, id: this.data.length } as T;
    this.data.push(newObject);
    return Promise.resolve(this.wrapInModel(newObject));
  }

  async update(values: object, options: UpdateOptions) {
    const [[key, value]] = Object.entries(options.where);
    const modelAttributes = this.model.rawAttributes;
    const  normalValues = Object.entries(values).map((v) =>
    typeof v[1] === 'object' ? Object.entries(v[1])[0] : v);
    const uniqueEntries = Object.entries(normalValues).filter((k) =>
    modelAttributes[k[1][0]].unique);
    const violation = uniqueEntries.some(this.uniqueViolation);
    if (violation) return new Error();
    const existingIndex = this.data
    .findIndex((d: any) => d[key.toString()] === value);
    const existing = this.data[existingIndex];
    const updated = { ...existing };
    if (existing) {
      Object.assign(updated, values);
      this.data.splice(existingIndex, 1, updated);
      return Promise.resolve([1, [this.wrapInModel(updated)]]);
    }
    return Promise.resolve([0, [this.wrapInModel(updated)]]);
  }

  async findOne(options: NonNullFindOptions) {
    const [[key, value]] = Object.entries(options.where);
    const result = this.data.find((one: any) => one[`${key}`] === value);
    return Promise.resolve(this.wrapInModel(result));
  }

  async findAll(options: NonNullFindOptions) {
    let allEntries = this.data;
    const { where } = options;
    if (Object.values(where).length) {
      const [[key, value]] = Object.entries(where);
      const stringValue = value && typeof value === 'string' ? value.trim() :
         typeof value === 'number' ? value.toString() :
         value && (value !== '%') ? (value[Op.iLike] as string).replace(/[\$%]/g, '')
          : null;
      allEntries = stringValue
        ? this.data.filter((e: any) => e[key.toString()] === stringValue)
        : allEntries;
    }
    const result = allEntries.map((e) => this.wrapInModel(e));
    return Promise.resolve(result);
  }

  async count(countOptions?: CountOptions) {
    let result: number = this.data.length;
    const { where } = countOptions || { where: null };
    if (Object.values(where).length) {
      const [key, value] = Object.entries(where);
      const resultData = this.data.filter((e: any) => e[key.toString()] === value);
      result = resultData.length;
    }
    return Promise.resolve(result);
  }

  private uniqueViolation = (value: any[]) =>
    this.data.find((entry: any) => entry[value[0]] === value[1])
}

export default function getMockRepository<T extends Model<T>>(model: (new () => T)) {
  return mockDatabase.getRepository(model);
}