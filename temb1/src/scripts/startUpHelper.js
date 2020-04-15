import bugsnagHelper from '../helpers/bugsnagHelper';
import database from '../database';
import { roleService } from '../modules/roleManagement/role.service';
import cache from '../modules/shared/cache';
import RouteEventHandlers from '../modules/events/route-events.handlers';
import TripEventsHandlers from '../modules/events/trip-events.handlers';
import TravelEventHandlers from '../modules/events/travel-events.handlers';
import { reportEventHandler } from '../modules/events/reports-events.handlers';
import { feedbackEventHandler } from '../modules/events/feedback.event.handlers';

const { models: { User } } = database;

class StartUpHelper {
  static async ensureSuperAdminExists() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const slackId = process.env.SUPER_ADMIN_SLACK_ID;
    const userName = StartUpHelper.getUserNameFromEmail(email);
    const {
      APPRENTICESHIP_SUPER_ADMIN_EMAIL: email2,
      APPRENTICESHIP_SUPER_ADMIN_SLACK_ID: slackId2
    } = process.env;

    try {
      const user1Promise = User.findOrCreate({
        where: { email },
        defaults: { slackId, name: userName }
      });

      const user2Promise = User.findOrCreate({
        where: { email: email2 },
        defaults: { slackId: slackId2, name: StartUpHelper.getUserNameFromEmail(email2) }
      });

      const [[user], [user2]] = await Promise.all([user1Promise, user2Promise]);
      const [role] = await roleService.createOrFindRole('Super Admin');
      await Promise.all([
        roleService.findOrCreateUserRole(user.id, role.id, user.homebaseId),
        roleService.findOrCreateUserRole(user2.id, role.id, user2.homebaseId)
      ]);
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static async flushStaleCache() {
    cache.flush();
  }

  static getUserNameFromEmail(email) {
    let firstName;

    [firstName] = email.split('@');
    const getIndex = firstName.indexOf('.');
    if (getIndex === -1) { return firstName.charAt(0).toUpperCase() + firstName.slice(1); }
    const fullName = email.split('@')[0].split('.');
    [firstName] = fullName;
    const firstNameCapitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const lastName = fullName[fullName.length - 1];
    const lastNameCapitalized = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    return `${firstNameCapitalized} ${lastNameCapitalized}`;
  }

  static registerEventHandlers() {
    RouteEventHandlers.init();
    TripEventsHandlers.init();
    TravelEventHandlers.init();
    reportEventHandler.init();
    feedbackEventHandler.init();
  }
}

export default StartUpHelper;
