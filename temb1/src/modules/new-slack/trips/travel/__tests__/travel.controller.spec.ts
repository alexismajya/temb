import WebSocketEvents from '../../../../events/web-socket-event.service';
import { TravelTripController } from '../travel.controller';
import {
  dependencyMocks, payload, context, undefinedTripDetails,
  isEditFalse, tripDetails, cachedObject, tripType,
  airportPayload, embassyPayload,
} from '../__mocks__';
import travelTripActions from '../actions';
import cache from '../../../../shared/cache';
import TripEventsHandlers from '../../../../events/trip-events.handlers';
import socketIoMock from '../../../../slack/__mocks__/socket.ioMock';

const {
  actionRespond,
  modalRespond,
  bugsnagErrorHelperMock,
  travelHelpersMock,
  cacheMock,
  interactionsMock,
  rescheduleHelperMock,
  newSlackHelpersMock,
  departmentServiceMock,
  dateDialogHelperMock,
  utilsMock,
} = dependencyMocks;

describe(TravelTripController, () => {
  let travelTripController: TravelTripController;

  beforeEach(() => {
    travelTripController = new TravelTripController(bugsnagErrorHelperMock,
      travelHelpersMock, cacheMock, newSlackHelpersMock, interactionsMock,
      utilsMock, dateDialogHelperMock, departmentServiceMock,
      rescheduleHelperMock);
    jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
        () => (new WebSocketEvents(socketIoMock)),
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('TravelTripController.embassyVisit', () => {
    it('should send the embassy visit modal', async (done) => {
      await travelTripController.createTravel(embassyPayload);
      expect(cacheMock.save).toHaveBeenCalledTimes(1);
      expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
      expect(interactionsMock.sendContactDetailsModal).toHaveBeenCalledTimes(1);
      expect(interactionsMock.sendContactDetailsModal).toHaveBeenCalledWith(
        embassyPayload, undefinedTripDetails, isEditFalse,
      );
      done();
    });
  });

  describe('TravelTripController.cancel', () => {
    it('should cancel trip', (done) => {
      travelTripController.cancel(undefined, actionRespond);
      expect(interactionsMock.simpleTextResponse).toHaveBeenCalledTimes(1);
      expect(actionRespond).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.startTravelTripBooking', () => {
    it('should send travel start message', (done) => {
      travelTripController.startTravelTripBooking(payload, actionRespond);
      expect(travelHelpersMock.getStartMessage).toHaveBeenCalledTimes(1);
      expect(actionRespond).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.confirmRequest', () => {
    it('should confirm travel request', async (done) => {
      cacheMock.fetch.mockResolvedValue({});
      await travelTripController.confirmRequest(payload, actionRespond);
      expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
      expect(travelHelpersMock.processTripRequest).toHaveBeenCalledTimes(1);
      done();
    });
    it('should not confirm travel request if cache fetch fails', async (done) => {
      jest.spyOn(cacheMock, 'fetch').mockRejectedValue(new Error());
      expect(travelTripController.confirmRequest(payload, actionRespond)).rejects.toThrow();
      done();
    });
  });

  describe('TravelTripController.addTripNotes', () => {
    it('should send modal to add notes', async (done) => {
      await travelTripController.addTripNotes(payload, actionRespond);
      expect(interactionsMock.sendAddNoteModal).toHaveBeenCalledTimes(1);
      expect(actionRespond).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe(TravelTripController.prototype.getLocationInfo, () => {
    it('should get supplementary location info', async (done) => {
      cacheMock.fetch.mockResolvedValue({});
      await travelTripController.getLocationInfo(payload, actionRespond);
      expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
      expect(interactionsMock.sendLocationModal).toHaveBeenCalledTimes(1);
      expect(actionRespond).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe(TravelTripController.prototype.doneViewingTrip, () => {
    it('should handle done action', async (done) => {
      await travelTripController.doneViewingTrip(payload, actionRespond);
      expect(actionRespond).toHaveBeenCalledTimes(1);
      expect(travelHelpersMock.getCompletionResponse).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.submitContactDetails', () => {
    it('should handle contact details modal submission', async (done) => {
      cacheMock.fetch.mockResolvedValueOnce(cachedObject);
      await travelTripController.submitContactDetails(payload, {}, modalRespond, undefined);
      expect(newSlackHelpersMock.modalValidator).toHaveBeenCalledTimes(1);
      expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
      expect(travelHelpersMock.getTripDetailsModal).toHaveBeenCalledWith(
        payload, tripDetails, isEditFalse,
      );
      expect(modalRespond.update).toHaveBeenCalledTimes(1);
      expect(cacheMock.save).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.submitContactDetails', () => {
    it('should handle contact details modal submission', async (done) => {
      cacheMock.fetch.mockResolvedValueOnce(cachedObject);
      await travelTripController.submitContactDetails(payload, {}, modalRespond, undefined);
      expect(newSlackHelpersMock.modalValidator).toHaveBeenCalledTimes(1);
      expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
      expect(travelHelpersMock.getFlightDetailsModal).toHaveBeenCalledWith(
        payload,  tripDetails, isEditFalse,
      );
      expect(modalRespond.update).toHaveBeenCalledTimes(1);
      expect(cacheMock.save).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe(TravelTripController.prototype.submitTripDetails, () => {
    it('should handle trip detail modal submission', async (done) => {
      await travelTripController.submitTripDetails(payload, {}, modalRespond, context);
      expect(newSlackHelpersMock.modalValidator).toHaveBeenCalledTimes(1);
      expect(modalRespond.clear).toHaveBeenCalledTimes(1);
      expect(utilsMock.removeHoursFromDate).toHaveBeenCalledTimes(1);
      expect(dateDialogHelperMock.transformDate).toHaveBeenCalledTimes(2);
      expect(cacheMock.save).toHaveBeenCalledTimes(1);
      expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
      expect(travelHelpersMock.createTravelSummary).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.submitFlightDetails', () => {
    it('should handle flight details modal submission', async (done) => {
      await travelTripController.submitFlightDetails(payload, {}, modalRespond, context);
      expect(newSlackHelpersMock.modalValidator).toHaveBeenCalledTimes(1);
      expect(modalRespond.clear).toHaveBeenCalledTimes(1);
      expect(utilsMock.removeHoursFromDate).toHaveBeenCalledTimes(1);
      expect(dateDialogHelperMock.transformDate).toHaveBeenCalledTimes(2);
      expect(cacheMock.save).toHaveBeenCalledTimes(1);
      expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
      expect(travelHelpersMock.createTravelSummary).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe(TravelTripController.prototype.submitNotes, () => {
    let newPayload: any;
    beforeAll(() => {
      newPayload = {
        ...payload,
        view: {
          private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
        },
      };
    });
    it('should handle note modal submission', async (done) => {
      cacheMock.fetch.mockResolvedValue({});
      await travelTripController.submitNotes(newPayload, {}, modalRespond, context);
      expect(cacheMock.fetch).toHaveBeenCalledTimes(2);
      expect(cacheMock.save).toHaveBeenCalledTimes(1);
      expect(modalRespond.clear).toHaveBeenCalledTimes(1);
      expect(travelHelpersMock.createTravelSummary).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe(TravelTripController.prototype.submitLocationInfo, () => {
    let newPayload: any;
    beforeAll(() => {
      newPayload = {
        ...payload,
        view: {
          private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
        },
      };
    });
    it('should handle location info modal submission', async (done) => {
      cacheMock.fetch.mockResolvedValue({});
      await travelTripController.submitLocationInfo(newPayload, {}, modalRespond, undefined);
      expect(cacheMock.fetch).toHaveBeenCalledTimes(2);
      expect(cacheMock.save).toHaveBeenCalledTimes(1);
      expect(travelHelpersMock.processTripRequest).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.handleItineraryActions', () => {
    let newPayload: any;
    beforeAll(() => {
      newPayload = {
        ...payload,
        actions: [{
          action_id: travelTripActions.viewTrip,
          value: 2,
        }],
      };
    });
    it('should view confirmed trip request', async (done) => {
      await travelTripController.handleItineraryActions(newPayload, actionRespond);
      expect(actionRespond).toHaveBeenCalledTimes(1);
      done();
    });
    it('should handle reschedule trip', async (done) => {
      newPayload.actions[0].action_id = travelTripActions.reschedule;
      await travelTripController.handleItineraryActions(newPayload, modalRespond);
      expect(rescheduleHelperMock.sendTripRescheduleModal).toHaveBeenCalledTimes(1);
      done();
    });

    it('should handle goodbye message', async (done) => {
      newPayload.actions[0].action_id = '';
      await travelTripController.handleItineraryActions(newPayload, actionRespond);
      expect(interactionsMock.goodByeMessage).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.airportTransfer', () => {
    it('should send the airport transfer modal', async (done) => {
      await travelTripController.createTravel(airportPayload);
      expect(cacheMock.save).toHaveBeenCalledTimes(1);
      expect(interactionsMock.sendContactDetailsModal).toHaveBeenCalledTimes(1);
      expect(interactionsMock.sendContactDetailsModal).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.changeLocation', () => {
    it('should change location', async (done) => {
      await travelTripController.changeLocation(payload, actionRespond);
      expect(travelHelpersMock.changeLocation).toHaveBeenCalledTimes(1);
      expect(actionRespond).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.selectLocation', () => {
    it('should select location', async (done) => {
      await travelTripController.selectLocation(payload, actionRespond);
      expect(travelHelpersMock.selectLocation).toHaveBeenCalledTimes(1);
      expect(actionRespond).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelTripController.back', () => {
    let newPayload: any;
    beforeAll(() => {
      newPayload = {
        ...payload,
        actions: [{
          value: 'back_to_launch',
        }],
      };
    });
    it('should handle startMessage', async (done) => {
      await travelTripController.back(newPayload, actionRespond);
      expect(travelHelpersMock.getStartMessage).toHaveBeenCalledTimes(1);
      done();
    });
    it('should return to default value when there is no back value provided', async (done) => {
      newPayload.actions[0].value = '';
      await travelTripController.back(newPayload, actionRespond);
      done();
    });
  });
});
