import WebSocketEvents from '../../../events/web-socket-event.service';
import TripCabController from '../TripCabController';
import SlackInteractions from '../../SlackInteractions';
import { mockWhatsappOptions } from '../../../notifications/whatsapp/twilio.mocks';
import TripEventsHandlers from '../../../events/trip-events.handlers';
import socketIoMock from '../../__mocks__/socket.ioMock';

mockWhatsappOptions();

describe('TripCabController', () => {
  let respond;
  beforeEach(() => {
    jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
      () => (new WebSocketEvents(socketIoMock))
    );
    respond = jest.fn();
  });
  it('should send create cab Attacment', (done) => {
    const payload = {
      state: JSON.stringify({}),
      submission: {
        confirmationComment: 'comment'
      }
    };
    const result = TripCabController.sendCreateCabAttachment(payload, 'operations_approval_trip', null);
    expect(result.text).toEqual('*Proceed to Create New Cab*');
    done();
  });
  
  it('should handle provider assignment submission', (done) => {
    const data = {
      submission: {
        provider: 'DbrandTaxify, 1, UXTXFY'
      }
    };
    const handleTripActionsSpy = jest.spyOn(SlackInteractions, 'handleTripActions');
    TripCabController.handleSelectProviderDialogSubmission(data, respond);
    expect(handleTripActionsSpy).toHaveBeenCalled();
    done();
  });
});
