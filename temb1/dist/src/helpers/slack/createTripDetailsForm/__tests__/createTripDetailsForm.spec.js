"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const SlackDialogModels_1 = require("../../../../modules/slack/SlackModels/SlackDialogModels");
const locations = [
    'kissasi',
    'fusion'
];
describe('createTeamDetails create team details attachment', () => {
    describe('regularTripForm', () => {
        it('should return an array of length 3', () => {
            const tripDetails = index_1.default.regularTripForm(null, locations);
            expect(tripDetails instanceof Array).toBeTruthy();
            expect(tripDetails.length).toEqual(3);
        });
        it('should contain an entry with type SlackDialogSelectElementWithOptions', () => {
            const tripDetails = index_1.default.regularTripForm(null, locations);
            expect(tripDetails[1] instanceof SlackDialogModels_1.SlackDialogSelectElementWithOptions).toBeTruthy();
            expect(tripDetails.length).toEqual(3);
        });
        it('should contain an entry with type SlackDialogText', () => {
            const tripDetails = index_1.default.regularTripForm(null, locations);
            expect(tripDetails[0] instanceof SlackDialogModels_1.SlackDialogText).toBeTruthy();
            expect(tripDetails.length).toEqual(3);
        });
    });
    describe('tripDestinationLocationForm', () => {
        it('should return an array of length 2', () => {
            const tripDetails = index_1.default.tripDestinationLocationForm(null, locations);
            expect(tripDetails instanceof Array).toBeTruthy();
            expect(tripDetails.length).toEqual(2);
        });
        it('should contain an entry with type SlackDialogSelectElementWithOptions', () => {
            const tripDetails = index_1.default.tripDestinationLocationForm(null, locations);
            expect(tripDetails[0] instanceof SlackDialogModels_1.SlackDialogSelectElementWithOptions).toBeTruthy();
            expect(tripDetails.length).toEqual(2);
        });
        it('should contain an entry with type SlackDialogText', () => {
            const tripDetails = index_1.default.tripDestinationLocationForm(null, locations);
            expect(tripDetails[1] instanceof SlackDialogModels_1.SlackDialogText).toBeTruthy();
            expect(tripDetails.length).toEqual(2);
        });
    });
    describe('travelTripContactDetailsForm', () => {
        it('should return an array', () => {
            const tripDetails = index_1.default.travelTripContactDetailsForm(null, locations);
            expect(tripDetails instanceof Array).toBeTruthy();
            expect(tripDetails.length).toEqual(4);
        });
    });
    describe('travelTripFlightDetailsForm', () => {
        it('should return an array ', () => {
            const tripDetails = index_1.default.travelTripFlightDetailsForm(null, locations);
            expect(tripDetails instanceof Array).toBeTruthy();
            expect(tripDetails.length).toEqual(4);
        });
    });
    describe('travelEmbassyDetailsForm', () => {
        it('should return an array of length 5', () => {
            const tripDetails = index_1.default.travelEmbassyDetailsForm(null, null, { homeBaseEmbassies: locations });
            expect(tripDetails instanceof Array)
                .toBeTruthy();
            expect(tripDetails.length)
                .toEqual(4);
        });
    });
    describe('travelDestinationForm', () => {
        it('Should call SlackDialogSelectElementWithOptions and SlackDialogText', () => {
            const tripDetails = index_1.default.travelDestinationForm(null, locations);
            expect(tripDetails[0] instanceof SlackDialogModels_1.SlackDialogSelectElementWithOptions).toBeTruthy();
            expect(tripDetails[1] instanceof SlackDialogModels_1.SlackDialogText).toBeTruthy();
        });
    });
    describe('travelTripNoteForm', () => {
        it('should return an array of length of 1', () => {
            const tripDetails = index_1.default.travelTripNoteForm('value');
            expect(tripDetails instanceof Array)
                .toBeTruthy();
            expect(tripDetails[0].value).toEqual('value');
            expect(tripDetails.length).toEqual(1);
        });
    });
    describe('riderLocationConfirmationForm', () => {
        it('one element in the array', () => {
            const tripDetails = index_1.default.riderLocationConfirmationForm();
            expect(tripDetails instanceof Array)
                .toBeTruthy();
            expect(tripDetails.length).toEqual(1);
        });
    });
});
//# sourceMappingURL=createTripDetailsForm.spec.js.map