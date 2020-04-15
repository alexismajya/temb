import travelHelpers from './travel-helpers';
import {
    isEdit, pickupSelect, destinationSelect, cachedFlightNumber,
    cachedDate, cachedTime, cachedReason, isEditFalse,
    expectedViewIsEditTrue, expectedViewIsEditFalse,
} from './__mocks__';

describe('SlackTravelHelpers', () => {
  it('should generate Flight Details Modal when isEdit', (done) => {
    const modal = travelHelpers.generateFlightDetailsModal(
        isEdit, pickupSelect, destinationSelect,
        cachedFlightNumber, cachedDate, cachedTime, cachedReason,
    );
    expect(modal).toBeDefined();
    expect(modal).toEqual(expectedViewIsEditTrue);
    done();
  });
  it('should generate Flight Details Modal when is not edit', (done) => {
    const modal = travelHelpers.generateFlightDetailsModal(
        isEditFalse, pickupSelect, destinationSelect,
        cachedFlightNumber, cachedDate, cachedTime, cachedReason,
    );
    expect(modal).toBeDefined();
    done();
  });
});
