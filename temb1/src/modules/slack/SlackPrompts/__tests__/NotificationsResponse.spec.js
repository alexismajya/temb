import NotificationsResponse from '../NotificationsResponse';
import * as SlackModels from '../../SlackModels/SlackMessageModels';
import responseData from '../__mocks__/NotificationResponseMock';
import { homebaseService } from '../../../homebases/homebase.service';
import tripService from '../../../trips/trip.service';
import { MarkdownText } from '../../../new-slack/models/slack-block-models';


describe(NotificationsResponse, () => {
  const payload = {
    department: 'dept',
    data: 'data',
    slackChannelId: 'slack',
    requestDate: '11/12/2018 11:00',
    departureDate: '21/12/2018 11:00',
    tripStatus: 'trip',
    managerComment: 'manager',
    driver: {
      id: 1,
      driverName: 'John',
      driverPhoneNo: '+780000000000671'
    },
    rider: {
      name: 'John'
    },
    origin: {
      address: 'Kigali, Kimironko'
    },
    destination: {
      address: 'Kigali, Airport'
    },
    provider: {
      name: 'John',
    },
    cab: {
      regNumber: 'RAB120A',
      model: 'SUV'
    },
    distance: '1.2 Km',
    updatedAt: '2019-11-11'
  };

  beforeEach(() => {
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue(1);
    jest.spyOn(homebaseService, 'findHomeBaseByChannelId').mockResolvedValue({
      id: 3,
      name: 'Nairobi',
      channel: 'CELT35X40',
      countryId: 3,
      addressId: null,
      locationId: 40,
      createdAt: '2019-10-21T23:13:10.840Z',
      updatedAt: '2019-10-21T23:13:10.840Z',
      deletedAt: null
    });
  });

  it('should test response for operations channel for regular trip', async () => {
    const result = await NotificationsResponse.getOpsTripRequestMessage(
      responseData, responseData, 'hello', 'regular'
    );
    expect(result).toHaveProperty('attachments');
  });

  it('should test response for operations channel for travel trip', async () => {
    const result = await NotificationsResponse.getOpsTripRequestMessage(
      responseData, responseData, 'hello', 'travel'
    );
    expect(result).toHaveProperty('attachments');
  });

  it('should test travelOperations response', () => {
    const result = NotificationsResponse.travelOperationsDepartmentResponse(responseData, 'blue',
      [], 'call');
    expect(result).toHaveProperty('attachments');
  });

  it('should test OperationsDepartment response', () => {
    const result = NotificationsResponse.prepareOperationsDepartmentResponse(responseData, 'blue',
      [], 'call');
    expect(result).toHaveProperty('attachments');
  });

  it('should create get requester Attachment', () => {
    const {
      department, data, slackChannelId, pickup, destination,
      requestDate, departureDate, tripStatus, managerComment
    } = payload;
    const result = NotificationsResponse.getRequesterAttachment(
      department, data, slackChannelId, pickup, destination,
      requestDate, departureDate, tripStatus, managerComment
    );
    expect(result[0]).toHaveProperty('actions');
    expect(result[0]).toHaveProperty('attachment_type');
  });

  it('should create notification header for manager approval', async () => {
    const trip = {
      pickup: { address: 'testAddress' },
      destination: { address: 'testAddress' }
    };

    const result = await NotificationsResponse.getMessageHeader(trip);
    expect(result).toEqual(expect.stringContaining(trip.pickup.address));
  });


  it('should create notification header for Ops approval', async () => {
    const channelId = 'CELT35X40';
    const trip = {
      pickup: { address: 'testAddress' },
      destination: { address: 'testAddress' }
    };
    const result = await NotificationsResponse.getMessageHeader(trip, channelId);
    expect(result).toEqual(expect.stringContaining(trip.pickup.address));
  });

  it('should show confirm options if homebase is not Kampala', async () => {
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockReturnValue({ name: 'Nairobi' });
    const response = await NotificationsResponse.getOpsSelectAction(1, 1, []);
    expect(response.text).toEqual('Confirm request options');
  });

  it('should show Confirm and assign cab and driver if homebase is Kampala', async () => {
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockReturnValue({ name: 'Kampala' });
    const response = await NotificationsResponse.getOpsSelectAction(1, 1, []);
    expect(response.text).toEqual('Confirm and assign cab and driver');
  });

  it('should generateOperationsRequestActions', async () => {
    jest.spyOn(NotificationsResponse, 'getOpsSelectAction').mockReturnValue({});
    const options = await NotificationsResponse.generateOperationsRequestActions(1, 'UHFDAA');
    expect(options).toBeDefined();
    expect(options).toEqual([{},
      new SlackModels.SlackButtonAction('declineRequest', 'Decline', 1, 'danger')]);
  });

  it('should create interactive message for provider',
    async () => {
      const testChannel = 'U1234';
      const result = await NotificationsResponse.responseForRequester(payload, testChannel);
      expect(result).toEqual(expect.objectContaining({ channel: testChannel }));
    });

  it('should send a notification to the operations team when a user complete and rate a trip',
    async () => {
      const getMockedTrip = jest.spyOn(tripService, 'getById').mockResolvedValue(payload);
      await NotificationsResponse.getOpsTripBlocksFields(1);
      expect(getMockedTrip).toHaveBeenCalledWith(1, true);
    });

  it.only('should generate providers trips information fields',
    async () => {
      const fields = [
        new MarkdownText('*Provider*: YEGO\n'),
        new MarkdownText('*Trips*: 2\n'),
        new MarkdownText('*Percentage*: 100%\n')
      ];
      const result = await NotificationsResponse
        .getOpsProviderTripsFields([
          {
            name: 'YEGO',
            trips: 2,
            percantage: 100
          }
        ]);
      expect(result[0].fields).toEqual(fields);
    });
});
