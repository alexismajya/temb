"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleMapsHelpers_1 = require("../googleMapsHelpers");
describe('tests googleMapsHelpers', () => {
    describe('tests for GoogleMapsSuggestions', () => {
        let suggestedLocation;
        beforeEach(() => {
            suggestedLocation = new googleMapsHelpers_1.GoogleMapsLocationSuggestionOptions('test', 'location');
        });
        it('should instantiate the class GoogleMapsSuggestions', () => {
            expect(suggestedLocation).toBeInstanceOf(googleMapsHelpers_1.GoogleMapsLocationSuggestionOptions);
        });
    });
});
//# sourceMappingURL=googleMapsHelpers.spec.js.map