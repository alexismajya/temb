import DriverService from '../../../../../drivers/driver.service';
import DriverNotifications from '../driver.notifications';
import { teamDetailsService } from '../../../../../teamDetails/teamDetails.service';
import Notifications from '../../../Notifications';
import { ITripRequest } from '../../../../../../database/models/interfaces/trip-request.interface';
import { IRouteBatch } from '../../../../../../database/models/interfaces/route-batch.interface';
import faker from 'faker';
import { TripStatus, TripTypes } from '../../../../../../database/models/trip-request';
import { IUser } from '../../../../../../database/models/interfaces/user.interface';
import whatsappService from '../../../../../../modules/notifications/whatsapp/whatsapp.service';

const testUser : IUser = {
  id: 2,
  name: 'MyName',
  phoneNo: faker.phone.phoneNumber(),
  email: faker.internet.email(),
  slackId:'SDCFFJ',
};

const testTripInfo: ITripRequest = {
  id: 1,
  origin: { address: faker.address.streetAddress() },
  destination: { address: faker.address.streetAddress() },
  tripStatus: TripStatus.approved,
  departureTime: faker.date.future().toISOString(),
  reason: faker.lorem.words(5),
  tripNote: faker.lorem.paragraphs(2),
  noOfPassengers: faker.random.number(10),
  driver: {
    id: 1,
    driverName: faker.name.firstName(),
    providerId: 2,
    driverPhoneNo:'+250223232344',
    userId: 3,
    user: { slackId: 'U1234' },
  },
  cab: { id: 1, capacity: 4, regNumber: faker.random.uuid(),
    model: faker.lorem.word(), providerId: 2 },
  riderId: testUser.id,
  rider: testUser,
  requestedById: testUser.id,
  requester: testUser,
  response_url: 'hello',
  tripType: TripTypes.regular,
  approver: testUser,
  department: { id: 1, name: 'Hello', headId: testUser.id, homebaseId: 2, teamId: 'T12' },
  managerComment: faker.lorem.words(5),
  createdAt: faker.date.future().toISOString(),
  distance: '2.3km',
  driverSlackId: 'UKJKDL',
} as ITripRequest;

const testRouteBatchInfo: IRouteBatch = {
  id: 1,
  takeOff: '1:30',
  batch: 'A',
  driver: {
    id: 1,
    driverName: 'MyName',
    driverPhoneNo: '+250734343433',
    userId: 11,
    user: {
      name:'MyName',
      phoneNo: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      slackId: faker.random.alphaNumeric(6).toLocaleUpperCase(),
    },
  },
  providerId: 11,
  cabDetails: { id: 1, capacity: 4, regNumber: faker.random.uuid(),
    model: faker.lorem.word(), providerId: 2 },
  route: { id:1, name: 'Route 1', imageUrl: 'hello', destinationId: 2, homebaseId: 3 },
};

const testRouteBatchInfo2: IRouteBatch = {
  id: 1,
  takeOff: '1:30',
  batch: 'A',
  driver: {
    id: 1,
    driverName: 'MyName',
    driverPhoneNo: '+250734343433',
    user: {
      name:'MyName',
      phoneNo: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      slackId: faker.random.alphaNumeric(6).toLocaleUpperCase(),
    },
  },
  providerId: 11,
  cabDetails: { id: 1, capacity: 4, regNumber: faker.random.uuid(),
    model: faker.lorem.word(), providerId: 2 },
  route: { id:1, name: 'Route 1', imageUrl: 'hello', destinationId: 2, homebaseId: 3 },
};

