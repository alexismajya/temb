import { of } from 'rxjs';
export var authServiceMock = {
    isAuthorized: true,
    authUrl: 'test-url',
    andelaAuthServiceToken: 'xxxxx',
    userInfo: 'testUser',
    isAuthenticated: false,
    http: {},
    verifyLogin: {}
};
export var mockAuthService = {
    andelaAuthServiceToken: '',
    isAuthorized: '',
    isAuthenticated: '',
    tembeaToken: '',
    currentUser: {},
    login: function () {
        return of({
            data: {
                isAuthorized: true
            }
        });
    },
    setCurrentUser: function () { },
    initClock: function () { },
    authorizeUser: function () { },
    unAuthorizeUser: function () { },
    setupClock: function () { },
    setAisToken: function () { },
};
//# sourceMappingURL=authService.mock.js.map