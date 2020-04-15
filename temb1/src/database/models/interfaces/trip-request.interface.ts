import { IUser, ISerializedUser } from './user.interface';
import { IDriver } from './driver.interface';
import { ICab } from './cab.interface';
import { IDepartment } from './department.interface';
import { TripTypes, TripStatus } from '../trip-request';
import { ISerializedProvider } from './provider.interface';
import { IHomebase } from './homebase.interface';

export interface ITripRequest {
  id?: number;
  origin?: IAddress;
  destination?: IAddress;
  tripStatus: string;
  departureTime: string;
  reason: string;
  tripNote?: string;
  noOfPassengers: number;
  driver?: IDriver;
  cab?: ICab;
  riderId?: number;
  rider?: IUser;
  requestedById: number;
  approvedById: number;
  requester?: IUser;
  response_url?: string;
  tripType: string;
  approver?: IUser;
  department?: IDepartment;
  managerComment: string;
  createdAt?: string;
  distance: string;
  driverSlackId?: string;
}

interface IApprovalInfo {
  isApproved: boolean;
  approvedBy: string;
}

interface IReasonPayload {
  approvedReason: string;
}

export interface IAddress {
  id?: number;
  address: string;
}

export interface ISerializedTrip {
  id: number;
  name: string;
  status: TripStatus;
  arrivalTime: string;
  type: TripTypes;
  approvalDate: string;
  cab: ICab;
  driver: IDriver;
  homebase: IHomebase;
  rating: number;
  operationsComment: string;
  managerComment: string;
  distance: string;
  cabId: number;
  passenger: number;
  departureTime: string;
  requestedOn: string;
  department: string;
  destination: string;
  pickup: string;
  flightNumber: string;
  decliner: ISerializedUser;
  rider: ISerializedUser;
  requester: ISerializedUser;
  approvedBy: ISerializedUser;
  confirmedBy: ISerializedUser;
  provider: ISerializedProvider;
}
