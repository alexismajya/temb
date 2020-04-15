import Interactions from './interactions';
import managerTripActions from './constants';
import TripController from './trip.controller';
import TripHelpers from './trip.helpers';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import NewSlackHelpers from '../../helpers/slack-helpers';
import { TripStatus } from '../../../../database/models/trip-request';
import { BlockMessage } from '../../models/slack-block-models';

describe(TripController, () => {
  const basePayload = {
    channel: {
      id: 'U12SH',
    },
    user: {
      id: 'UIS233',
    },
    team: { id: 'UIS233' },
    response_url: 'http://url.com',
  };
  const mockPayload = (action: managerTripActions) => ({
    actions: [{ action_id: action, value: '1' }],
    ...basePayload,
  });
  const mockTripState = (state = TripStatus.pending) => ({
    currentState: state, lastActionById: 'U123'});
  const approvalPayload = mockPayload(managerTripActions.approve);

  beforeEach(() => {
    jest.spyOn(NewSlackHelpers, 'getTripState').mockResolvedValue(mockTripState());
    jest.spyOn(UpdateSlackMessageHelper, 'newUpdateMessage').mockResolvedValue(null);
    jest.spyOn(TripHelpers, 'getManagerApprovedOrDeclineMessage')
      .mockResolvedValue(new BlockMessage([]));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(TripController.approve, () => {
    beforeEach(() => {
      jest.spyOn(Interactions, 'sendReasonForm').mockResolvedValue(null);
    });

    afterEach(() => jest.restoreAllMocks());

    it('should send status message when trip is not pending', async () => {
      jest.spyOn(NewSlackHelpers, 'getTripState')
        .mockResolvedValue(mockTripState(TripStatus.confirmed));
      await TripController.approve(approvalPayload);
      expect(UpdateSlackMessageHelper.newUpdateMessage).toHaveBeenCalled();
    });

    describe('approval', () => {
      it('should submit reason for approving', async () => {
        const state = { origin: approvalPayload.response_url,
          isApproval: 1,
          tripId: approvalPayload.actions[0].value };
        await TripController.approve(approvalPayload);
        expect(Interactions.sendReasonForm).toHaveBeenCalledWith(approvalPayload, state);
      });
    });

    describe('decline', () => {
      const declinePayload = mockPayload(managerTripActions.decline);

      it('should submit reason for declining', async () => {
        const state = { origin: declinePayload.response_url,
          isApproval: 0,
          tripId: declinePayload.actions[0].value };
        await TripController.approve(declinePayload);
        expect(Interactions.sendReasonForm).toHaveBeenCalledWith(declinePayload, state);
      });
    });
  });

  describe(TripController.completeApproveOrDecline, () => {
    const completion = {
      ...basePayload,
      submission: {
        reason: 'Good reason',
      },
      state: JSON.stringify({ origin: 'http://url.com', tripId:'1', isApproval: 1 }),
    };
    const mockTeamDetails = { teamId: completion.team.id, botToken: 'xoxp-completion-123' };

    beforeEach(() => {
      jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue(mockTeamDetails);
      jest.spyOn(TripHelpers, 'completeManagerResponse').mockResolvedValue(null);
      jest.spyOn(TripHelpers, 'notifyManagerIfOpsApproved').mockResolvedValue(null);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('Manager should approve a trip', async () => {
      await TripController.completeApproveOrDecline(completion);
      expect(UpdateSlackMessageHelper.newUpdateMessage).toHaveBeenCalled();
      expect(TripHelpers.notifyManagerIfOpsApproved).toHaveBeenCalledWith(
        1, completion.channel.id, mockTeamDetails.botToken,
      );
    });

    it('Manager should decline a trip', async () => {
      const decline = { ...completion, state: JSON.stringify({
        origin: 'http://url.com', tripId:'1', isApproval: 0,
      })};

      await TripController.completeApproveOrDecline(decline);
      expect(UpdateSlackMessageHelper.newUpdateMessage).toHaveBeenCalled();
      expect(TripHelpers.notifyManagerIfOpsApproved).toHaveBeenCalledWith(
        1, decline.channel.id, mockTeamDetails.botToken,
      );
    });

    it('Manager should receive trip status', async () => {
      jest.spyOn(NewSlackHelpers, 'getTripState')
        .mockResolvedValue(mockTripState(TripStatus.confirmed));
      await TripController.completeApproveOrDecline(completion);
      expect(UpdateSlackMessageHelper.newUpdateMessage).toHaveBeenCalled();
      expect(TripHelpers.notifyManagerIfOpsApproved).not.toHaveBeenCalled();
    });
  });
});
