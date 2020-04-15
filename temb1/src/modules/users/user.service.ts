import { WebClient } from '@slack/client';
import database, { User, Op, Homebase, Role, TripRequest, BatchUseRecord } from '../../database';
import HttpError from '../../helpers/errorHandler';
import { teamDetailsService } from '../teamDetails/teamDetails.service';
import { BaseService, IReturningOptions } from '../shared/base.service';
import { Includeable } from 'sequelize/types';
import tripService from '../trips/trip.service';

export interface KeyValue {
  [key: string]: string;
}

export interface ISlackProfile {
  avatar_hash: string;
  real_name: string;
  display_name: string;
  email: string;
  team: string;
  [key: string]: string;
}

export interface ISlackUserInfo {
  id: string;
  team_id: string;
  name: string;
  deleted: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  profile: ISlackProfile;
}

export interface IPageArgs {
  page: number;
  size: number;
}

export class UserService extends BaseService<User, number> {
  private readonly defaultInclude: Includeable[];
  constructor(model = database.getRepository(User)) {
    super(model);
    this.defaultInclude = ['roles', 'homebase', 'routeBatch'];
  }
    /**
     * @description Fetch the user's slack info
     * @param  {object} web The slack web client
     * @param  {string} email The user's email on slack
     * @return {object} The slack information
     */
  async getUserSlackInfo(web: any, email: string): Promise<ISlackUserInfo> {
    try {
      const userInfo = await web.users.lookupByEmail({
        email: email.trim(),
      });
      return userInfo.ok ? userInfo.user : null;
    } catch (error) {
      HttpError.throwErrorIfNull(
          null,
          'User not found. If your are providing a newEmail, '
          + 'it must be the same as the user\'s email on slack',
          424,
        );
    }
  }

  /**
   * @description Get the user by email from the database
   * @param  {string} email The email of the user on the db
   * @returns {object} The http response object
   */
  async getUser(email: string) {
    try {
      const user = await this.findOneByProp({ prop: 'email', value: email });
      HttpError.throwErrorIfNull(user, 'User not found');
      return user;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      HttpError.throwErrorIfNull(null, 'Could not find user with specified email', 500);
    }
  }

  async findOrCreateNewUserWithSlackId(user: any) {
    const [newUser] = await this.model.findOrCreate({
      where: { slackId: user.slackId },
      defaults: { name: user.name, email: user.email },
    });
    return newUser.get({ plain: true }) as User;
  }

   /**
   * @description Saves the new user record
   * @param  {object} user The user object returned by the database
   * @param  {object} slackUserInfo The information returned from slack on `users.lookupByEmail`
   * @param  {string} newName The new user's name
   * @param  {string} newEmail The new user's email
   * @param  {string} newPhoneNo The new user's phone number
   * @returns {object} The newly updated user info
   */
  async saveNewRecord(user: User, slackUserInfo: ISlackUserInfo,
    newName?: string, newEmail?: string, newPhoneNo?: string) {
    const updated = await this.update(user.id, {
      slackId: slackUserInfo.id,
      name: (newName || user.name).trim(),
      email: (newEmail || user.email).trim(),
      phoneNo: (newPhoneNo || user.phoneNo).trim(),
    }, { returning: true });
    return updated;
  }

    /**
   * @description Creates a new user
   * @param  {object} slackUserInfo The information returned from slack on `users.lookupByEmail`
   * @returns {object} The new user info
   */
  async createNewUser(slackUserInfo: ISlackUserInfo) {
    try {
      const { id, profile: { real_name, email } } = slackUserInfo;
      const user = await this.add({ email, slackId: id, name: real_name });
      return user;
    } catch (error) {
      HttpError.throwErrorIfNull(null, 'Could not create user', 500);
    }
  }

  async getUserInfo(slackUrl: string, email: string, newEmail?: string) {
    const slackClient = await this.getSlackClient(slackUrl);
    // Get user's slack Id
    const result = await this.getUserSlackInfo(slackClient, newEmail || email);
    return result;
  }

    /**
   * @description Get's paginated user records from db
   * @param  {number} size The size of a single page
   * @param  {number} page The page number
   * @returns {object} An array of users
   */
  async getUsersFromDB(size: number, page: number, filter: string) {
    let defaultOptions: object = {
      order: [['id', 'DESC']],
      include: [{ model: Homebase, attributes: ['name'] }, { model: Role, attributes: ['name'] }],
    };
    if (filter) {
      defaultOptions = {
        where: { name: { [Op.iLike]:`%${filter}%` } },
        order: [['id', 'DESC']],
        include: [{ model: Homebase, attributes: ['name'] }, { model: Role, attributes: ['name'] }],
      };
    }
    const users = await this.getPaginated({
      page,
      defaultOptions,
      limit: size,
    });

    return {
      rows: users.data,
      count: users.pageMeta.count,
    };
  }

