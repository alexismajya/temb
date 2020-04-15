import database, { Role, User, UserRole, Homebase } from '../../database';
import HttpError from '../../helpers/errorHandler';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import { BaseService } from '../shared/base.service';
import userService from '../users/user.service';
import SlackNotifications from '../slack/SlackPrompts/Notifications';
import dotenv from 'dotenv-extended';

dotenv.load();

const botToken = process.env.SLACK_BOT_OAUTH_TOKEN;

export default class RoleService extends BaseService<Role, number> {
  constructor(model = database.getRepository(Role)) {
    super(model);
  }
  /**
   * @description create new user role
   * @param  {string} name The role name
   * @returns {object} The role object
   */
  async createNewRole(name: string): Promise<Role> {
    const [role, created] = await this.createOrFindRole(name);
    if (created) {
      return role;
    }

    HttpError.throwErrorIfNull(false, 'Role already exists', 409);
  }

  async getRoles(): Promise<Role[]> {
    const roles = await this.findAll({});
    HttpError.throwErrorIfNull(roles, 'No Existing Roles');

    return roles;
  }

  async getUserRoles(email: string): Promise<UserRole[]> {
    const user = await User.findOne({ where: { email } });
    const roles = await this.findUserRoles(user.id);
    HttpError.throwErrorIfNull(roles[0], 'User has no role');

    return roles;
  }

  async getRole(name: string): Promise<Role> {
    const role = await this.findOneByProp({ prop: 'name', value: name });
    HttpError.throwErrorIfNull(role, 'Role not found');

    return role;
  }

  async createUserRole(email: string, roleName: string, homebaseId: number): Promise<Boolean> {
    const [user, role] = await Promise.all([
      userService.getUser(email),
      this.getRole(roleName),
    ]);

    try {
      await UserRole.create({ homebaseId, userId: user.id, roleId: role.id });
      const text = `Dear ${user.name}, you have been assigned the ${roleName} role on Tembea`;
      await this.notifyUser(user, text);
    } catch (e) {
      bugsnagHelper.log(e);
      HttpError.throwErrorIfNull('', 'This Role is already assigned to this user', 409);
    }
    return true;
  }

  async createOrFindRole(name: string): Promise<[Role, Boolean]> {
    const role = await this.model.findOrCreate({ where: { name } });
    return role;
  }

  async findUserRoles(userId: number): Promise<UserRole[]> {
    const result = await UserRole.findAll(
      {
        where: { userId },
        include: [{ model: Homebase }, { model: Role }],
      },
    );
    return result;
  }

  async findOrCreateUserRole(userId: number, roleId: number, homebaseId: number):
    Promise<[UserRole, Boolean]> {
    const result = await UserRole.findOrCreate({ where: { userId, roleId, homebaseId } });
    return result;
  }

  async deleteUserRole(userId: number) {
    const result = await UserRole.destroy({ where: { userId } });
    const user = await userService.getUserById(userId);
    const text = `Dear ${user.name}, your role on Tembea has been revoked`;
    await this.notifyUser(user, text);
    return result;
  }

  private async notifyUser(user: User, text: string) {
    try {
      const { slackId } = user;
      const directMessageId = await SlackNotifications.getDMChannelId(slackId,
        botToken);
      const message = SlackNotifications.createDirectMessage(directMessageId,
        text);
      await SlackNotifications.sendNotification(message, botToken);
    } catch (error) { bugsnagHelper.log(error); }
  }
}

export const roleService = new RoleService();
