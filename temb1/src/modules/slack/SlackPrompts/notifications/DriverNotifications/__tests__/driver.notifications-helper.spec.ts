import DriverNotificationsHelper from '../driver.notifications.helper';
import { Block } from '../../../../../new-slack/models/slack-block-models';
import { ITripRequest } from '../../../../../../database/models/interfaces/trip-request.interface';
import faker from 'faker';
import { IRouteBatch } from '../../../../../../database/models/interfaces/route-batch.interface';
import whatsappService from '../../../../../../modules/notifications/whatsapp/whatsapp.service';

export const testTripRequest = {
  origin: { address: 'Hello Origin' },
  destination: { address: 'Hello destination' },
  rider: { slackId: 'U1234', phoneNo: '+234181919201' },
  departureTime: faker.date.recent().toISOString(),
  distance: '23km',
  department: { name: 'Test Deparment' },
  driverSlackId: 'U12342',
  driver: {
    driverPhoneNo: '+2348190199230',
    driverName: 'Test Driver',
  },
  noOfPassengers: 2,
} as ITripRequest;

export const testRouteBatch = {
  takeOff: '14:00',
  route: {
    name: 'testRoute',
  },
  driver: {
    user: {
      slackId: 'U2321',
    },
  },
} as IRouteBatch;

describe(DriverNotificationsHelper, () => {
  describe(DriverNotificationsHelper.tripApprovalAttachment, () => {
    it('should return trip attachement for driver', () => {
      const blocks = DriverNotificationsHelper.tripApprovalAttachment(testTripRequest);
      expect(blocks[0]).toBeInstanceOf(Block);
    });
  });

  describe(DriverNotificationsHelper.routeApprovalAttachment, () => {
    it('should return route attachement for the driver', () => {
      const blocks = DriverNotificationsHelper.routeApprovalAttachment(testRouteBatch);
      expect(blocks[0]).toBeInstanceOf(Block);
    });
  });

  describe(DriverNotificationsHelper.notifyDriverOnWhatsApp, () => {
    it('should send Driver Trip notification 10 min ahead', async () => {
      jest.spyOn(whatsappService, 'send').mockResolvedValue(null);

      await DriverNotificationsHelper.notifyDriverOnWhatsApp(testTripRequest);
      expect(whatsappService.send).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.stringContaining(testTripRequest.destination.address),
        to: testTripRequest.driver.driverPhoneNo,
      }));
    });
  });
});
