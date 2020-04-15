export interface IUser {
  name: string;
  phoneNo: string;
  email: string;
  slackId: string;
  id?: number;
  homebaseId?: number;
  routeBatchId?: number;
}

export interface ISerializedUser {
  name: string;
  email: string;
  slackId: string;
}
