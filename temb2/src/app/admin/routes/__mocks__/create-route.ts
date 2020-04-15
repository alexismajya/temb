import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MapsAPILoader } from '@agm/core';

export const googleMapsServiceMock: any = {
  loadGoogleMaps(): Promise<void> {
    return Promise.resolve();
  },
  getLocationAddressFromCoordinates(): Promise<any> {
    return Promise.resolve();
  },
  getLocationCoordinatesFromAddress(): Promise<any> {
    return Promise.resolve();
  },
  geocoder: '',
  mapLoader: '',
  initLibraries(element): Promise<void> {
    return Promise.resolve();
  },
  lookUpAddressOrCoordinates(): Promise<{}> {
    return Promise.resolve({});
  },
  retrieveLocationDetails() {},
  google: MapsAPILoader
};

export const routeServiceMock: any = {
  http: {},
  createRoute() {},
  handleError() {}
};

export const createRouteHelperMock: any = {
  incrementCapacity: _ => {},
  decrementCapacity: _ => {},
  validateFormEntries: _ => {},
  createNewRouteRequestObject: _ => {},
  notifyUser: _ => {}
};

export const routerMock: any = {
  navigate: _ => {}
};

export const toastrMock: any = {
  error: _ => {},
  success: _ => {}
};

export const httpMock: any = {
  post: _ => {}
};

export const navMenuServiceMock: any = {
  showProgress: _ => {},
  stopProgress: _ => {}
};

export const homebaseServiceMock: any = {
  getByName(): Subject<unknown> {
    return new BehaviorSubject('Kigali');
  }
};

export const locationServiceMock: any = {
  getById(): Observable<string> {
    return new BehaviorSubject('0.112003, 32.120099');
  }
};
export const routeInfo = {
  routeName: 'trial',
  takeOffTime: '23:00',
  capacity: 5,
  marker: undefined,
  provider: {
    id: 1,
    name: 'Move',
    channelId: 'CUKJ72AN9',
    email: 'rugumbirajordybastien@andela.com',
    phoneNo: '250785634111',
    notificationChannel: '0',
    providerUserId: 1,
    homebaseId: 3,
    verified: true,
    vehicles: [
      {
        id: 1,
        regNumber: '123',
        capacity: '5',
        model: 'Corona VS',
        color: 'White',
        providerId: 1,
        createdAt: '2020-02-27T09:05:28.460Z',
        updatedAt: '2020-02-27T09:05:28.460Z',
        deletedAt: null
      }
    ],
    drivers: [
      {
        id: 1,
        driverName: 'Fred',
        driverPhoneNo: '250785444777',
        driverNumber: '250785444777',
        providerId: 1,
        userId: 1,
        createdAt: '2020-02-27T09:04:59.759Z',
        updatedAt: '2020-02-27T09:04:59.759Z',
        deletedAt: null
      }
    ],
    user: {
      name: 'Jordy',
      phoneNo: null,
      email: 'rugumbirajordybastien@andela.com',
      slackId: 'USF6AGS8Y'
    },
    isDirectMessage: true
  },
  destinationInputField: 'git',
  destination: {
    address: 'git',
    coordinates: {
      lat: -1.2895473,
      lng: 36.75844439999999
    }
  }
};
