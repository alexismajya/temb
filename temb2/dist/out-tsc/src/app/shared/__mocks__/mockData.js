export var mockActivatedRoute = {
    snapshot: {
        queryParams: {
            token: 'authToken'
        }
    }
};
export var mockRouter = {
    navigate: function () {
    }
};
export var mockToastr = {
    // @ts-ignore
    success: jest.fn(),
    // @ts-ignore
    warning: jest.fn(),
    // @ts-ignore
    info: jest.fn(),
    // @ts-ignore
    error: jest.fn()
};
export var mockCookieService = {
    delete: function () {
    },
    set: function () {
    }
};
//# sourceMappingURL=mockData.js.map