describe(DriverNotifications, () => {
  const validateWaMessage = (driver: any) => expect.objectContaining({
    to: driver.driverPhoneNo,
    body: expect.stringContaining(driver.driverName),
  });

  beforeEach(() => {
    jest.spyOn(Notifications, 'sendNotification').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe(DriverNotifications.sendDriverTripApproveOnSlack, () => {
    const testChannel = 'C10JKA';
    const testToken = 'xoxp-1134';
    beforeEach(() => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue(testToken);
      jest.spyOn(Notifications, 'getDMChannelId').mockResolvedValue(testChannel);
      jest.spyOn(Notifications, 'sendNotification').mockResolvedValue(null);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should send Driver Trip ApproveNotification', async () => {
      await DriverNotifications.sendDriverTripApproveOnSlack('team', testTripInfo, 'UGGSa');
      expect(Notifications.sendNotification).toHaveBeenCalledWith(expect.objectContaining({
        channel: testChannel,
      }), testToken);
    });
  });

  describe(DriverNotifications.checkAndNotifyDriver, () => {
    beforeEach(() => {
      jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue({ botToken: 'token' });
      jest.spyOn(DriverService, 'findOneDriver').mockResolvedValue(testTripInfo.driver);
      jest.spyOn(DriverNotifications, 'checkAndNotifyDriver');
      jest.spyOn(DriverNotifications, 'sendDriverTripApproveOnSlack').mockResolvedValue(null);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should check and notify driver if they have a userId', async () => {
      await DriverNotifications.checkAndNotifyDriver(testTripInfo.driver.id, 'UYDAA', testTripInfo);
      expect(DriverNotifications.sendDriverTripApproveOnSlack).toBeCalled();
    });

    it('should not notify driver if they dont have a userId', async () => {
      const driver = { id: 1 };
      jest.spyOn(DriverService, 'findOneDriver').mockResolvedValueOnce(driver);
      await DriverNotifications.checkAndNotifyDriver(driver.id, 'UYDAA', testTripInfo);
      expect(DriverNotifications.sendDriverTripApproveOnSlack).not.toBeCalled();
    });

    it('should notify driver via whatsapp', async () => {
      jest.spyOn(whatsappService, 'send').mockResolvedValue(null);
      jest.spyOn(DriverService, 'findOneDriver').mockResolvedValueOnce({
        ...testTripInfo.driver, userId: undefined,
      });
      await DriverNotifications.checkAndNotifyDriver(testTripInfo.driver.id, 'UYDAA', testTripInfo);
      expect(whatsappService.send).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.stringContaining(testTripInfo.destination.address),
        to: testTripInfo.driver.driverPhoneNo,
      }));
    });
  });

  describe(DriverNotifications.getTripAssignmentWhatsappMessage, () => {
    it('getTripAssignmentWhatsappMessage', () => {
      const attachment = DriverNotifications
      .getTripAssignmentWhatsappMessage(testUser, testTripInfo);
      expect(attachment).toBeDefined();
    });
  });

  describe(DriverNotifications.getRouteAssignmentWhatsappMessage, () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should send driver WhatsApp notification about assigned route', async () => {
      const result = await DriverNotifications
        .getRouteAssignmentWhatsappMessage(testRouteBatchInfo);
      expect(result).toEqual(validateWaMessage(testRouteBatchInfo.driver));
    });
  });

  describe(DriverNotifications.sendRouteAssignment, () => {
    const channel = 'CM123JJ';
    beforeEach(async () => {
      jest.spyOn(DriverNotifications, 'sendRouteAssignment');
      jest.spyOn(Notifications, 'getDMChannelId').mockResolvedValue(channel);
      jest.spyOn(Notifications, 'sendNotification').mockResolvedValue(null);
    });

    afterEach(async () => {
      jest.clearAllMocks();
    });

    it('should send Driver slack notification about route assignment if they have a userId',
      async () => {
        const testToken = 'token';
        await DriverNotifications.sendRouteAssignment(testRouteBatchInfo, testToken);
        expect(Notifications.sendNotification).toBeCalledWith(expect.objectContaining({
          channel,
        }), testToken);
      });

    it('should not send notification to the driver once there something wrong', async() => {
      expect(DriverNotifications.sendRouteAssignment(null, 'token')).rejects.toThrow();
    });

    it('should send Driver whatsapp notification about route assignment once they do not have a userId',
      async () => {
        jest.spyOn(whatsappService, 'send').mockResolvedValue(null);
        await DriverNotifications.sendRouteAssignment(testRouteBatchInfo2, 'token');
        expect(whatsappService.send)
          .toHaveBeenCalledWith(validateWaMessage(testRouteBatchInfo2.driver));
      });
  });
});
