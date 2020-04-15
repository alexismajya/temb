import tripService from '../../../trips/trip.service';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import appEvents from '../../../events/app-event.service';
import { tripEvents } from '../../../events/trip-events.contants';
import TripHelpers from './trip.helpers';
import SlackNotifications from '../../../slack/SlackPrompts/Notifications';
import { trip as tripInitial } from '../__mocks__/trip';
import { TripStatus } from '../../../../database/models/trip-request';

describe('TripController', () => {
  let state: import('./trip.helpers').IManagerCompleteOptions;
  const status = {
    currentState: 'Approved',
    lastActionById: 'slackId',
  };
  beforeEach(() => {
    state = {
      reason:'test',
      managerSlackId: 'U1234',
      tripId: 1,
      botToken: 'token',
      teamId: 'T3H2G9',
      isApproval: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  describe('completeManagerResponse for approval', () => {
    it('should submit approval response from manager', async () => {
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValue({
        slackId: state.managerSlackId, teamId: state.teamId,
      });
      jest.spyOn(TripHelpers, 'approveRequest').mockResolvedValue({
        tripId: state.tripId,
        managerId: state.managerSlackId,
        reason: state.reason,
        botToken: state.botToken,
      });
      await TripHelpers.completeManagerResponse(state);
      expect(TripHelpers.approveRequest).toHaveBeenCalled();
    });
    it('should submit approve request', async () => {
      jest.spyOn(tripService, 'update').mockResolvedValue({
        tripId: state.tripId,
        data:'tripdetails' });
      jest.spyOn(appEvents, 'broadcast').mockResolvedValue({
        name: tripEvents.managerApprovedTrip,
        data:'tripdetails',
        botToken: state.botToken });
      await TripHelpers.approveRequest(state.tripId,
         2, state.reason, state.botToken);
      expect(appEvents.broadcast).toHaveBeenCalled();
    });
  });
  describe('completeManagerResponse for Decline', () => {
    const newState = {
      ...state,
      isApproval: false,
    };
    it('should submit decline response from manager', async () => {
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValue({
        slackId: newState.managerSlackId, teamId: newState.teamId,
      });
      jest.spyOn(TripHelpers, 'declineRequest').mockResolvedValue({
        tripId: newState.tripId,
        managerId: newState.managerSlackId,
        reason: newState.reason,
        botToken: newState.botToken,
      });
      await TripHelpers.completeManagerResponse(newState);
      expect(TripHelpers.declineRequest).toHaveBeenCalled();
    });
    it('should submit decline request', async () => {
      const managerId = 2;
      jest.spyOn(tripService, 'update').mockResolvedValue({
        tripId: newState.tripId,
        data:'tripdetails' });
      jest.spyOn(appEvents, 'broadcast').mockResolvedValue({
        name: tripEvents.managerDeclinedTrip,
        data:'tripdetails',
        botToken: newState.botToken });
      await TripHelpers.declineRequest(newState.tripId,
        managerId, newState.reason, newState.botToken);
      expect(appEvents.broadcast).toHaveBeenCalled();
    });
  });
  describe('getApprovedMessageOfRequester', () => {
    beforeEach(() => {
      jest.spyOn(SlackNotifications, 'notificationFields').mockResolvedValue(['fields']);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should send approved message to requester', async () => {
      const responseData = { ...tripInitial, requester: { slackId: 2 } };
      await TripHelpers.getApprovedMessageOfRequester(responseData, 'channel');
      expect(SlackNotifications.notificationFields).toBeCalled();
    });
  });
  describe('notify manager when Ops approved', () => {
    it('should notify manager when Ops approved a trip', async () => {
      jest.spyOn(tripService, 'getById').mockResolvedValue({
        homebase:{
          channelId: 'channel',
        },
      });
      await TripHelpers.notifyManagerIfOpsApproved(1, 'channelId', 'token');
      expect(tripService.getById).toBeCalled();
    });
  });
  describe('Decline request', () => {
    it('should decline trip request', async () => {
      jest.spyOn(tripService, 'update').mockResolvedValue({
        homebase:{
          channelId: 'channel',
        },
      });
      jest.spyOn(appEvents, 'broadcast').mockResolvedValue('data');
      await TripHelpers.declineRequest(1, 1, 'reasone', 'token');
      expect(appEvents.broadcast).toBeCalled();
      expect(tripService.update).toBeCalled();
    });
  });
  describe('getApprovalOrDeclineMessage', () => {
    it('should return approved or declined message about trip', async () => {
      jest.spyOn(SlackNotifications, 'sendNotification').mockReturnValue('message');
      jest.spyOn(TripHelpers, 'getActorString').mockReturnValue('Actor');
      await TripHelpers.getApprovalOrDeclineMessage(tripInitial, status, 'data', 'userId');
      expect(TripHelpers.getActorString).toBeCalled();
    });
    it('should return default message', async() => {
      jest.spyOn(TripHelpers, 'getActorString').mockReturnValue('Actor');
      status.currentState = 'none';
      await TripHelpers.getApprovalOrDeclineMessage(tripInitial, status, 'data', 'userId');
      expect(TripHelpers.getActorString).toBeCalled();
    });
    it('should return message when trip has been declined by ops', async() => {
      jest.spyOn(TripHelpers, 'getActorString').mockReturnValue('Actor');
      status.currentState = TripStatus.declinedByOps;
      await TripHelpers.getApprovalOrDeclineMessage(tripInitial, status, 'data', 'userId');
      expect(TripHelpers.getActorString).toBeCalled();
    });
    it('should return message when trip has been declined by manager', async() => {
      jest.spyOn(TripHelpers, 'getActorString').mockReturnValue('Actor');
      status.currentState = TripStatus.declinedByManager;
      await TripHelpers.getApprovalOrDeclineMessage(tripInitial, status, 'data', 'userId');
      expect(TripHelpers.getActorString).toBeCalled();
    });

    it('should return message when trip has been confirmed', async() => {
      jest.spyOn(TripHelpers, 'getActorString').mockReturnValue('Actor');
      status.currentState = TripStatus.confirmed;
      await TripHelpers.getApprovalOrDeclineMessage(tripInitial, status, 'data', 'userId');
      expect(TripHelpers.getActorString).toBeCalled();
    });
  });
  describe('getManagerApprovedOrDeclineMessage', () => {
    it('should return approved or declined message about trip', async () => {
      jest.spyOn(tripService, 'getById').mockReturnValue('data');
      jest.spyOn(TripHelpers, 'getApprovalOrDeclineMessage').mockResolvedValue('data');
      await TripHelpers.getManagerApprovedOrDeclineMessage(1, status, 'channel', 'userId');
      expect(tripService.getById).toBeCalled();
    });
  });
  describe('approveRequest', () => {
    it('should approve a trip request', async () => {
      jest.spyOn(tripService, 'update').mockResolvedValue({
        homebase:{
          channelId: 'channel',
        },
      });
      jest.spyOn(appEvents, 'broadcast').mockResolvedValue('data');
      await TripHelpers.approveRequest(1, 1, 'reasone', 'token');
      expect(appEvents.broadcast).toBeCalled();
      expect(tripService.update).toBeCalled();
    });
  });
  describe('completeManagerResponse', () => {
    const option = {
      tripId: 1,
      isApproval: false,
      reason: 'reason',
      managerSlackId: 'idSlack',
      botToken: 'token',
      teamId: 'teamId',
    };
    it('should let manager approve  a trip request', async () => {
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValue('data');
      jest.spyOn(TripHelpers, 'approveRequest').mockResolvedValue('approve');
      await TripHelpers.completeManagerResponse(option);
      expect(SlackHelpers.findOrCreateUserBySlackId).toBeCalled();
    });
    it('should let manager decline a trip', async() => {
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValue('data');
      jest.spyOn(TripHelpers, 'declineRequest').mockResolvedValue('decline');
      option.isApproval = true;
      await TripHelpers.completeManagerResponse(option);
      expect(SlackHelpers.findOrCreateUserBySlackId).toBeCalled();
    });
  });
  describe('getActorString', () => {
    it('should return the same actor id when both channel are the same', () => {
      tripInitial.homebase.channel = 'channelId';
      const getActor = TripHelpers.getActorString(tripInitial, status, 'channelId', 'actorId');
      expect(getActor).toBeDefined();
      expect(typeof getActor).toBe('string');
      expect(getActor).toEqual('<@slackId> has');
    });
  });
  describe('getMessage', () => {
    it('should return the message when requestId not equal to riderId', async () => {
      const getMessage = await TripHelpers.getMessage('riderId', 'requesterId', 'text');
      expect(typeof getMessage).toBe('string');
    });
    it('should return message also when requestId is equal to riderId', async() => {
      const getMessage = await TripHelpers.getMessage('user', 'user', 'text');
      expect(typeof getMessage).toBe('string');
    });
  });
  describe('sendManagerTripRequestNotification', () => {
    it('should notify a manager about the request trip', async() => {
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('channelId');
      jest.spyOn(TripHelpers, 'getMessage').mockResolvedValue('message');
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue('message');
      await TripHelpers.sendManagerTripRequestNotification(tripInitial, 'token');
      expect(SlackNotifications.getDMChannelId).toBeCalled();
    });
  });
});
