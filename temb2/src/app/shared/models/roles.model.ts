import { IHomeBase } from './homebase.model';

export interface IUserRole {
  email?: string;
  homebase?: IHomeBase;
  roleName?: string;
}

export class UserRoleModal implements IUserRole {
  constructor(
    public email?: string,
    public homebase?: IHomeBase,
    public roleName?: string,
  ) { }
}

export interface IUserRoleModal {
  email?: string;
  homebase?: IHomeBase;
  roleName?: string;
}

export interface IUsers {
  id: number;
  name: string;
  slackId: string;
  phoneNo: string;
  email: string;
  defaultDestinationId: number;
  routeBatchId: number;
  homebaseId: IHomeBase;
  roles: IUserRole;
 }

