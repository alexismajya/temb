import SlackController from '../SlackController';
import { SlackInteractiveMessage } from '../SlackModels/SlackMessageModels';
import DialogPrompts from '../SlackPrompts/DialogPrompts';
import InteractivePrompts from '../SlackPrompts/InteractivePrompts';
import TripActionsController from '../TripManagement/TripActionsController';
import Cache from '../../shared/cache';
import TravelTripHelper, { getTravelKey } from '../helpers/slackHelpers/TravelTripHelper';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import RouteInputHandlers from '../RouteManagement';
import UserInputValidator from '../../../helpers/slack/UserInputValidator';
import JoinRouteInteractions from '../RouteManagement/JoinRoute/JoinRouteInteractions';
import tripService from '../../trips/trip.service';
import CleanData from '../../../helpers/cleanData';
import ProvidersController from '../RouteManagement/ProvidersController';
import SlackInteractionsHelpers from '../helpers/slackHelpers/SlackInteractionsHelpers';
import { handleActions } from '../helpers/slackHelpers/handler';
import InteractivePromptSlackHelper from '../helpers/slackHelpers/InteractivePromptSlackHelper';
import { providerService } from '../../providers/provider.service';
import UserService from '../../users/user.service';
import TravelHelper from '../helpers/slackHelpers/TravelTripHelper/travelHelper';
import SeeAvailableRouteController from '../../new-slack/routes/user/seeAvailableRoute.controller';

class SlackInteractions {
  static async launch(data, respond) {
    const payload = CleanData.trim(data);
    const { user: { id: slackId }, actions: [{ value: action }] } = payload;
    let message;
    try {
      switch (action) {
        case 'back_to_launch':
          message = await SlackController.getWelcomeMessage(slackId);
          break;
        case 'back_to_travel_launch':
          message = await SlackController.getTravelCommandMsg(slackId);
          break;
        case 'back_to_routes_launch':
          message = await SlackController.getRouteCommandMsg(slackId);
          break;
        case 'leave_route':
          message = await SlackController.leaveRoute(payload, respond);
          break;
        default:
          message = new SlackInteractiveMessage('Thank you for using Tembea');
      }

      respond(message);
    } catch (err) {
      respond(new SlackInteractiveMessage(err.message));
    }
  }

  static async handleTripActions(data, respond) {
    try {
      const payload = CleanData.trim(data);
      const { callback_id: callbackId } = payload;
      const errors = (callbackId === 'operations_reason_dialog_trips')
        ? TripActionsController.runCabValidation(payload) : [];
      if (errors && errors.length > 0) return { errors };
      await TripActionsController.changeTripStatus(payload);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(
        new SlackInteractiveMessage('Unsuccessful request. Kindly Try again')
      );
    }
  }

  static async handleSelectCabActions(payload, respond) {
    const { user: { id: slackId }, actions } = payload;
    const { id: providerId } = await providerService.getProviderBySlackId(slackId);
    const tripId = actions[0].value;
    const { providerId: assignedProviderId } = await tripService.getById(tripId);
    if (providerId === assignedProviderId) {
      return DialogPrompts.sendSelectCabDialog(payload);
    }
    return respond(new SlackInteractiveMessage(':x: This trip has been assigned to another provider'));
  }

  static async handleSelectCabAndDriverAction(data, respond) {
    if (data && data.callback_id === 'providers_approval_trip') {
      TripActionsController.completeTripRequest(data);
    } else {
      ProvidersController.handleProviderRouteApproval(data, respond);
    }
  }

  static async bookTravelTripStart(data, respond) {
    const payload = CleanData.trim(data);
    const { user: { id }, actions } = payload;
    const { name } = actions[0];
    switch (name) {
      case 'cancel':
        respond(
          new SlackInteractiveMessage('Thank you for using Tembea. See you again.')
        );
        break;
      case 'changeLocation__travel':
        InteractivePrompts.changeLocation(payload, respond);
        break;
      default:
        await Cache.save(getTravelKey(id), 'tripType', name);
        return DialogPrompts.sendTripDetailsForm(
          payload, 'travelTripContactDetailsForm', 'travel_trip_contactDetails'
        );
    }
  }

  static handleTravelTripActions(data, respond) {
    const payload = CleanData.trim(data);
    return handleActions(payload, respond, TravelTripHelper, TravelHelper);
  }

  static async startRouteActions(data, respond) {
    Cache.save('url', 'response_url', data.response_url);

    const payload = CleanData.trim(data);
    const state = JSON.parse(payload.state || '""');
    payload.store = state;
    const action = state.action || payload.actions[0].value;
    const errors = UserInputValidator.validateStartRouteSubmission(payload);
    if (errors) return errors;
    switch (action) {
      case 'my_current_route':
        await JoinRouteInteractions.sendCurrentRouteMessage(payload, respond);
        break;
      case 'request_new_route':
        DialogPrompts.sendLocationForm(payload);
        break;
      case 'view_available_routes':
        await SeeAvailableRouteController.seeAvailableRoutes(payload, respond);
        break;
      case 'change_location':
        await InteractivePrompts.changeLocation(payload, respond);
        break;
      default:
        respond(SlackInteractionsHelpers.goodByeMessage());
        break;
    }
  }

  static async handleRouteActions(data, respond) {
    try {
      const payload = CleanData.trim(data);
      const callBackName = payload.callback_id.split('_')[2];
      const routeHandler = RouteInputHandlers[callBackName];
      if (routeHandler) {
        const errors = RouteInputHandlers.runValidations(payload);
        if (errors && errors.length > 0) return { errors };
        return routeHandler(payload, respond);
      }
      respond(SlackInteractionsHelpers.goodByeMessage());
    } catch (error) {
      bugsnagHelper.log(error);
      respond(
        new SlackInteractiveMessage('Unsuccessful request. Kindly Try again')
      );
    }
  }

  static completeTripResponse(data, respond) {
    try {
      const payload = CleanData.trim(data);
      const { value } = payload.actions[0];
      InteractivePromptSlackHelper.sendCompletionResponse(respond, value, payload.user.id);
    } catch (error) {
      bugsnagHelper.log(error);
      respond(new SlackInteractiveMessage('Error:bangbang: : '
        + 'We could not complete this process please try again.'));
    }
  }

  static async handleProviderApproval(payload) {
    return DialogPrompts.sendSelectCabDialog(payload);
  }

  static async handleChangeLocation(payload, respond) {
    const { user: { id: slackId }, actions: [data] } = payload;
    const { name: homebaseId, value: stateString } = data;
    const state = JSON.parse(stateString);

    await UserService.updateDefaultHomeBase(slackId, Number(homebaseId));
    await SlackInteractions.restorePreviousState(state, slackId, respond);
  }

  static async restorePreviousState(state, slackId, respond) {
    const { origin } = state;
    let msg = {};

    switch (origin) {
      case 'routes':
        msg = await SlackController.getRouteCommandMsg(slackId);
        break;
      case 'travel':
        msg = await SlackController.getTravelCommandMsg(slackId);
        break;
      default:
        msg = await SlackController.getWelcomeMessage(slackId);
    }
    respond(msg);
  }
}

export default SlackInteractions;
