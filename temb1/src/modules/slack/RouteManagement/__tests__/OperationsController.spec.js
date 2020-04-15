import DialogPrompts from '../../SlackPrompts/DialogPrompts';
import RouteRequestService from '../../../routes/route-request.service';
import { OperationsHandler } from '../OperationsController';
import { mockRouteRequestData } from '../../../../services/__mocks__';
import { SlackDialogError } from '../../SlackModels/SlackDialogModels';
import OperationsNotifications from '../../SlackPrompts/notifications/OperationsRouteRequest';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import ManagerFormValidator
  from '../../../../helpers/slack/UserInputValidator/managerFormValidator';
import { routeService } from '../../../routes/route.service';
import OperationsHelper from '../../helpers/slackHelpers/OperationsHelper';
import UserService from '../../../users/user.service';
import TripJobs from '../../../../services/jobScheduler/jobs/TripJobs';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import { completeOpsAssignCabPayload } from '../__mocks__/providersController.mock';
import InteractivePrompts from '../../SlackPrompts/InteractivePrompts';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import tripService from '../../../trips/trip.service';
import RouteHelper from '../../../../helpers/RouteHelper';
import { batch, routeDetails } from '../../../../helpers/__mocks__/routeMock';
import DriverNotifications from
  '../../SlackPrompts/notifications/DriverNotifications/driver.notifications';
import { cabService } from '../../../cabs/cab.service';
import { driverService } from '../../../drivers/driver.service';
import { mockWhatsappOptions } from '../../../notifications/whatsapp/twilio.mocks';

mockWhatsappOptions();

