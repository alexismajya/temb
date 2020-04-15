import WebSocketEvents from '../../../../events/web-socket-event.service';
import { TravelHelpers } from '../travel.helpers';
import {
  dependencyMocks, payload, tripPayload, expectedBlocks, expectedPreview, newExpectedPreview,
  isEditTrue, tripDetails,
} from '../__mocks__';
import TripEventsHandlers from '../../../../events/trip-events.handlers';
import socketIoMock from '../../../../slack/__mocks__/socket.ioMock';

const {
  homebaseServiceMock,
  addressServiceMock,
  newSlackHelpersMock,
  teamDetailsServiceMock,
  appEventsMock,
  cacheMock,
  tripServiceMock,
  tripDetailsServiceMock,
  userServiceMock,
  slackHelpersMock,
} = dependencyMocks;

describe(TravelHelpers, () => {
  let travelHelpers: TravelHelpers;

  beforeEach(() => {
    travelHelpers = new TravelHelpers(addressServiceMock, newSlackHelpersMock, homebaseServiceMock,
      slackHelpersMock, cacheMock, tripServiceMock, teamDetailsServiceMock, tripDetailsServiceMock,
      userServiceMock, appEventsMock);
    jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
        () => (new WebSocketEvents(socketIoMock)),
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('TravelHelpers.getStartMessage', () => {
    it('should get start message', async (done) => {
      const message = await travelHelpers.getStartMessage('UJDGHF77');
      expect(newSlackHelpersMock.getHomeBaseMessage).toHaveBeenCalledTimes(1);
      expect(message).toEqual(expectedBlocks);
      done();
    });
  });

  describe(TravelHelpers.prototype.getTripDetailsModal, () => {
    let newPayload: any;
    beforeAll(() => {
      newPayload = {
        ...payload,
        view: {
          private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
        },
      };
    });
    it('should get trip details modal', async (done) => {
      const modal = await travelHelpers.getTripDetailsModal(newPayload);
      expect(modal).toBeDefined();
      done();
    });
    it('should get trip details modal when isEdit', async (done) => {
      const modal = await travelHelpers.getTripDetailsModal(newPayload, tripDetails, isEditTrue);
      expect(modal).toBeDefined();
      done();
    });
  });

  describe(TravelHelpers.prototype.createTravelSummary, () => {
    it('should create travel summary', async (done) => {
      const summary = await travelHelpers.createTravelSummary(tripPayload, 'UX8083BH7');
      expect(summary).toEqual(newExpectedPreview);
      done();
    });
  });

  describe('TravelHelpers.processTripRequest', () => {
    it('should process trip requests', async (done) => {
      await travelHelpers.processTripRequest(tripPayload,
        { teamId: 'TD09WJ89', userId: 'U947HYT8' }, payload.response_url);
      expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
      expect(appEventsMock.broadcast).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserBySlackId).toHaveBeenCalledTimes(2);
      expect(addressServiceMock.findOrCreateAddress).toHaveBeenCalledTimes(2);
      expect(tripDetailsServiceMock.createDetails).toHaveBeenCalledTimes(1);
      expect(tripServiceMock.createRequest).toHaveBeenCalledTimes(1);
      expect(cacheMock.save).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TravelHelpers.sendRiderlocationConfirmNotification', () => {
    it('should send notification to rider to get location info', async (done) => {
      await travelHelpers.sendRiderlocationConfirmNotification(tripPayload);
      done();
    });
  });
  describe('TripHelpers.cancelTrip', () => {
    const tripId = 4;
    it('should cancel booked trip', async (done) => {
      await travelHelpers.cancelTrip(payload, tripId);
      expect(tripServiceMock.getById).toHaveBeenCalledTimes(1);
      expect(appEventsMock.broadcast).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TripHelpers.selectLocation', () => {
    it('should handle select location', async (done) => {
      await travelHelpers.selectLocation(payload);
      expect(userServiceMock.updateDefaultHomeBase).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('TripHelpers.changeLocation', () => {
    it('should handle change location', async (done) => {
      await travelHelpers.changeLocation(payload);
      expect(homebaseServiceMock.getAllHomebases).toHaveBeenCalledTimes(1);
      expect(homebaseServiceMock.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
      expect(homebaseServiceMock.filterHomebase).toHaveBeenCalledTimes(1);
      expect(newSlackHelpersMock.getNavBlock).toHaveBeenCalledTimes(1);
      done();
    });
  });
  describe('TripHelpers.getFlightDetailsModal', () => {
    let newPayload: any;
    beforeAll(() => {
      newPayload = {
        ...payload,
        view: {
          private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
        },
      };
    });
    it('should get flight details modal', async (done) => {
      await travelHelpers.getFlightDetailsModal(newPayload);
      expect(homebaseServiceMock.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
      expect(addressServiceMock.getAddressListByHomebase).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
