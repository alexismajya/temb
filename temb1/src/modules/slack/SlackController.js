import {
  SlackInteractiveMessage,
  SlackAttachment,
  SlackButtonAction,
  SlackCancelButtonAction
} from './SlackModels/SlackMessageModels';
import { isSlackSubCommand } from './helpers/slackHelpers/slackValidations';
import { SlackText } from '../new-slack/models/slack-block-models';
import WebClientSingleton from '../../utils/WebClientSingleton';
import Response from '../../helpers/responseHelper';
import HttpError from '../../helpers/errorHandler';
import BugsnagHelper from '../../helpers/bugsnagHelper';
import { homebaseService } from '../homebases/homebase.service';
import { addressService } from '../addresses/address.service';
import SlackHelpers from '../../helpers/slack/slackHelpers';
import UserService from '../users/user.service';
import { routeService } from '../routes/route.service';
import { routeBatchService } from '../routeBatches/routeBatch.service';
import RouteEventHandlers from '../events/route-events.handlers';
import NewSlackHelpers from '../new-slack/helpers/slack-helpers';
import TravelTripHelpers from '../new-slack/trips/travel/travel.helpers.ts';

class SlackController {
  static async launch(req, res) {
    const { body: { user_id: slackId } } = req; // get slack id from req, payload.
    const message = await SlackController.getWelcomeMessage(slackId);
    return res.status(200).json(message);
  }

  static greetings() {
    return new SlackAttachment(
      'I am your trip operations assistant at Andela',
      'What would you like to do today?',
      'Tembea',
      '',
      ''
    );
  }

  static createChangeLocationBtn(callback) {
    return new SlackButtonAction(
      `changeLocation${callback ? '__'.concat(callback) : ''}`,
      'Change Location',
      'change_location'
    );
  }

  static async getHomeBaseMessage(slackId) {
    const homeBase = await homebaseService.getHomeBaseBySlackId(slackId, true);
    const homeBaseMessage = homeBase
      ? `_Your current home base is ${SlackHelpers.getLocationCountryFlag(homeBase.country.name)} *${homeBase.name}*_`
      : '`Please set your location to continue`';
    return homeBaseMessage;
  }

  static async getWelcomeMessage(slackId) {
    const attachment = SlackController.greetings();
    const homeBaseMessage = await SlackController.getHomeBaseMessage(slackId);
    const actions = homeBaseMessage !== '`Please set your location to continue`' ? [
      new SlackButtonAction('book', 'Schedule a Trip', 'book_new_trip'),
      new SlackButtonAction(
        'view',

        'See Trip Itinerary',
        'view_trips_itinerary'
      )
    ] : [];
    attachment.addFieldsOrActions('actions', [
      ...actions,
      SlackController.createChangeLocationBtn(''),
      new SlackCancelButtonAction()
    ]);

    attachment.addOptionalProps('welcome_message', '/fallback', '#3AA3E3');

    return new SlackInteractiveMessage(`Welcome to Tembea! \n ${homeBaseMessage}`, [attachment]);
  }

  static async getTravelCommandMsg(slackId) {
    const homeBaseMessage = await SlackController.getHomeBaseMessage(slackId);

    const attachment = SlackController.greetings();
    const actions = homeBaseMessage !== '`Please set your location to continue`'
      ? [new SlackButtonAction('Airport Transfer', 'Airport Transfer', 'airport_transfer'),
        new SlackButtonAction('Embassy Visit', 'Embassy Visit', 'embassy_visit'),
      ] : [];

    attachment.addFieldsOrActions('actions', [
      ...actions,
      SlackController.createChangeLocationBtn('travel'),
      new SlackCancelButtonAction()
    ]);

    attachment.addOptionalProps(
      'travel_trip_start',
      '/fallback',
      '#3AA3E3',
    );

    return new SlackInteractiveMessage(`Welcome to Tembea! \n ${homeBaseMessage}`, [attachment]);
  }