describe('Operations Route Controller', () => {
  let respond;
  const fn = () => ({});
  beforeEach(() => {
    respond = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('operations actions', () => {
    let payload;
    let getRouteRequestAndToken;
    let completeOperationsApprovedAction;
    let updateRouteRequest;
    let routeRequestId;
    let timeStamp;
    let channelId;

    beforeEach(() => {
      getRouteRequestAndToken = jest.spyOn(RouteRequestService, 'getRouteRequestAndToken');
      updateRouteRequest = jest.spyOn(RouteHelper, 'updateRouteRequest');
      completeOperationsApprovedAction = jest.spyOn(
        OperationsNotifications, 'completeOperationsApprovedAction'
      );
      payload = {
        submission: {
          declineReason: 'QQQQQQ', startDate: '31/01/2019', endDate: '20/02/2019'
        },
        actions: [{ name: 'action', value: '1' }],
        channel: { id: 1 },
        team: { id: 'TEAMID1' },
        original_message: { ts: 'timestamp' },
        user: { id: '4' }
      };
      ({ channel: { id: channelId }, original_message: { ts: timeStamp } } = payload);
      ({ id: routeRequestId } = mockRouteRequestData);
    });

    describe('approve', () => {
      beforeEach(() => {
        payload = { ...payload, callback_id: 'operations_route_approve' };
        jest.spyOn(DialogPrompts, 'sendOperationsNewRouteApprovalDialog')
          .mockImplementation(fn);
        jest.spyOn(OperationsNotifications, 'updateOpsStatusNotificationMessage')
          .mockImplementation();
      });
      it('should launch approve dialog prompt', async () => {
        const routeRequest = { ...mockRouteRequestData, status: 'Confirmed' };
        getRouteRequestAndToken.mockReturnValue(
          { botToken: 'botToken', routeRequest }
        );
        await OperationsHandler.handleOperationsActions(payload, respond);
        expect(DialogPrompts.sendOperationsNewRouteApprovalDialog).toHaveBeenCalledTimes(1);
      });
      it('should not launch approve dialog when request has been declined', async () => {
        const routeRequest = {
          ...mockRouteRequestData,
          status: 'Declined'
        };
        getRouteRequestAndToken.mockReturnValue(
          {
            slackBotOauthToken: 'botToken',
            routeRequest
          }
        );

        await OperationsHandler.handleOperationsActions(payload, respond);

        expect(DialogPrompts.sendOperationsNewRouteApprovalDialog)
          .not
          .toHaveBeenCalled();
        expect(OperationsNotifications.updateOpsStatusNotificationMessage)
          .toHaveBeenCalledWith(payload, routeRequest, 'botToken');
      });
      it('should not launch approve dialog when request has been approved', async () => {
        const routeRequest = {
          ...mockRouteRequestData,
          status: 'Approved'
        };
        getRouteRequestAndToken.mockReturnValue(
          {
            slackBotOauthToken: 'botToken',
            routeRequest
          }
        );

        await OperationsHandler.handleOperationsActions(payload, respond);

        expect(DialogPrompts.sendOperationsNewRouteApprovalDialog)
          .not
          .toHaveBeenCalled();
        expect(OperationsNotifications.updateOpsStatusNotificationMessage)
          .toHaveBeenCalledWith(payload, routeRequest, 'botToken');
      });
    });

    describe('operations approve request', () => {
      beforeEach(() => {
        const state = JSON.stringify({
          approve: {
            timeStamp, channelId, routeRequestId
          }
        });
        payload = {
          ...payload,
          submission: {
            routeName: 'QQQQQQ', takeOffTime: '12:30', regNumber: 'JDD3883, SDSAS, DDDDD'
          },
          callback_id: 'operations_route_approvedRequest'
        };
        jest.spyOn(OperationsNotifications, 'completeOperationsApprovedAction')
          .mockImplementation();
        jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue({ id: 1 });
        jest.spyOn(routeService, 'createRouteBatch').mockResolvedValue();
        jest.spyOn(routeService, 'addUserToRoute');
        payload = { ...payload, state };
      });

      it('should complete approve action if cab is selected from dropdown', async () => {
        jest.spyOn(ManagerFormValidator, 'approveRequestFormValidation')
          .mockReturnValue([]);
        jest.spyOn(RouteHelper, 'updateRouteRequest').mockReturnValue(routeDetails);
        jest.spyOn(RouteHelper, 'createNewRouteBatchFromSlack').mockResolvedValue(batch);
        jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue('xoop-asdad');


        await OperationsHandler.handleOperationsActions(payload, respond);
        expect(ManagerFormValidator.approveRequestFormValidation).toHaveBeenCalled();
        expect(RouteHelper.updateRouteRequest).toHaveBeenCalled();
      });

      it('should not submit invalid user input', async () => {
        payload = {
          ...payload,
          submission: {
            routeName: 'cele', takeOffTime: '1230'
          },
          callback_id: 'operations_route_approvedRequest'
        };
        getRouteRequestAndToken.mockResolvedValue(
          { routeRequest: { ...mockRouteRequestData }, slackBotOauthToken: 'dfdf' }
        );
        updateRouteRequest.mockResolvedValue(
          { ...mockRouteRequestData, status: 'Approved' }
        );
        completeOperationsApprovedAction.mockReturnValue('Token');
        const result = await OperationsHandler.handleOperationsActions(payload, respond);
        expect(result.errors[0]).toBeInstanceOf(SlackDialogError);
        expect(RouteHelper.updateRouteRequest).not.toHaveBeenCalled();
        expect(OperationsNotifications.completeOperationsApprovedAction).not.toHaveBeenCalled();
      });

      it('should handle errors', async () => {
        payload = {};
        payload.callback_id = 'operations_route_approvedRequest';
        jest.spyOn(
          ManagerFormValidator, 'approveRequestFormValidation'
        ).mockImplementation(() => { throw new Error(); });
        jest.spyOn(bugsnagHelper, 'log');

        await OperationsHandler.handleOperationsActions(payload, respond);
        expect(bugsnagHelper.log).toHaveBeenCalled();
        expect(respond.mock.calls[0][0].text).toEqual('Unsuccessful request. Kindly Try again');
      });
    });

    describe('operations route controller', () => {
      it('should return a function if action exist', () => {
        const result = OperationsHandler.operationsRouteController('approve');
        expect(result).toBeInstanceOf(Function);
      });
      it('should throw an error if action does exist', () => {
        try {
          OperationsHandler.operationsRouteController('doesNotExist')();
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect(e.message).toBe('Unknown action: operations_route_doesNotExist');
        }
      });
    });

    describe('handle manager actions', () => {
      let mockHandler;
      let payload2;
      beforeEach(() => {
        payload2 = {
          actions: [{ name: 'action', value: 1 }],
          callback_id: 'dummy_callback_actions',
          team: { id: 'TEAMID1' }
        };
        mockHandler = jest.fn().mockReturnValue({ test: 'dummy test' });
        jest.spyOn(OperationsHandler, 'operationsRouteController')
          .mockImplementation(() => mockHandler);
      });
      it('should properly handle route actions', async () => {
        payload2 = { ...payload2, callback_id: 'dummy_callback_id' };
        const result = await OperationsHandler.handleOperationsActions(payload2, respond);
        expect(OperationsHandler.operationsRouteController).toHaveBeenCalledWith('id');
        expect(mockHandler).toHaveBeenCalledWith(payload2, respond);
        expect(result).toEqual({ test: 'dummy test' });
      });
      it('should properly handle slack button actions', async () => {
        const result = await OperationsHandler.handleOperationsActions(payload2, respond);
        expect(OperationsHandler.operationsRouteController).toHaveBeenCalledWith('action');
        expect(mockHandler).toHaveBeenCalledWith(payload2, respond);
        expect(result).toEqual({ test: 'dummy test' });
      });
      it('should properly handle errors', async () => {
        payload2 = { ...payload2, callback_id: null };
        jest.spyOn(bugsnagHelper, 'log');
        await OperationsHandler.handleOperationsActions(payload2, respond);
        expect(bugsnagHelper.log).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('Operations Route Controller', () => {
  let respond;
  const fn = () => ({});
  beforeEach(() => {
    respond = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  describe('operations actions', () => {
    let payload;
    let getRouteRequestAndToken;
    let completeOperationsDeclineAction;
    let updateRouteRequest;
    let routeRequestId;
    let timeStamp;
    let channelId;
    beforeEach(() => {
      getRouteRequestAndToken = jest.spyOn(RouteRequestService, 'getRouteRequestAndToken');
      updateRouteRequest = jest.spyOn(RouteHelper, 'updateRouteRequest');
      completeOperationsDeclineAction = jest.spyOn(
        OperationsNotifications, 'completeOperationsDeclineAction'
      );
      payload = {
        submission: {
          declineReason: 'QQQQQQ', startDate: '31/01/2019', endDate: '20/02/2019'
        },
        actions: [{ name: 'action', value: 1 }],
        channel: { id: 1 },
        team: { id: 1 },
        original_message: { ts: 'timestamp' }
      };
      ({ channel: { id: channelId }, original_message: { ts: timeStamp } } = payload);
      ({ id: routeRequestId } = mockRouteRequestData);
    });

    describe('decline', () => {
      beforeEach(() => {
        payload = { ...payload, callback_id: 'operations_route_decline' };
        jest.spyOn(DialogPrompts, 'sendReasonDialog').mockImplementation(fn);
        jest.spyOn(OperationsNotifications, 'updateOpsStatusNotificationMessage')
          .mockImplementation();
      });
      it('should launch decline dialog prompt', async () => {
        getRouteRequestAndToken.mockResolvedValue(mockRouteRequestData);
        await OperationsHandler.handleOperationsActions(payload, respond);
        expect(DialogPrompts.sendReasonDialog).toHaveBeenCalledTimes(1);
      });
      it('should not launch decline dialog when request has been declined', async () => {
        const routeRequest = {
          ...mockRouteRequestData,
          status: 'Declined'
        };
        getRouteRequestAndToken.mockReturnValue(
          {
            botToken: 'botToken',
            routeRequest
          }
        );
        await OperationsHandler.handleOperationsActions(payload, respond);

        expect(DialogPrompts.sendReasonDialog)
          .not
          .toHaveBeenCalled();
        expect(OperationsNotifications.updateOpsStatusNotificationMessage)
          .toHaveBeenCalledWith(payload, routeRequest, 'botToken');
      });
      it('should not launch decline dialog when request has been approved', async () => {
        const routeRequest = {
          ...mockRouteRequestData,
          status: 'Approved'
        };
        getRouteRequestAndToken.mockReturnValue(
          {
            botToken: 'botToken',
            routeRequest
          }
        );
        await OperationsHandler.handleOperationsActions(payload, respond);
        expect(DialogPrompts.sendReasonDialog)
          .not
          .toHaveBeenCalled();
        expect(OperationsNotifications.updateOpsStatusNotificationMessage)
          .toHaveBeenCalledWith(payload, routeRequest, 'botToken');
      });
    });

    describe('operations declined request', () => {
      beforeEach(() => {
        const state = JSON.stringify({
          decline: {
            timeStamp, channelId, routeRequestId
          }
        });
        payload = {
          ...payload,
          callback_id: 'operations_route_declinedRequest',
          state,
          user: { id: 1 }
        };
        jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken')
          .mockResolvedValue('xxoop-sdsad');
        jest.spyOn(OperationsNotifications, 'completeOperationsDeclineAction')
          .mockResolvedValue();
        jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue({ id: 10 });
      });


      it('should complete decline action', async () => {
        getRouteRequestAndToken.mockResolvedValue({
          routeRequest: { ...mockRouteRequestData },
          slackBotOauthToken: 'dfdf'
        });
        updateRouteRequest.mockResolvedValue({
          ...mockRouteRequestData,
          status: 'Declined',
          opsComment: 'declined'
        });
        completeOperationsDeclineAction.mockResolvedValue();
        await OperationsHandler.handleOperationsActions(payload, respond);
        expect(UserService.getUserBySlackId).toHaveBeenCalled();
        expect(RouteHelper.updateRouteRequest).toHaveBeenCalled();
        expect(OperationsNotifications.completeOperationsDeclineAction).toHaveBeenCalled();
      });

      it('should handle errors', async () => {
        getRouteRequestAndToken.mockResolvedValue({ ...mockRouteRequestData });
        updateRouteRequest.mockImplementation(() => {
          throw new Error();
        });
        jest.spyOn(bugsnagHelper, 'log');
        await OperationsHandler.handleOperationsActions(payload, respond);
        expect(bugsnagHelper.log).toHaveBeenCalled();
        expect(respond.mock.calls[0][0].text).toEqual('Unsuccessful request. Kindly Try again');
      });
    });

    describe('operations route controller', () => {
      it('should return a function if action exist', () => {
        const result = OperationsHandler.operationsRouteController('decline');
        expect(result).toBeInstanceOf(Function);
      });
      it('should throw an error if action does exist', () => {
        try {
          OperationsHandler.operationsRouteController('doesNotExist')();
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect(e.message).toBe('Unknown action: operations_route_doesNotExist');
        }
      });
    });

    describe('handle operations actions', () => {
      let mockHandler;
      let payload2;
      beforeEach(() => {
        payload2 = {
          actions: [{ name: 'action', value: 1 }],
          callback_id: 'dummy_callback_actions',
          team: { id: 'TEAMID1' }
        };
        mockHandler = jest.fn().mockReturnValue({ test: 'dummy test' });
        jest.spyOn(OperationsHandler, 'operationsRouteController')
          .mockImplementation(() => mockHandler);
      });

      it('should properly handle route actions', async () => {
        payload2 = { ...payload2, callback_id: 'dummy_callback_id' };
        const result = await OperationsHandler.handleOperationsActions(payload2, respond);
        expect(OperationsHandler.operationsRouteController).toHaveBeenCalledWith('id');
        expect(mockHandler).toHaveBeenCalledWith(payload2, respond);
        expect(result).toEqual({ test: 'dummy test' });
      });

      it('should properly handle slack button actions', async () => {
        const result = await OperationsHandler.handleOperationsActions(payload2, respond);
        expect(OperationsHandler.operationsRouteController).toHaveBeenCalledWith('action');
        expect(mockHandler).toHaveBeenCalledWith(payload2, respond);
        expect(result).toEqual({ test: 'dummy test' });
      });
      it('should properly handle errors', async () => {
        payload2 = { ...payload2, callback_id: null };
        jest.spyOn(bugsnagHelper, 'log');
        await OperationsHandler.handleOperationsActions(payload2, respond);
        expect(bugsnagHelper.log).toHaveBeenCalledTimes(1);
        expect(respond).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe(OperationsHandler.completeOpsAssignCabDriver, () => {
  const mockTrip = {
    rider: { slackId: 'slack' },
    requester: { slackId: 'slackx' },
    id: 1,
  };
  const mockCab = {
    id: 1,
    regNumber: 'KJK-LKS-123',
    capacity: 4,
    model: 'Avensis'
  };
  const mockDriver = {
    id: 1,
    driverName: 'Bimbo Alake',
    driverPhoneNo: '+2348108746839'
  };

  beforeEach(() => {
    jest.spyOn(tripService, 'updateRequest').mockResolvedValue(mockTrip);
    jest.spyOn(TripJobs, 'scheduleTakeOffReminder').mockResolvedValue();
    jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValue({ id: 'id' });
    jest.spyOn(bugsnagHelper, 'log').mockResolvedValue(null);
    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xoxp-11');
    jest.spyOn(DriverNotifications, 'checkAndNotifyDriver').mockResolvedValue(null);
    jest.spyOn(cabService, 'getById').mockResolvedValue(mockCab);
    jest.spyOn(driverService, 'getDriverById').mockResolvedValue(mockDriver);
    jest.spyOn(InteractivePrompts, 'messageUpdate').mockResolvedValue(null);
    jest.spyOn(OperationsHelper, 'getTripDetailsAttachment').mockResolvedValue(null);
    jest.spyOn(TripJobs, 'scheduleTakeOffReminder').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should log error if it occurs', async () => {
    jest.spyOn(cabService, 'getById').mockRejectedValue(new Error('mock error'));
    await OperationsHandler.completeOpsAssignCabDriver(completeOpsAssignCabPayload);
    expect(bugsnagHelper.log).toBeCalledTimes(1);
  });

  it('should complete driver and cab provisioning', async () => {
    const teamId = 'UT1234';
    jest.spyOn(OperationsHelper, 'sendCompleteOpAssignCabMsg').mockResolvedValue(null);
    await OperationsHandler.sendAssignCabDriverNotifications(teamId, mockTrip, mockCab,
      mockDriver, mockTrip.requester.slackId, mockTrip.rider.slackId, 'Channel', '1334141');
    expect(teamDetailsService.getTeamDetailsBotOauthToken).toBeCalled();
    expect(InteractivePrompts.messageUpdate).toBeCalled();
    expect(OperationsHelper.sendCompleteOpAssignCabMsg)
      .toHaveBeenCalledWith(teamId, {
        requesterSlackId: mockTrip.requester.slackId,
        riderSlackId: mockTrip.rider.slackId
      }, expect.any(Object));
  });
});
