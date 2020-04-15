export var mapsAPILoaderMock = {
    load: function (_) { return Promise.resolve({}); },
};
export var mockWindowObject = function () {
    window['google'] = {
        maps: {
            Geocoder: /** @class */ (function () {
                function Geocoder() {
                }
                return Geocoder;
            }()),
            places: {
                Autocomplete: /** @class */ (function () {
                    function Autocomplete() {
                    }
                    return Autocomplete;
                }())
            }
        }
    };
};
export var mockCoordinates = { lat: -1.87637, lng: 36.89373 };
export var mockAddress = '5, alien road, Pluto Ticket Point, Jupitar.';
export var mockResponse = {
    formatted_address: mockAddress,
    geometry: {
        location: {
            lat: function () { return mockCoordinates.lat; },
            lng: function () { return mockCoordinates.lng; }
        }
    }
};
//# sourceMappingURL=googlemaps.mock.js.map