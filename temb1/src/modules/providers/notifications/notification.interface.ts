import { ProviderNotificationChannel } from '../../../database/models/provider';
import { IUser } from '../../../database/models/interfaces/user.interface';

export interface IProvider {
  id: number | string;
  name: string;
  email: string;
  notificationChannel: ProviderNotificationChannel;
  user: IUser;
  channelId: string;
  phoneNo: string;
}

export interface IProviderNotification {
  notifyNewTripRequest(provider: IProvider, tripDetails: any, teamDetails: any): Promise<void>;
  sendVerificationMessage(provider: IProvider, options: any): Promise<void>;
}

export interface ITripApprovalPayload {
  tripId: number | string;
  providerId: number | string;
  teamId: number | string;
}
