import { IHomeBase } from './homebase.model';
import { ICabInventory } from './cab-inventory.model';
import { IDriverModel } from './driver.model';
import { Deserializable } from './deserializable.model';
import { IPageMeta } from './page-meta.model';
import { Users } from './users.model';

export class RouteInventoryModel implements Deserializable<RouteInventoryModel> {
  routes: IRouteBatch[] = [];
  pageMeta?: IPageMeta;

  deserialize(input: any): RouteInventoryModel {
    Object.assign(this, input);
    return this;
  }
}

export interface IRoute {
  id?: number;
  name: string;
  imageUrl?: string;
  destination: {
    id?: number;
    address: string;
  };
}

export interface IRouteBatch {
  id?: number;
  status: string;
  takeOff: string;
  capacity: number;
  batch: string;
  inUse?: number;
  riders?: Users[];
  cabDetails?: ICabInventory;
  driver?: IDriverModel;
  route: IRoute;
  homebase: IHomeBase;
}

export interface IEditRouteBatch {
  id?: number;
  status: string;
  takeOff: string;
  capacity: number;
  batch: string;
  name: string;
  inUse?: number;
  providerId?: number;
}

export interface IDeleteRouteResponse {
  success: boolean;
  message: string;
}