  static async getRouteCommandMsg(slackId) {
    const homeBaseMessage = await SlackController.getHomeBaseMessage(slackId);
    if (!homeBaseMessage.includes('Nairobi') && homeBaseMessage !== '`Please set your location to continue`') {
      return new SlackInteractiveMessage(
        '>*`The route functionality is not supported for your current location`*'
          .concat('\nThank you for using Tembea! See you again.')
      );
    }
    const attachment = SlackController.greetings();
    const actions = homeBaseMessage !== '`Please set your location to continue`'
      ? [
        new SlackButtonAction('My Current Route',
          'My Current Route', 'my_current_route'),
        new SlackButtonAction('Request New Route', 'Request New Route', 'request_new_route'),
        new SlackButtonAction('See Available Routes',
          'See Available Routes', 'view_available_routes'),

      ] : [];
    attachment.addFieldsOrActions('actions', [
      ...actions,
      SlackController.createChangeLocationBtn('routes'),
      new SlackCancelButtonAction()
    ]);
    attachment.addOptionalProps(
      'tembea_route',
      '/fallback',
      '#3AA3E3',
    );

    return new SlackInteractiveMessage(`Welcome to Tembea! \n ${homeBaseMessage}`, [attachment]);
  }

  static async handleSlackCommands(req, res, next) {
    const { body: { text, user_id: slackId, team_id: teamId } } = req;
    await SlackHelpers.findOrCreateUserBySlackId(slackId, teamId);
    if (!text) return next();
    if (isSlackSubCommand((text.toLowerCase()), 'route')) {
      const response = await SlackController.getRouteCommandMsg(slackId);

      res.status(200)
        .json(response);
    } else if (isSlackSubCommand((text.toLowerCase()), 'travel')) {
      const response = await TravelTripHelpers.getStartMessage(slackId);
      res.status(200)
        .json(response);
    }
  }

  /**
   * Fetch a list of slack channels on the workspace
   *
   * @static
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @returns {object} returns a response
   * @memberof SlackController
   */
  static async getChannels(req, res) {
    try {
      const { query: { type = 'private_channel' } } = req;
      const { locals: { botToken } } = res;

      const { channels } = await WebClientSingleton
        .getWebClient(botToken).conversations.list({
          types: type
        });
      const channelList = channels.map(({ id, name, purpose }) => ({
        id, name, description: purpose.value,
      }));
      return Response.sendResponse(res, 200, true, 'Request was successful', channelList);
    } catch (error) {
      BugsnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  static async handleExternalSelect(req, res) {
    const payload = JSON.parse(req.body.payload);
    let options = [];
    if (payload.type === 'block_suggestion') {
      switch (payload.block_id) {
        case 'destination':
          options = await SlackController.getEmbassySelectOptions(payload);
          break;
        case 'pickup':
          options = await SlackController.getMatchingAddress(payload);
          break;
        default:
          res.send(new Error(`Block id: ${payload.block_id} is not supported`));
      }
    } else {
      res.send(new Error(`Invalid payload type: ${payload.type}`));
    }
    res.send({ options });
  }

  static async getEmbassySelectOptions(payload) {
    const embassies = await homebaseService.getHomeBaseEmbassies(payload.user.id, payload.value);
    return [
      { text: new SlackText('Decide later'), value: 'To Be Decided' },
      ...NewSlackHelpers.toSlackSelectOptions(embassies, { textProp: 'name', valueProp: 'name' }),
    ];
  }

  static async getMatchingAddress(payload) {
    const homebase = await homebaseService.getHomeBaseBySlackId(payload.user.id);
    const addresses = await addressService
      .searchAddressListByHomebase(homebase.name, payload.value);
    return [
      { text: new SlackText('Decide later'), value: 'To Be Decided' },
      ...NewSlackHelpers.toSlackSelectOptions(addresses, undefined, true),
    ];
  }

  static async leaveRoute(payload) {
    try {
      const { user: { id: slackId } } = payload;
      const { routeBatchId, id: userId } = await UserService.getUserBySlackId(slackId);
      if (routeBatchId) {
        await UserService.updateUser(userId, { routeBatchId: null });
        const { routeId, riders } = await routeBatchService.getRouteBatchByPk(routeBatchId, true);
        const { name: routeName } = await routeService.getRouteById(routeId, false);
        const slackMessage = new SlackInteractiveMessage(
          `Hey <@${slackId}>, You have successfully left the route \`${routeName}\`.`
        );

        await RouteEventHandlers.handleUserLeavesRouteNotification(
          payload,
          slackId,
          routeName,
          riders
        );
        return slackMessage;
      }
    } catch (error) {
      BugsnagHelper.log(error);
      throw new Error('Something went wrong, please try again');
    }
  }
}

export default SlackController;
