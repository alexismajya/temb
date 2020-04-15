import WebSocketEvents from '../../../../events/web-socket-event.service';
import JoinRouteInteractions from '../JoinRouteInteractions';
import SequelizePaginationHelper from '../../../../../helpers/sequelizePaginationHelper';
import RoutesHelpers from '../../../helpers/routesHelper';
import JoinRouteInputHandlers from '../JoinRouteInputHandler';
import mockPayload from '../../__mocks__/payload.mock';
import { batchUseRecordService } from '../../../../batchUseRecords/batchUseRecord.service';
import RouteJobs from '../../../../../services/jobScheduler/jobs/RouteJobs';
import UserService from '../../../../users/user.service';
import routeBatchMock from '../__mocks__/routeBatch.mock';
import { homebaseService } from '../../../../homebases/homebase.service';
import RateTripController from '../../../TripManagement/RateTripController';
import { actions } from '../../../SlackPrompts/notifications/RouteNotifications';
import { routeBatchService } from '../../../../routeBatches/routeBatch.service';
import TripEventsHandlers from '../../../../events/trip-events.handlers';
import socketIoMock from '../../../__mocks__/socket.ioMock';

describe('Test JointRouteInteractions', () => {
  const res = jest.fn();
  const testData = JSON.parse(process.env.TEST_DATA);
  beforeEach(() => {
    jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
      () => (new WebSocketEvents(socketIoMock))
    );
  });
  describe('Test sendAvailableRoutesMessage', () => {
    beforeEach(() => {
      jest
        .spyOn(SequelizePaginationHelper, 'deserializeSort')
        .mockReturnValue(['asc', 'name']);
      jest
        .spyOn(routeBatchService, 'getRoutes')
        .mockReturnValue({ routes: [{}], totalPages: 1, pageNo: 1 });
      jest
        .spyOn(RoutesHelpers, 'toAvailableRoutesAttachment')
        .mockReturnValue('');
    });

    it('should test sendAvailableRoutesMessage', async () => {
      const payload = { user: { id: 1 } };
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockImplementation(() => ({ id: 1 }));
      await JoinRouteInteractions.sendAvailableRoutesMessage(payload, res);

      expect(RoutesHelpers.toAvailableRoutesAttachment).toBeCalled();
      expect(routeBatchService.getRoutes).toBeCalled();
    });

    it('should skip page', async () => {
      const actions1 = [{ name: 'skipPage', field: 'field' }];
      const payload = { actions: actions1, team: { id: 3 }, user: { id: 1 } };
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockImplementation(() => ({ id: 1 }));
      const result = await JoinRouteInteractions.sendAvailableRoutesMessage(
        payload,
        res
      );
      expect(result).toBe(undefined);
      expect(RoutesHelpers.toAvailableRoutesAttachment).toBeCalled();
      expect(routeBatchService.getRoutes).toBeCalled();
    });
  });
  describe('Test handleSendAvailableRoutesActions', () => {
    let respond;
    let payload;
    let mockFn;
    beforeEach(() => {
      respond = jest.fn();
      mockFn = jest.spyOn(JoinRouteInteractions, 'sendAvailableRoutesMessage').mockResolvedValue();
    });

    afterEach(() => {
      mockFn.mockRestore();
    });

    it('should call sendAvailableRoutesMessage for "See Available Routes"', async () => {
      payload = mockPayload('value', 'See Available Routes');
      await JoinRouteInteractions.handleSendAvailableRoutesActions(payload, respond);
      expect(JoinRouteInteractions.sendAvailableRoutesMessage).toHaveBeenCalledTimes(1);
      expect(JoinRouteInteractions.sendAvailableRoutesMessage).toHaveBeenCalledWith(payload, respond);
    });

    it('should call sendAvailableRoutesMessage for action names starting with "page_"', async () => {
      payload = mockPayload('value', 'page_3');
      await JoinRouteInteractions.handleSendAvailableRoutesActions(payload, respond);
      expect(JoinRouteInteractions.sendAvailableRoutesMessage).toHaveBeenCalledTimes(1);
      expect(JoinRouteInteractions.sendAvailableRoutesMessage).toHaveBeenCalledWith(payload, respond);
    });
  });
  describe('Test handleViewAvailableRoutes', () => {
    let respond;
    let payload;
    beforeEach(() => {
      respond = jest.fn();
      jest.spyOn(JoinRouteInteractions, 'sendAvailableRoutesMessage').mockResolvedValue();
      jest.spyOn(JoinRouteInteractions, 'handleSendAvailableRoutesActions').mockResolvedValue();
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should call handleSendAvailableRoutesActions for interactive message', async () => {
      payload = { type: 'interactive_message' };
      await JoinRouteInteractions.handleViewAvailableRoutes(payload, respond);
      expect(JoinRouteInteractions.handleSendAvailableRoutesActions).toHaveBeenCalledTimes(1);
      expect(JoinRouteInteractions.handleSendAvailableRoutesActions).toHaveBeenCalledWith(payload, respond);
    });

    it('should call sendAvailableRoutesMessage for dialog submission', async () => {
      payload = { type: 'dialog_submission' };
      await JoinRouteInteractions.handleViewAvailableRoutes(payload, respond);
      expect(JoinRouteInteractions.sendAvailableRoutesMessage).toHaveBeenCalledTimes(1);
      expect(JoinRouteInteractions.sendAvailableRoutesMessage).toHaveBeenCalledWith(payload, respond);
    });
  });

  describe('Test full capacity', () => {
    it('should test fullRouteCapacityNotice', () => {
      const result = JoinRouteInteractions.fullRouteCapacityNotice('state');
      expect(result).toHaveProperty('attachments');
      expect(result).toHaveProperty('text');
    });
  });

  describe('Test handleJoinRouteActions', () => {
    const respond = jest.fn();
    const actions2 = 'callAction';

    it('should test handleJoinRouteActions for wrong payload', () => {
      const payload = { actions: actions2, callBack_id: 'callId' };
      JoinRouteInputHandlers.handleJoinRouteActions(payload, respond);
      expect(respond).toBeCalled();
    });

    it('should throw an error if something goes wrong', () => {
      jest
        .spyOn(JoinRouteInputHandlers, 'joinRoute')
        .mockRejectedValue(new Error('something wrong'));
      const payload = { actions: actions2, callback_id: 'join_Route_joinRoute' };
      expect(
        JoinRouteInputHandlers.handleJoinRouteActions(payload, respond)
      ).rejects.toThrow('something wrong');
    });
  });

  describe('Test handleRouteBatchConfirmUse', () => {
    const respond = jest.fn();
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should test taken route button', async () => {
      const payload = {
        actions: [{ action_id: actions.confirmation, value: '211' }],
        team: { id: 233 },
        user: testData.users[3],
      };
      jest.spyOn(UserService, 'getUserBySlackId').mockImplementation(() => (testData.users[3]));
      jest
        .spyOn(batchUseRecordService, 'createSingleRecord').mockResolvedValue();
      jest.spyOn(RateTripController, 'sendRatingMessage').mockResolvedValue();
      await JoinRouteInteractions.handleRouteBatchConfirmUse(payload, respond);
      expect(batchUseRecordService.createSingleRecord).toBeCalledTimes(1);
      expect(RateTripController.sendRatingMessage).toBeCalledTimes(1);
    });

    it('should test not taken route button', async () => {
      const payload = {
        actions: [{ action_id: actions.decline, value: '211' }],
        team: { id: 343 },
        user: testData.users[3],
      };
      jest.spyOn(JoinRouteInteractions, 'hasNotTakenTrip').mockResolvedValue();
      jest.spyOn(batchUseRecordService, 'createSingleRecord').mockResolvedValue();
      jest.spyOn(UserService, 'getUserBySlackId').mockImplementation(() => (testData.users[3]));
      await JoinRouteInteractions.handleRouteBatchConfirmUse(payload, respond);

      expect(batchUseRecordService.createSingleRecord).toBeCalledTimes(1);
      expect(JoinRouteInteractions.hasNotTakenTrip).toBeCalledTimes(1);
    });

    it('should test still on trip route button', async () => {
      const payload = {
        actions: [{
          action_id: actions.pending,
          value: '211'
        }],
        team: {
          id: 343
        },
        user: testData.users[4],
      };
      jest.spyOn(batchUseRecordService, 'createSingleRecord').mockResolvedValue();
      jest.spyOn(UserService, 'getUserBySlackId').mockImplementation(() => (testData.users[4]));
      await JoinRouteInteractions.handleRouteBatchConfirmUse(payload, respond);
      expect(batchUseRecordService.createSingleRecord).toBeCalledTimes(1);
    });

    it('should add 30 minutes on production', async () => {
      jest.spyOn(batchUseRecordService, 'createSingleRecord').mockResolvedValue();
      jest.spyOn(UserService, 'getUserBySlackId').mockImplementation(() => (testData.users[4]));
      jest.spyOn(RouteJobs, 'scheduleTripCompletionNotification');
      process.env.NODE_ENV = 'production';
      const payload = {
        actions: [{
          action_id: actions.pending,
          value: '211'
        }],
        team: {
          id: 343
        },
        user: testData.users[4],
      };
      await JoinRouteInteractions.handleRouteBatchConfirmUse(payload, respond);
      expect(RouteJobs.scheduleTripCompletionNotification).toHaveBeenCalled();
    });
  });

  describe('Test handleRouteSkipped', () => {
    const respond = jest.fn();
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should test handleRouteSkipped', async () => {
      const payload = { submission: { submission: 'teamId' }, state: 233, user: testData.users[3] };
      jest.spyOn(UserService, 'getUserBySlackId').mockImplementation(() => (testData.users[3]));
      jest
        .spyOn(batchUseRecordService, 'createSingleRecord').mockResolvedValue();
      await JoinRouteInteractions.handleRouteSkipped(payload, respond);
      expect(batchUseRecordService.createSingleRecord).toBeCalledTimes(1);
    });
  });

  describe('Test hasNotTakenTrip', () => {
    const respond = jest.fn();
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should test hasNotTakenTrip', async () => {
      const payload = { actions: [{ name: 'taken', value: '211' }], team: { id: 233 } };
      jest
        .spyOn(batchUseRecordService, 'updateBatchUseRecord').mockResolvedValue();
      await JoinRouteInteractions.hasNotTakenTrip(payload, respond);
      expect(respond).toBeCalledTimes(1);
    });
  });

  describe('sendCurrentRouteMessage', () => {
    it('should send users current route', async () => {
      const [payload, respond, testBatchId] = [{ user: { id: 'U1234' } }, jest.fn(), routeBatchMock.routeBatchId];
      const getUserSpy = jest.spyOn(UserService, 'getUserBySlackId').mockImplementation((slackId) => (
        {
          slackId,
          routeBatchId: testBatchId
        }));
      const getBatchSpy = jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockImplementation((id) => ({
        ...routeBatchMock,
        id
      }));

      await JoinRouteInteractions.sendCurrentRouteMessage(payload, respond);

      expect(getUserSpy).toHaveBeenCalledWith(payload.user.id);
      expect(getBatchSpy).toHaveBeenCalledWith(testBatchId, true);
    });
  });

  it('should display a message when the user has no route', async () => {
    const [payload, respond] = [{ user: { id: 'U1234' } }, jest.fn()];
    const getUserSpy = jest.spyOn(UserService, 'getUserBySlackId').mockImplementation((slackId) => (
      {
        slackId,
        routeBatchId: null
      }));
    const getBatchSpy = jest
      .spyOn(routeBatchService, 'getRouteBatchByPk')
      .mockImplementation(() => null);

    await JoinRouteInteractions.sendCurrentRouteMessage(payload, respond);

    expect(getUserSpy).toHaveBeenCalledWith(payload.user.id);
    expect(getBatchSpy).toHaveBeenCalledWith(null, true);
  });
});
