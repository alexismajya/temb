import { BehaviorSubject } from 'rxjs';
import { MapsAPILoader } from '@agm/core';
export var googleMapsServiceMock = {
    loadGoogleMaps: function () {
        return Promise.resolve();
    },
    getLocationAddressFromCoordinates: function () {
        return Promise.resolve();
    },
    getLocationCoordinatesFromAddress: function () {
        return Promise.resolve();
    },
    geocoder: '',
    mapLoader: '',
    initLibraries: function (element) {
        return Promise.resolve();
    },
    lookUpAddressOrCoordinates: function () {
        return Promise.resolve({});
    },
    retrieveLocationDetails: function () { },
    google: MapsAPILoader
};
export var routeServiceMock = {
    http: {},
    createRoute: function () { },
    handleError: function () { }
};
export var createRouteHelperMock = {
    incrementCapacity: function (_) { },
    decrementCapacity: function (_) { },
    validateFormEntries: function (_) { },
    createNewRouteRequestObject: function (_) { },
    notifyUser: function (_) { }
};
export var routerMock = {
    navigate: function (_) { }
};
export var toastrMock = {
    error: function (_) { },
    success: function (_) { }
};
export var httpMock = {
    post: function (_) { }
};
export var navMenuServiceMock = {
    showProgress: function (_) { },
    stopProgress: function (_) { }
};
export var homebaseServiceMock = {
    getByName: function () {
        return new BehaviorSubject('Kigali');
    }
};
export var locationServiceMock = {
    getById: function () {
        return new BehaviorSubject('0.112003, 32.120099');
    }
};
export var routeInfo = {
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
//# sourceMappingURL=create-route.js.map