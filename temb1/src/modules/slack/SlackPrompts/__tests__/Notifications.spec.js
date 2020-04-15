import { IncomingWebhook } from '@slack/client';
import SlackNotifications from '../Notifications';
import { SlackEvents } from '../../events/slackEvents';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import WebClientSingleton from '../../../../utils/WebClientSingleton';
import NotificationsResponse from '../NotificationsResponse';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import { departmentService } from '../../../departments/department.service';
import RouteRequestService from '../../../routes/route-request.service';
import { mockRouteRequestData } from '../../../../services/__mocks__/index';
import Services from '../../../users/user.service';
import tripService from '../../../trips/trip.service';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import Cache from '../../../shared/cache';
import { homebaseService } from '../../../homebases/homebase.service';
import { mockWhatsappOptions } from '../../../notifications/whatsapp/twilio.mocks';
import { MarkdownText, BlockMessage } from '../../../new-slack/models/slack-block-models';
import { TripTypes } from '../../../../database/models/trip-request';
import Interactions from '../../../new-slack/trips/manager/interactions';
import providerMonthlyReport from '../../../report/providerMonthlyReport';

mockWhatsappOptions();

const tripInitial = {
  id: 2,
  requestId: null,
  departmentId: 23,
  tripStatus: 'Approved',
  destination: { address: 'Dubai' },
  origin: { address: 'New York' },
  pickup: { },
  departureDate: null,
  requestDate: new Date(),
  requester: { slackId: '1234' },
  requestedById: 6,
  riderId: 6,
  rider: { slackId: '3456' },
  homebase: { channel: 'HU123' },
  decliner: { slackId: 'U1727U' },
  driver: { id: 767 },
  department: { headId: 3, head: { id: 4, slackId: 'U234' } },
  cab: {
    driverName: 'Dave',
    driverPhoneNo: '6789009876',
    regNumber: 'JK 321 LG'
  }
};

jest.spyOn(SlackEvents, 'raise').mockReturnValue();

const webClientMock = {
  im: {
    open: jest.fn().mockImplementation(({ user }) => Promise.resolve({
      channel: { id: `${user}${419}` }
    }))
  },
  chat: {
    postMessage: jest.fn().mockImplementation((data) => Promise.resolve({ data })),
  },
  users: {
    info: jest.fn().mockResolvedValue({
      user: { real_name: 'someName', profile: { email: 'someemial@email.com' } },
      token: 'sdf'
    }),
    profile: {
      get: jest.fn().mockResolvedValue({
        profile: {
          tz_offset: 'someValue',
          email: 'sekito.ronald@andela.com'
        }
      })
    }
  },
};

const dbRider = {
  id: 275,
  slackId: '456FDRF',
  name: 'rider Paul',
  phoneNo: null,
  email: 'rider@andela.com',
  defaultDestinationId: null,
  routeBatchId: null,
  createdAt: '2019-03-05T19:32:17.426Z',
  updatedAt: '2019-03-05T19:32:17.426Z'
};

const botToken = 'xoxop-11267';
const teamDetails = {
  botToken: 'just a token',
  webhookConfigUrl: 'just a url',
  opsChannelId: 'S199'
};

const initSpy = () => {
  const mockUser = { slackId: 3 };
  const mockDept = { name: 'Tembea DTP' };
  const result = ['12/2/2019', '12/12/2020', 'Mastercard'];
  jest.spyOn(WebClientSingleton, 'getWebClient').mockReturnValue(webClientMock);
  jest.spyOn(Cache, 'fetch').mockResolvedValue(result);
  jest.spyOn(departmentService, 'getById').mockResolvedValue(mockDept);
  jest.spyOn(departmentService, 'getHeadByDeptId').mockResolvedValue(mockDept);
  jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId').mockResolvedValue(mockUser);
  jest.spyOn(WebClientSingleton, 'getWebClient').mockReturnValue(webClientMock);
  jest.spyOn(IncomingWebhook.prototype, 'send').mockResolvedValue(true);
  jest.spyOn(Services, 'findOrCreateNewUserWithSlackId').mockResolvedValue(dbRider);
  jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ channel: 'BBBBBB' });
  jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue(teamDetails);
  jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue(botToken);
  jest.spyOn(tripService, 'getById').mockResolvedValue(tripInitial);
  jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue(null);
  jest.spyOn(SlackNotifications, 'sendNotifications').mockResolvedValue(null);
  jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('YES');
};

