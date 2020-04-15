import { of } from 'rxjs';

export const roleResponseMock = {
  success: true,
  message: 'true',
  roles: {
    id: 1,
    name: 'Admin',
    updatedAt: '2019-04-14T10:22:01.291Z',
    createdAt: '2019-04-14T10:22:01.291Z',
    email: 'john@doe.com',
    homebaseId: 5,
  }
};

export const userRolesMock = {
  id: 1,
  name: 'Patrick Ngabonziza',
  email: 'john.doe@gmail.com',
  phoneNo: '078593993',
  slackId: 'UPDQDRKPX',
  routeBatchId: 1,
  defaultDestinationId: 2,
  homebase: {
    name: 'Nairobi'
  },
  roles: [{ name: 'Super Admin'}]
};


export const newUserResponseMock = {
  success: true,
  message: 'User sucessfully added',
  user: {
    name: 'name',
    email: 'email',
    phoneNo: '12345678'
  }
};

export const newUserInfoMock = {
  slackUrl: 'slackUrl',
  email: 'email'
};

export const usersMock = {
  id: 13,
  name: 'Alexis Majyambere',
  slackId: 'UT0ELCS6M',
  phoneNo: null,
  email: 'alexis.majyambere@andela.com',
  defaultDestinationId: null,
  routeBatchId: null,
  homebaseId: 2,
  createdAt: '2020-01-30T09:56:52.512Z',
  updatedAt: '2020-02-05T13:07:32.942Z',
  homebase: {
    name: 'Nairobi'
  },
  roles: [
    {
      name: 'Super Admin',
      UserRole: {
        userId: 13,
        roleId: 1,
        homebaseId: 1,
        createdAt: '2020-02-17T16:05:42.166Z',
        updatedAt: '2020-02-17T16:05:42.166Z'
      }
    }
  ]
};
