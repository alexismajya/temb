import { IDriver } from './driver.interface';
import { ICab } from './cab.interface';
import { IRoute } from './route.interface';

export interface IRouteBatch {
  id?: number;
  takeOff: string;
  batch?: string;
  providerId: number;
  capacity?: string;
  route: IRoute;
  driver: IDriver;
  cabDetails: ICab;
}