describe(SlackNotifications, () => {
  beforeEach(() => {
    initSpy();
    const mockUser = { slackId: 3 };
    const result = ['12/2/2019', '12/12/2020', 'Mastercard'];
    jest.spyOn(Cache, 'fetch').mockResolvedValue(result);
    jest.spyOn(departmentService, 'getById').mockResolvedValue(mockUser);
    jest.spyOn(departmentService, 'getHeadByDeptId').mockResolvedValue(mockUser);
    jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId').mockResolvedValue(mockUser);
    jest.spyOn(WebClientSingleton, 'getWebClient').mockReturnValue(webClientMock);
    jest.spyOn(IncomingWebhook.prototype, 'send').mockResolvedValue(true);
    jest.spyOn(Services, 'findOrCreateNewUserWithSlackId').mockResolvedValue(dbRider);
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ channel: 'BBBBBB' });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe(SlackNotifications.getDMChannelId, () => {
    it('return an id as received from slack', async () => {
      jest.restoreAllMocks();
      jest.spyOn(WebClientSingleton, 'getWebClient').mockReturnValue(webClientMock);

      const slackId = 'U123';
      const channelId = await SlackNotifications.getDMChannelId(slackId, botToken);

      expect(WebClientSingleton.getWebClient).toBeCalledWith(botToken);
      expect(channelId).toEqual(expect.stringContaining(slackId));
    });
  });

  describe(SlackNotifications.sendNotification, () => {
    it('should send notification', async () => {
      jest.restoreAllMocks();
      jest.spyOn(WebClientSingleton, 'getWebClient').mockReturnValue(webClientMock);

      const testResponse = { channel: { id: 'XXXXXX' } };
      await SlackNotifications.sendNotification(testResponse, botToken);
      expect(WebClientSingleton.getWebClient).toHaveBeenCalledWith(botToken);
    });
  });

  describe(SlackNotifications.createUserConfirmOrDeclineMessage, () => {
    it('should send notification to user when ride has been confirmed', async () => {
      const res = await SlackNotifications.createUserConfirmOrDeclineMessage(true, 'Confirmed');
      expect(res).toEqual('Your trip has been Confirmed, and it is awaiting driver and vehicle assignment');
    });

    it('should send notification to user when ride has been confirmed', async () => {
      const res = await SlackNotifications.createUserConfirmOrDeclineMessage(false, 'declined');
      expect(res).toEqual('Your trip has been declined');
    });
  });

  describe(SlackNotifications.sendRequesterDeclinedNotification, () => {
    beforeEach(() => {
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue(null);
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('YES');
    });

    it('should send error on decline', async () => {
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockRejectedValue();
      jest.spyOn(bugsnagHelper, 'log').mockResolvedValue(null);

      const tripInfo = { ...tripInitial };
      await SlackNotifications.sendRequesterDeclinedNotification(tripInfo, botToken);

      expect(bugsnagHelper.log).toBeCalled();
    });

    it('should send decline notification', async () => {
      const tripInfo = { ...tripInitial, riderId: 123, requestedById: 299 };

      await SlackNotifications.sendRequesterDeclinedNotification(tripInfo, botToken);

      expect(SlackNotifications.sendNotification).toBeCalledTimes(2);
    });
  });

  describe(SlackNotifications.sendManagerConfirmOrDeclineNotification, () => {
    beforeEach(() => {
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue(null);
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('YES');
    });

    it('should send manager notification', async () => {
      const tripInfo = {
        department: { headId: 3 },
        rider: { slackId: 3 },
        origin: { address: 'never land' },
        destination: { address: 'never land' },
        cab: {
          driverName: 'Sunday',
          driverPhoneNo: '001001001',
          regNumber: '1928dfsgg'
        }
      };
      const [userId, teamId] = [3, 'HAHJDILYR'];
      const declineStatus = false;

      await SlackNotifications.sendManagerConfirmOrDeclineNotification(
        teamId, userId, tripInfo, declineStatus
      );

      expect(SlackNotifications.sendNotification)
        .toHaveBeenCalledWith(expect.any(Object), botToken);
    });

    it('should send manager confirmation notification', async () => {
      const tripInfo = { ...tripInitial };

      const payload = {
        user: { id: 3 },
        team: { id: 'HAHJDILYR' },
        submission: {
          driverName: 'driverName', driverPhoneNo: 'driverPhoneNo', regNumber: 'regNumber'
        }
      };
      const { user: { id: userId }, team: { id: teamId } } = payload;
      const declineStatus = true;
      await SlackNotifications.sendManagerConfirmOrDeclineNotification(
        teamId, userId, tripInfo, declineStatus
      );
      expect(SlackNotifications.sendNotification)
        .toHaveBeenCalledWith(expect.any(Object), botToken);
    });
  });

  describe(SlackNotifications.sendWebhookPushMessage, () => {
    it('should call IncomingWebhook send method', async () => {
      const [webhookUrl, message] = ['https://hello.com', 'Welcome to tembea'];
      const result = await SlackNotifications.sendWebhookPushMessage(webhookUrl, message);
      expect(IncomingWebhook.prototype.send).toHaveBeenCalledWith(message);
      expect(result).toBeTruthy();
    });
  });

  describe(SlackNotifications.sendUserConfirmOrDeclineNotification, () => {
    const opsStatus = true;
    const payload = {
      user: { id: 3 },
      team: { id: 'HAHJDILYR' },
      submission: {
        driverName: 'driverName', driverPhoneNo: 'driverPhoneNo', regNumber: 'regNumber'
      }
    };

    beforeEach(() => {
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue(null);
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('YES');
    });

    const { user: { id: userId }, team: { id: teamId } } = payload;
    it('should send user notification once when requester is equal to rider', async () => {
      const testT = { ...tripInitial };
      testT.rider.slackId = 3;
      const res = await SlackNotifications.sendUserConfirmOrDeclineNotification(teamId,
        userId, testT, false, opsStatus);
      expect(res).toEqual(undefined);
    });

    it('should send user notification twice when requester is not equal to rider', async () => {
      const testT = { ...tripInitial };
      testT.rider.slackId = 4;
      const res = await SlackNotifications.sendUserConfirmOrDeclineNotification(
        teamId, userId, testT, false, opsStatus
      );
      expect(res).toEqual(undefined);
    });
  });
  describe(SlackNotifications.sendOperationsTripRequestNotification, () => {
    let sendRequesterApprovedNotification;
    const testTrip = { ...tripInitial, tripType: TripTypes.regular };
    beforeEach(() => {
      jest.spyOn(SlackNotifications, 'sendNotification');
      sendRequesterApprovedNotification = jest.spyOn(Interactions,
        'sendRequesterApprovedNotification');
      jest.spyOn(NotificationsResponse, 'getOpsTripRequestMessage').mockResolvedValue(
        new BlockMessage([]),
      );
      sendRequesterApprovedNotification.mockResolvedValue();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should notify ops on manager\'s approval', async () => {
      await SlackNotifications.sendOperationsTripRequestNotification(testTrip, botToken);
      jest.spyOn(Interactions, 'sendRequesterApprovedNotification').mockResolvedValue();
      expect(Interactions.sendRequesterApprovedNotification).toHaveBeenCalled();
    });

    it('should test for that that is not regular', async () => {
      await SlackNotifications.sendOperationsTripRequestNotification(
        { ...testTrip, tripType: TripTypes.airportTransfer }, botToken
      );

      expect(Interactions.sendRequesterApprovedNotification).not.toHaveBeenCalled();
      expect(SlackNotifications.sendNotification).toHaveBeenCalled();
    });
  });

  describe(SlackNotifications.sendOperationsNewRouteRequest, () => {
    let getTeamDetails;
    let routeRequestDetails;
    beforeEach(() => {
      getTeamDetails = jest.spyOn(teamDetailsService, 'getTeamDetails');
      getTeamDetails.mockImplementationOnce(() => (
        { botToken: 'slackBotOauthToken', opsChannelId: 1 }
      ));
      routeRequestDetails = jest.spyOn(RouteRequestService, 'getRouteRequest');
      routeRequestDetails.mockImplementation(() => ({
        distance: 2,
        busStopDistance: 3,
        routeImageUrl: 'image',
        busStop: { address: 'busstop' },
        home: { address: 'home' },
        manager: { slackId: '1234' },
        engagement: {
          partner: { name: 'partner' },
          startDate: '11-12-2018',
          endDate: '11-12-2019',
          workHours: '10:00-22:00',
          fellow: { slackId: '4321' }
        }
      }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
      // jest.resetAllMocks();
      // jest.clearAllMocks();
    });

    it('should send route request to ops channel', async () => {
      const teamId = 'AHDJDLKUER';
      jest.spyOn(RouteRequestService, 'getRouteRequest')
        .mockResolvedValue(mockRouteRequestData);
      jest.spyOn(teamDetailsService, 'getTeamDetails')
        .mockResolvedValue({ botToken: 'AAAAAA' });
      jest.spyOn(SlackNotifications, 'sendOperationsNotificationFields');
      jest.spyOn(SlackNotifications, 'sendNotifications')
        .mockResolvedValue({ ts: '122123423.053234' });
      await SlackNotifications.sendOperationsNewRouteRequest(teamId, '1');
      expect(SlackNotifications.sendOperationsNotificationFields)
        .toHaveBeenCalledWith(mockRouteRequestData);
      expect(SlackNotifications.sendNotifications).toHaveBeenCalledTimes(1);
    });
  });

  describe(SlackNotifications.sendRiderlocationConfirmNotification, () => {
    it('Should send request to rider', async () => {
      await SlackNotifications.sendRiderlocationConfirmNotification({
        location: 'location',
        teamID: 'teamID',
        userID: 1,
        rider: 1
      });
      expect(SlackNotifications.sendNotifications).toHaveBeenCalled();
    });
  });

  describe(SlackNotifications.sendOperationsRiderlocationConfirmation, () => {
    it('Should send confrimation to Ops', async () => {
      const sendNotifications = jest.spyOn(SlackNotifications, 'sendNotifications');
      const getTeamDetails = jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue({
        botToken: { slackBotOauthToken: 'yahaha' },
        opsChannelId: 'qwertyuoi'
      });
      await SlackNotifications.sendOperationsRiderlocationConfirmation({
        riderID: 1,
        teamID: 'rtyui',
        confirmedLocation: 'Nairobi',
        waitingRequester: 1,
        location: 'Pickup'
      }, jest.fn());
      expect(getTeamDetails).toHaveBeenCalled();
      expect(sendNotifications).toHaveBeenCalled();
    });

    it('Should call respond and bugsnug when error occurs', async () => {
      const respond = jest.fn();
      jest.spyOn(bugsnagHelper, 'log').mockReturnValue({});
      jest.spyOn(teamDetailsService, 'getTeamDetails').mockImplementation(() => {
        throw new Error('Dummy error');
      });
      const payload = {
        riderID: 1,
        teamID: 'rtyui',
        confirmedLocation: 'Nairobi',
        waitingRequester: 1,
        location: 'Pickup'
      };
      await SlackNotifications.sendOperationsRiderlocationConfirmation(payload, respond);
      expect(bugsnagHelper.log).toHaveBeenCalled();
      expect(respond).toHaveBeenCalled();
    });
  });

  describe(SlackNotifications.getCancelAttachment, () => {
    beforeEach(() => {
      jest.spyOn(Services, 'findOrCreateNewUserWithSlackId').mockResolvedValue({});
      jest.spyOn(SlackNotifications, 'notificationFields').mockResolvedValue({});
    });

    it('Should get manager cancel attachment when requester is rider', async () => {
      const [newTripRequest, imResponse, requester, rider] = [
        {}, {}, { slackId: '090OPI' }, { slackId: '090OPI' }
      ];
      const fields = [
        new MarkdownText('*Pickup Location*:\nAndela office'),
        new MarkdownText('*Destination*:\nKigali Lodge')
      ];
      jest.spyOn(SlackNotifications, 'notificationFields').mockResolvedValue(fields);
      await SlackNotifications.getCancelAttachment(
        newTripRequest, imResponse, requester, rider
      );
      expect(SlackNotifications.notificationFields).toHaveBeenCalled();
    });

    it('Should get manager cancel attachment when requester is not rider', async () => {
      const [newTripRequest, imResponse, requester, rider] = [
        {}, {}, { slackId: '090OPJKL' }, { slackId: '090OPI' }
      ];
      const fields = [
        new MarkdownText('*Pickup Location*:\nAndela office'),
        new MarkdownText('*Destination*:\nKigali Lodge')
      ];
      jest.spyOn(SlackNotifications, 'notificationFields').mockResolvedValue(fields);
      await SlackNotifications.getCancelAttachment(
        newTripRequest, imResponse, requester, rider
      );
      expect(SlackNotifications.notificationFields).toHaveBeenCalled();
    });
  });

  describe(SlackNotifications.sendManagerCancelNotification, () => {
    const tripInfo = {
      id: '090OPI', departmentId: '090OPI', requestedById: '090OPI', riderId: '090OPI'
    };
    const respond = jest.fn();
    const data = { team: { id: 'teamId' } };
    beforeEach(() => {
      jest.spyOn(departmentService, 'getHeadByDeptId').mockResolvedValue({ slackId: 'OOO908' });
      jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId').mockResolvedValue('Adaeze');
      jest.spyOn(tripService, 'getById').mockResolvedValue({});
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('TKD44OL');
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue({});
    });

    it('Should send manager notification successfully', async () => {
      jest.spyOn(SlackNotifications, 'getCancelAttachment').mockResolvedValue({});
      const getCancelAttachmentSpy = jest.spyOn(
        SlackNotifications, 'getCancelAttachment'
      );
      await SlackNotifications.sendManagerCancelNotification(data, tripInfo, respond);
      expect(departmentService.getHeadByDeptId).toHaveBeenCalled();
      expect(tripService.getById).toHaveBeenCalled();
      expect(teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalled();
      expect(getCancelAttachmentSpy).toHaveBeenCalled();
    });

    it('Should run the catch block when there is an error', async () => {
      jest.spyOn(SlackNotifications, 'getCancelAttachment').mockRejectedValue({});
      await SlackNotifications.sendManagerCancelNotification(data, tripInfo, respond);
      expect(respond).toHaveBeenCalled();
    });
  });
  describe(SlackNotifications.sendOpsCancelNotification, () => {
    const respond = jest.fn();
    const data = { team: { id: 'teamId' } };
    const tripInfo = {
      requester: '090OPI', rider: '090OPI'
    };
    beforeEach(() => {
      jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue({});
    });

    it('Should send cancel notification to the operations team', async () => {
      jest.spyOn(SlackNotifications, 'getCancelAttachment').mockResolvedValue({});
      const sendNotificationSpy = jest.spyOn(SlackNotifications, 'sendNotification');
      await SlackNotifications.sendOpsCancelNotification(data, tripInfo, respond);
      expect(teamDetailsService.getTeamDetails).toHaveBeenCalled();
      expect(SlackNotifications.getCancelAttachment).toHaveBeenCalled();
      expect(sendNotificationSpy).toHaveBeenCalled();
    });

    it('Should run catch block when there is an error', async () => {
      jest.spyOn(SlackNotifications, 'getCancelAttachment').mockRejectedValue({});
      await SlackNotifications.sendOpsCancelNotification(data, tripInfo, respond);
      expect(respond).toHaveBeenCalled();
    });
  });


  describe(SlackNotifications.getOpsMessageAttachment, () => {
    const initialTrip = { ...tripInitial };

    it('sends notification to ops when user has booked themselves', async () => {
      const result = SlackNotifications.getOpsMessageAttachment(initialTrip, 1, 'HURT1234');
      expect(result).toBeInstanceOf(BlockMessage);
    });

    it('sends notification to ops when user has been booked for', async () => {
      const nTripRequest = { ...initialTrip, rider: { slackId: 'HGY1234' } };

      const result = SlackNotifications.getOpsMessageAttachment(nTripRequest, 1, 'HURT1234');
      expect(result).toBeInstanceOf(BlockMessage);
    });
  });

  describe(SlackNotifications.sendOpsTripRequestNotification, () => {
    const trip = {
      requestedById: 'Hello123',
      riderId: 10,
      departmentId: 2,
      id: 3,
      channel: { id: 'DL90XKSM6', name: 'directmessage' },
    };

    const dataReturned = {
      botToken: 'WELL1',
      opsChannelId: 2
    };

    beforeEach(() => {
      jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue(dataReturned);
      jest.spyOn(SlackNotifications, 'sendNotification');
      jest.spyOn(SlackNotifications, 'opsNotificationMessage');
      bugsnagHelper.log = jest.fn();
    });

    it('should send a notification to the operations team when a user request a trip', async () => {
      const mockResponse = { opsRequestMessage: 'Trip message', botToken: 'RDFT45' };
      jest.spyOn(SlackNotifications, 'opsNotificationMessage').mockResolvedValue(
        mockResponse
      );

      await SlackNotifications.sendOpsTripRequestNotification(trip, { teamId: 'U1234' });
      expect(SlackNotifications.sendNotification).toHaveBeenCalledWith(
        'Trip message', 'RDFT45'
      );
    });

    it('should returns an error when the notification fails to send', async () => {
      jest.spyOn(SlackNotifications, 'opsNotificationMessage').mockImplementation(
        () => jest.fn()
      );
      jest.spyOn(SlackNotifications, 'sendNotification').mockRejectedValueOnce(
        'An error just occured'
      );
      await SlackNotifications.sendOpsTripRequestNotification(trip, { teamId: 'U1234' });
      expect(bugsnagHelper.log).toHaveBeenCalledWith('An error just occured');
    });
  });
  describe(SlackNotifications.sendOpsPostRatingMessage, () => {
    it('should send a notification to the operations team when a user complete and rate a trip', async () => {
      const payload = {
        type: 'interactive_message',
        actions: [{ name: '1', type: 'button', value: '1' }],
        callback_id: 'rate_trip',
        team: { id: 'TP0G7J00A', domain: 'tembea' },
        channel: { id: 'AA1AA11111', name: 'directmessage' },
        user: { id: 'UP3SJTDPY', name: 'john.doe' },
        action_ts: '1572867898.763198',
        message_ts: '1572867893.000700',
        attachment_id: '1',
        token: 'AGED4OXhDrpvW3MWU9PNGER',
        is_app_unfurl: false,
        original_message:
      {
        type: 'message',
        subtype: 'bot_message',
        text: '*Please rate this trip on a scale of \'1 - 5\' :star: *',
        ts: '1572867893.000700',
        username: 'tembea',
        bot_id: 'BNQ0PSR00',
        attachments: [[Object]]
      },
        response_url:
      'https://sample.com/api/john.doe',
        trigger_id: '117514386930.120001619011.A3PD3d0a4d1dd248dldldhlkgahd'
      };
      const fieldsAttachement = [
        { text: '*Passenger*: John', type: 'mrkdwn' },
        { text: '*Pickup Location*: Kigali, Kimironko', type: 'mrkdwn' },
      ];
      jest.mock('../../SlackModels/SlackMessageModels');
      const getMockedTrip = jest.spyOn(teamDetailsService, 'getTeamDetails')
        .mockResolvedValue({ botToken: 'SADFMH4', opsChannelId: '34U5KQEJ' });
      const mockedFieldsAttachment = jest.spyOn(NotificationsResponse,
        'getOpsTripBlocksFields').mockResolvedValue(fieldsAttachement);
      await SlackNotifications.sendOpsPostRatingMessage(payload);
      expect(getMockedTrip).toHaveBeenCalledWith(payload.team.id);
      expect(mockedFieldsAttachment).toHaveBeenCalledWith(1);
    });
  });

  describe.only(SlackNotifications.sendOpsProvidersTripsReport, () => {
    const opsProviderReport = {
      CS2AL04QH: {
        total: 10,
        month: 'Jan, 2020',
        name: 'NAIROBI',
        providersData: [
          {
            name: 'YEGO',
            trips: 2,
            percantage: 100
          }
        ]
      }
    };

    const dataReturned = {
      botToken: 'WELL1'
    };

    beforeEach(() => {
      jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue(dataReturned);
      jest.spyOn(NotificationsResponse, 'getOpsProviderTripsFields');
    });

    it('should send a providers report to ops channel', async () => {
      jest.spyOn(providerMonthlyReport, 'generateData')
        .mockResolvedValue(opsProviderReport);
      await SlackNotifications.sendOpsProvidersTripsReport();
      expect(SlackNotifications.sendNotification).toHaveBeenCalled();
    });
    it('should not send a providers report to ops channel', async () => {
      jest.spyOn(providerMonthlyReport, 'generateData')
        .mockResolvedValue({});
      await SlackNotifications.sendOpsProvidersTripsReport();
      expect(SlackNotifications.sendNotification).toHaveBeenCalledTimes(0);
    });
  });
  
  describe(SlackNotifications.requestFeedbackMessage, () => {
    it('should send notification to users', async () => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsByTeamUrl')
        .mockReturnValueOnce({ botToken: 'lelelele' });
      const spyOnNotification = jest.spyOn(SlackNotifications, 'sendNotifications')
        .mockReturnValue('notification sent');
      jest.spyOn(Services, 'getUsersSlackId')
        .mockReturnValueOnce([{ slackId: 'kekek', name: 'name' }]);
      await SlackNotifications.requestFeedbackMessage();
      expect(spyOnNotification).toHaveBeenCalledTimes(1);
    });
  });
});
