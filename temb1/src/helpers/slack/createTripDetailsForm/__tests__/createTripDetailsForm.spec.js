import createTripDetailsForm from '../index';
import {
  SlackDialogSelectElementWithOptions,
  SlackDialogText
} from '../../../../modules/slack/SlackModels/SlackDialogModels';

const locations = [
  'kissasi',
  'fusion'
];

describe('createTeamDetails create team details attachment', () => {
  describe('regularTripForm', () => {
    it('should return an array of length 3', () => {
      const tripDetails = createTripDetailsForm.regularTripForm(null, locations);
      expect(tripDetails instanceof Array).toBeTruthy();
      expect(tripDetails.length).toEqual(3);
    });

    it('should contain an entry with type SlackDialogSelectElementWithOptions', () => {
      const tripDetails = createTripDetailsForm.regularTripForm(null, locations);
      expect(tripDetails[1] instanceof SlackDialogSelectElementWithOptions).toBeTruthy();
      expect(tripDetails.length).toEqual(3);
    });

    it('should contain an entry with type SlackDialogText', () => {
      const tripDetails = createTripDetailsForm.regularTripForm(null, locations);
      expect(tripDetails[0] instanceof SlackDialogText).toBeTruthy();
      expect(tripDetails.length).toEqual(3);
    });
  });
  describe('tripDestinationLocationForm', () => {
    it('should return an array of length 2', () => {
      const tripDetails = createTripDetailsForm.tripDestinationLocationForm(null, locations);
      expect(tripDetails instanceof Array).toBeTruthy();
      expect(tripDetails.length).toEqual(2);
    });

    it('should contain an entry with type SlackDialogSelectElementWithOptions', () => {
      const tripDetails = createTripDetailsForm.tripDestinationLocationForm(null, locations);
      expect(tripDetails[0] instanceof SlackDialogSelectElementWithOptions).toBeTruthy();
      expect(tripDetails.length).toEqual(2);
    });

    it('should contain an entry with type SlackDialogText', () => {
      const tripDetails = createTripDetailsForm.tripDestinationLocationForm(null, locations);
      expect(tripDetails[1] instanceof SlackDialogText).toBeTruthy();
      expect(tripDetails.length).toEqual(2);
    });
  });

  describe('travelTripContactDetailsForm', () => {
    it('should return an array', () => {
      const tripDetails = createTripDetailsForm.travelTripContactDetailsForm(null, locations);
      expect(tripDetails instanceof Array).toBeTruthy();
      expect(tripDetails.length).toEqual(4);
    });
  });
  describe('travelTripFlightDetailsForm', () => {
    it('should return an array ', () => {
      const tripDetails = createTripDetailsForm.travelTripFlightDetailsForm(null, locations);
      expect(tripDetails instanceof Array).toBeTruthy();
      expect(tripDetails.length).toEqual(4);
    });
  });
  describe('travelEmbassyDetailsForm', () => {
    it('should return an array of length 5', () => {
      const tripDetails = createTripDetailsForm.travelEmbassyDetailsForm(null, null, { homeBaseEmbassies: locations });
      expect(tripDetails instanceof Array)
        .toBeTruthy();
      expect(tripDetails.length)
        .toEqual(4);
    });
  });
  describe('travelDestinationForm', () => {
    it('Should call SlackDialogSelectElementWithOptions and SlackDialogText', () => {
      const tripDetails = createTripDetailsForm.travelDestinationForm(null, locations);
      expect(tripDetails[0] instanceof SlackDialogSelectElementWithOptions).toBeTruthy();
      expect(tripDetails[1] instanceof SlackDialogText).toBeTruthy();
    });
  });
  describe('travelTripNoteForm', () => {
    it('should return an array of length of 1', () => {
      const tripDetails = createTripDetailsForm.travelTripNoteForm('value');
      expect(tripDetails instanceof Array)
        .toBeTruthy();
      expect(tripDetails[0].value).toEqual('value');
      expect(tripDetails.length).toEqual(1);
    });
  });
  
  describe('riderLocationConfirmationForm', () => {
    it('one element in the array', () => {
      const tripDetails = createTripDetailsForm.riderLocationConfirmationForm();
      expect(tripDetails instanceof Array)
        .toBeTruthy();
      expect(tripDetails.length).toEqual(1);
    });
  });
});
