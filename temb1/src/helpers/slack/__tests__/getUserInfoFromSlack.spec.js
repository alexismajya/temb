import { teamDetailsService } from '../../../modules/teamDetails/teamDetails.service';
import SlackHelpers from '../slackHelpers';

jest.mock('@slack/client', () => ({
  WebClient: jest.fn(() => ({
    users: {
      info: () => ({
        user: {
          tz_offset: 3600,
          id: '23MTU2',
          name: 'sande'
        }
      })
    }
  }))
}));

jest
  .spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue({ botToken: '2323' });

describe('test getUserInfoFromSlack by slackId ', () => {
  beforeEach(() => {
    SlackHelpers.findOrCreateUserBySlackId = jest.fn(() => ({
      username: 'santos',
      email: 'tembea@tem.com'
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return existing user', async () => {
    const result = await SlackHelpers.getUserInfoFromSlack('23MTU2', 'TI34DJ');
    expect(result).toEqual({ id: '23MTU2', name: 'sande', tz_offset: 3600 });
    expect(teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
  });
});
