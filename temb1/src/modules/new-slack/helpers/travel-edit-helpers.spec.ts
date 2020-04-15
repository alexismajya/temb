import TravelEditHelpers from './travel-edit-helpers';
import {
    tripPayload, tripType, tripTypeAirportTransfer, tripPayloadEmpty, tripDetails,
    isEdit, isEditFalse, checkFlightResponse, checkFlightEmptyResponse,
    checkTripResponse, checkTripEmptyResponse, generatedOption,
} from './__mocks__';

describe('TravelEditHelpers', () => {
  describe('createTravelSummaryMenu', () => {
    it('should createTravelSummaryMenu Airport Transfer', (done) => {
      const modal = TravelEditHelpers.createTravelSummaryMenu(
                tripPayloadEmpty, tripTypeAirportTransfer,
            );
      expect(modal).toBeDefined();
      done();
    });

    it('should createTravelSummaryMenu Others', (done) => {
      const modal = TravelEditHelpers.createTravelSummaryMenu(tripPayload, tripType);
      expect(modal).toBeDefined();
      done();
    });
  });

  describe('checkIsEditFlightDetails', () => {
    it('should checkIsEditFlightDetails when isEdit', () => {
      const check = TravelEditHelpers.checkIsEditFlightDetails(tripDetails, isEdit);
      expect(check).toEqual(checkFlightResponse);
    });

    it('should checkIsEditFlightDetails', () => {
      const check = TravelEditHelpers.checkIsEditFlightDetails(tripDetails, isEditFalse);
      expect(check).toEqual(checkFlightEmptyResponse);
    });
  });

  describe('checkIsEditTripDetails', () => {
    it('should checkIsEditTripDetails', () => {
      const check = TravelEditHelpers.checkIsEditTripDetails(tripDetails, isEditFalse);
      expect(check).toEqual(checkTripEmptyResponse);
    });

    it('should checkIsEditTripDetails when isEdit', () => {
      const check = TravelEditHelpers.checkIsEditTripDetails(tripDetails, isEdit);
      expect(check).toEqual(checkTripResponse);
    });
  });

  describe('generateSelectedOption', () => {
    it('should generateSelectedOption', () => {
      const option = TravelEditHelpers.generateSelectedOption('test');
      expect(option).toEqual(generatedOption);
    });
  });
});
