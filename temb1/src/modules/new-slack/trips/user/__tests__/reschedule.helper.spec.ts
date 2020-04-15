import RescheduleHelper from '../reschedule.helper';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import { SlackViews } from '../../../extensions/SlackViews';

describe(RescheduleHelper, () => {
  const teamdetails = { teamId: 'U123', botToken: 'xoxp-123' };
  const tripId = 123;

  beforeAll(async() => {
    jest.mock('../../../extensions/SlackViews');
    jest.spyOn(SlackViews.prototype, 'open');
    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken')
      .mockResolvedValue(teamdetails.botToken);
  });

  describe(RescheduleHelper.getRescheduleModal, () => {
    it('should add reschedullar modal', () => {
      const func = RescheduleHelper.getRescheduleModal(tripId, teamdetails.botToken);
      expect(typeof func).toBe('object');
      expect(func.type).toEqual('modal');
      expect(func.title.text).toEqual('Reschedule Trip');
    });
  });

  describe(RescheduleHelper.sendRescheduleModal, () => {
    it('should send reschedule modal', async () => {
      const payloadData = {
        team:{
          id: teamdetails.teamId,
        },
        trigger_id: '123',
      };
      await RescheduleHelper.sendRescheduleModal(payloadData, tripId);
      expect(SlackViews.prototype.open)
        .toHaveBeenCalledWith(payloadData.trigger_id, expect.any(Object));
    });
  });
});