  async getPagedFellowsOnOrOffRoute(onRoute: boolean = true,
    { size, page }: IPageArgs, filterBy: any) {
    const { homebaseId } = filterBy;
    const routeBatchCriteria = onRoute ? { [Op.ne]: null } as KeyValue : { [Op.eq]: null };
    const results = await this.getPaginated({
      page, limit: size,
      defaultOptions: {
        where: {
          homebaseId,
          email: {
            [Op.iLike]: '%andela.com',
            [Op.notILike]: '%apprenticeship@andela.com',
          },
          routeBatchId: routeBatchCriteria,
        },
      },
    });

    return {
      data: results.data,
      pageMeta: {
        totalPages: results.pageMeta.totalPages,
        currentPage: results.pageMeta.page,
        limit: results.pageMeta.limit,
        totalItems: results.pageMeta.count,
      },
    };
  }

  getUserById = async (id: number) => this.findById(id);

    /**
 * @static async getUserBySlackId
 * @description this methods queries the DB for users by slackId
 * @param {*} slackId
 * @returns user object
 */
  getUserBySlackId = async (slackId: string) => this.findOneByProp({
    prop: 'slackId', value: slackId,
  }, ['homebase'])

  /**
 * @static async getUserByEmail
 * @description this methods queries the DB for users by slackId
 * @param {string} email - the user email to find by
 * @param {object} options - additional options
 * @returns {object} user object
 */
  getUserByEmail = async (email:string, withFk = false) => this.findOneByProp({
    prop: 'email', value: email,
  }, withFk ? this.defaultInclude : [])

 /**
 * @static async updateUser
 * @description this methods updates user details by user id
 * @param {number} id
 * @param {object} updateObject
 * @returns user object
 */
  updateUser = async (id: number, updateObject:any,
    returning?: IReturningOptions) => this.update(id, updateObject, returning)

  /**
   * @static async deleteUser
   * @description this methods deletes user by user email
   * @param {number} id
   */
  deleteUser = async (id: number) => this.delete(id);

    /**
   * @static async update User HomeBase
   * @description this methods updates user's home base
   * @param {number} userSlackId
   * @param {string} homeBaseId
   * @returns user's homebase ID
   */
  async updateDefaultHomeBase(userSlackId: string, homebaseId: number) {
    const { id: userId } = await this.getUserBySlackId(userSlackId);
    await this.updateUser(userId, { homebaseId });
    return homebaseId;
  }

    /**
     * @static async create user by email
     * @description this methods creates a user by email if they exist on the workspace
     * @param {string} email of the user
     * @param {string} teamUrl of the slack workspace
     * @returns {boolean} true if user is created else false
     */
  async createUserByEmail(teamUrl: string, email: string) {
    const userInfo = await this.getUserInfo(teamUrl, email, '');
    if (!userInfo) {
      throw new Error('user does not exist on this  workspace');
    }
    const user = await this.findOrCreateNewUserWithSlackId({
      slackId: userInfo.id, name: userInfo.real_name, email: userInfo.profile.email,
    });
    return user;
  }

  async getSlackClient(slackUrl: string) {
    const teamDetails = await teamDetailsService.getTeamDetailsByTeamUrl(slackUrl);
      // Create the web client from team details
    if (!teamDetails) throw new HttpError('Slack team not found', 404);
    const web = new WebClient(teamDetails.botToken);
    return web;
  }

  async getWeeklyCompletedTrips(date: string) {
    const where = tripService.sequelizeWhereClauseOption({
      departureTime: { after: date },
      status: 'Completed',
    });
    return this.findAll({
      attributes: ['id', 'email', 'name'],
      include: [{ where,
        model: TripRequest,
        required: true,
        attributes: ['id', 'name', 'tripType'],
      }],
    });
  }

  async getWeeklyCompletedRoutes(date: string) {
    const where = {
      userAttendStatus: 'Confirmed',
      createdAt: {
        [Op.gte]: date,
      },
    };
    return this.findAll({
      attributes: ['id', 'email', 'name'],
      include: [{ where, model: BatchUseRecord, required: true }],
    });
  }

  async getUsersSlackId() {

    const users = await this.findAll({
      attributes: ['slackId', 'name'],
    });
    return users;
  }
}

const userService = new UserService();
export default userService;
