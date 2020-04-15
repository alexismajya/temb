import { IUser } from './user.interface';

export interface IFeedback {
  feedback: string;
  user?: IUser;
  userId: number;
}
