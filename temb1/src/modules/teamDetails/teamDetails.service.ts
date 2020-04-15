import { RootService } from '../shared/base.service';
import sequelize from 'sequelize';
import database , { TeamDetails } from '../../database';
import cache from '../shared/cache';
import bugsnagHelper from '../../helpers/bugsnagHelper';

const getTeamDetailsKey = (teamId: string) => `TEMBEA_V2_TEAMDETAILS_${teamId}`;

export default class TeamDetailsService extends RootService<TeamDetails >{
  constructor(model = database.getRepository(TeamDetails)) {
    super(model);
  }

  async getTeamDetailsByToken(botToken: string): Promise<TeamDetails> {
    try {
      const result = this.findOneByProp({ prop: 'botToken', value: botToken });
      return result;
    } catch (error) {
      bugsnagHelper.log(error);
      throw new Error('Could not get team details by token from DB');
    }
  }

  async getTeamDetails(teamId: string) {
    const fetchedValue = await cache.fetch(getTeamDetailsKey(teamId));
    if (fetchedValue) {
      return fetchedValue;
    }
    try {
      const result = await this.findOneByProp({ prop: 'teamId', value: teamId });
      await cache.saveObject(getTeamDetailsKey(teamId), result);
      return result;
    } catch (error) {
      bugsnagHelper.log(error);
      throw new Error('Could not get team details from DB');
    }
  }

  async getTeamDetailsByTeamUrl(teamUrl: string) {
    const fetchedValue = await cache.fetch(getTeamDetailsKey(teamUrl));
    if (fetchedValue) {
      return fetchedValue;
    }
    try {
      const teamDetails = await TeamDetails.findOne({
        raw: true,
        where: {
          teamUrl: { [sequelize.Op.or]: [`https://${teamUrl}`, teamUrl] },
        },
      });
      await cache.saveObject(getTeamDetailsKey(teamUrl), teamDetails);
      return teamDetails;
    } catch (error) {
      bugsnagHelper.log(error);
      throw new Error('Could not get the team details.');
    }
  }

  async getTeamDetailsBotOauthToken(teamId: string) {
    const {
      botToken,
    } = await this.getTeamDetails(teamId);
    return botToken;
  }

  async getAllTeams() {
    try {
      const allTeams = await this.findAll({});
      return allTeams;
    } catch (error) {
      // bugsnagHelper.log(error);
      throw new Error('Could not get all teamDetails from DB');
    }
  }

  async saveTeamDetails(teamObject: IteamDetails) {
    try {
      await TeamDetails.upsert({ ...teamObject });
      await cache.saveObject(getTeamDetailsKey(teamObject.teamId), teamObject);
      return teamObject;
    } catch (error) {
      bugsnagHelper.log(error);
      throw new Error(
        'Could not update teamDetails or write new teamDetails to DB',
      );
    }
  }
}

interface IteamDetails {
  teamId: string;
  botId?: string;
  botToken?: string;
  teamName?: string;
  userId?: string;
  userToken?: string;
  webhookConfigUrl?: string;
  opsChannelId?: string;
  teamUrl?:string;
}

export const teamDetailsService = new TeamDetailsService();
