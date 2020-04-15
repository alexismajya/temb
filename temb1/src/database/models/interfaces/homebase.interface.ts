import { IAddress } from './trip-request.interface';

export interface IHomebase {
  id?: number;
  name: string;
  channel: string;
  addressId: number;
  address: IAddress;
}
