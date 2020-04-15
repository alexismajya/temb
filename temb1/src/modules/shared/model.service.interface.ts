import { Includeable } from 'sequelize/types';

export interface IModelService<T, TId> {
  findById(id: TId, include?: Includeable[]): Promise<T>;
  findAll(filter: object): Promise<T[]>;
}
