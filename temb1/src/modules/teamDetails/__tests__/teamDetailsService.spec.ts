import { teamDetailsService } from '../teamDetails.service';
import database from '../../../database';
import cache from '../../shared/cache';
import mockedTeamDetails from '../__mocks__/mockData';

const { models: { TeamDetails } } = database;

describe('Team details service', () => {
  const data = mockedTeamDetails;

  beforeAll(() => {
    cache.fetch = jest.fn((teamId) => {
      if (teamId === 'SAVEDTEAMID') {
        return {
          data,
        };
      }
    });
  });

  it('should get team details from cache', async () => {
    jest.spyOn(TeamDetails, 'findOne').mockResolvedValue(data);
    jest.spyOn(cache, 'fetch').mockResolvedValue(data);
    const teamDetails = await teamDetailsService.getTeamDetails('SAVEDTEAMID');
    expect(teamDetails).toEqual(data);
  });

  it('should fetch team details from DB', async (done) => {
    jest.spyOn(cache, 'fetch').mockResolvedValue(data);
    jest.spyOn(TeamDetails, 'findByPk').mockReturnValue({ teamId: 'SAVEDTEAMID', teamName: 'T1' });
    const teamDetails = await teamDetailsService.getTeamDetails('SAVEDTEAMID');

    expect(teamDetails).toEqual(data);
    done();
  });

  it('should throw a db error', async () => {
    try {
      await teamDetailsService.getTeamDetails('');
    } catch (error) {
      expect(error.message).toBe('Could not get team details from DB');
    }
  });

  it('should save new team details', async () => {
    const result = await teamDetailsService.saveTeamDetails({
      botId: 'XXXXXXX',
      botToken: 'XXXXXXXXXXXXX',
      teamId: 'XXXXXXX',
      teamName: 'Fake Team',
      userId: 'XXXXXXXXXXXXX',
      userToken: 'XXXXXXXXXXX',
      webhookConfigUrl: 'XXXXXXXXXXXXX',
      opsChannelId: 'XXXXXXXXXXXXX',
      teamUrl: 'faketeam.slack.come',
    });

    expect(result).toEqual({
      botId: 'XXXXXXX',
      botToken: 'XXXXXXXXXXXXX',
      teamId: 'XXXXXXX',
      teamName: 'Fake Team',
      userId: 'XXXXXXXXXXXXX',
      userToken: 'XXXXXXXXXXX',
      webhookConfigUrl: 'XXXXXXXXXXXXX',
      opsChannelId: 'XXXXXXXXXXXXX',
      teamUrl: 'faketeam.slack.come',
    });
  });

  it('should throw an error on team details', async () => {
    jest.spyOn(TeamDetails, 'upsert').mockRejectedValue(new Error());
    try {
      await teamDetailsService.saveTeamDetails({ teamId: 'TSTDST' });
    } catch (error) {
      expect(error.message).toEqual('Could not update teamDetails or write new teamDetails to DB');
    }
  });

  describe('TeamDetailsService_getAllTeams', () => {
    beforeEach(() => {
      jest.spyOn(TeamDetails, 'findAll').mockResolvedValue(data);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should fetch all team details from DB', async () => {
      const allTeams = await teamDetailsService.getAllTeams();

      expect(TeamDetails.findAll).toBeCalled();
      expect(allTeams[0].teamId).toEqual('SAVEDTEAMID');
      expect(allTeams).not.toBeNaN();
    });

    it('should throw an error when it cannot get team details', async () => {
      jest.spyOn(TeamDetails, 'findAll').mockImplementation(() => {
        throw new Error();
      });
      try {
        await teamDetailsService.getAllTeams();
      } catch (error) {
        expect(error.message).toEqual('Could not get all teamDetails from DB');
      }
    });
  });
});

describe('getTeamDetailsByTeamUrl', () => {
  const teamUrl = 'teamUrl';
  const data = { data: 'team details' };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(TeamDetails, 'findOne').mockResolvedValue(data);
  });

  it('should fetch team details from catch', async () => {
    jest.spyOn(cache, 'fetch').mockResolvedValue(data);
    const result = await teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
    expect(TeamDetails.findOne).not.toHaveBeenCalled();
    expect(cache.fetch).toHaveBeenCalled();
    expect(result).toEqual(data);
  });

  it('should fetch team details from database and save it in cache', async () => {
    jest.spyOn(cache, 'fetch').mockResolvedValue(null);
    jest.spyOn(TeamDetails, 'findOne').mockResolvedValue(data);
    cache.saveObject = jest.fn(() => { });

    const result = await teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
    expect(cache.saveObject).toBeCalledWith(`TEMBEA_V2_TEAMDETAILS_${teamUrl}`, data);
    expect(result).toEqual(data);
  });

  it('should fail on get team details by URL', async () => {
    cache.fetch = jest.fn(() => null);
    TeamDetails.findOne = jest.fn(() => Promise.reject(new Error('')));

    expect(teamDetailsService.getTeamDetailsByTeamUrl(teamUrl))
      .rejects.toThrow('Could not get the team details.');
  });
});
