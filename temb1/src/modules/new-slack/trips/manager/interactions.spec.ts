import DialogPrompts from '../../../slack/SlackPrompts/DialogPrompts';
import Interactions from './interactions';
import { TripStatus } from '../../../../database/models/trip-request';
import TripHelpers from '../manager/trip.helpers';
import { trip } from '../__mocks__/trip';
import BugsnagHelper from '../../../../helpers/bugsnagHelper';
import SlackNotifications from '../../../slack/SlackPrompts/Notifications';

describe(Interactions, () => {
  let payload: object;
  let state: import('./interactions').ManagerTripReasonOptions;
  let dialogSpy: any;
  let action: any;

  beforeEach(() => {
    payload = { user: { id: 'U1567' } };
    state = { origin: 'https;//github.com', tripId: '39', isApproval: 1 };
    action = 'Approval' || 'Decline';
    dialogSpy = jest.spyOn(DialogPrompts, 'sendDialog').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  describe('sendTripReasonForm', () => {
    it('should send trip reason form', async () => {
      await Interactions.sendReasonForm(payload, state);
      expect(dialogSpy).toHaveBeenCalledTimes(1);
      expect(dialogSpy).toHaveBeenCalledWith((expect.objectContaining({
        title: `Reason for ${action}`,
        submit_label: 'Submit',
      })), payload);
    });
  });
  describe('sendOpsDeclineOrApprovalCompletion', () => {
    const status = { ...trip, lastActionById: 'UP0V0HLQ3', currentState: '' };
    it('should send ops decline or approval', async () => {
      status.currentState = TripStatus.declinedByOps;
      const getApprovalOrDeclineMessage = jest.spyOn(TripHelpers, 'getApprovalOrDeclineMessage')
                  .mockResolvedValue({ trip, status, channel:'channelId', userId: 'UP0V0HLQ3' });

      await Interactions.sendOpsDeclineOrApprovalCompletion(
                  false, trip, '3456787654.3456787654', 'DM45676543', 'http://www.slacktembea.com',
                );
      expect(getApprovalOrDeclineMessage).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      jest.spyOn(BugsnagHelper, 'log').mockResolvedValue('error');
      const data:any = {
        name: null,
        origin: { address: null },
        destination:
          { address: null },
        requester: { slackId: null },
      };
      await Interactions.sendOpsDeclineOrApprovalCompletion(data, 'botToken');

      expect(BugsnagHelper.log).toBeCalled();
    });
  });
  describe('sendRequesterApprovedNotification', () => {
    let sendNotification: any;
    beforeEach(() => {
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('YES');
      jest.spyOn(TripHelpers, 'getApprovedMessageOfRequester').mockResolvedValue(['message']);
      sendNotification = jest.spyOn(SlackNotifications, 'sendNotification');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should successfully send approve notification to requester', async () => {
      const responseData = { ...trip, requester: { slackId: 2 },
        managerComment: 'Hello',
        distance: '12km',
        reason: 'Hey',
        noOfPassengers: 2,
        approvedById: 3,
        tripType: 'Regular Trip',
      } as any;
      sendNotification.mockResolvedValueOnce(null);

      await Interactions
        .sendRequesterApprovedNotification(responseData, 'slackBotOauthToken');

      expect(sendNotification).toHaveBeenCalledTimes(1);
    });

    it('should handle error', async () => {
      jest.spyOn(BugsnagHelper, 'log').mockResolvedValue('error');
      const data:any = {
        name: null,
        origin: { address: null },
        destination:
        { address: null },
        requester: { slackId: null },
      };
      sendNotification.mockRejectedValueOnce(new Error());

      await Interactions
        .sendRequesterApprovedNotification(data, 'botToken');

      expect(BugsnagHelper.log).toBeCalled();
    });
  });
});
