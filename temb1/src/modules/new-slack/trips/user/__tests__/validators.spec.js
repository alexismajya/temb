import moment from 'moment';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import NewSlackHelpers from '../../../helpers/slack-helpers';
import Validators from '../validators';

describe('Validators', () => {
  const payload = {
    submission: {
      pickup: 'Nairobi',
      othersPickup: null,
      dateTime: moment().add(1, 'days').format('DD/MM/YYYY HH:mm'), // '22/12/2019 22:00'
    },
    team: {
      id: 'HGYYY667'
    },
    user: {
      id: 'HUIO56LO'
    },
    state: '{ "origin": "https://origin.com"}'
  };

  describe('validatePickUpSubmission', () => {
    it('should validate pickup submission successfully', async () => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('botToken');
      jest.spyOn(NewSlackHelpers, 'getUserInfo').mockResolvedValue({ tz: 'America/Los_Angeles' });
      await Validators.validatePickUpSubmission(payload);
      expect(teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalled();
      expect(NewSlackHelpers.getUserInfo).toHaveBeenCalledWith(payload.user.id, 'botToken');
    });
  });
});
