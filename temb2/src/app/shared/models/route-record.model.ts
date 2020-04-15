import { IRouteBatch } from './route-inventory.model';

export interface IRouteRecord {
  id?: number;
  batchId: number;
  confirmedUsers: number;
  skippedUsers: number;
  pendingUsers: number;
  batchUseDate: string;
  batch: IRouteBatch;
}
