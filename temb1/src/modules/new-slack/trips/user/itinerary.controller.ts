import ItineraryHelpers from './itinerary.helpers';
import { itineraryActions } from './actions';
import RescheduleHelper from './reschedule.helper';
import { IModalResponse, IModalCtx } from '../../helpers/modal.router';
import NewSlackHelpers from '../../helpers/slack-helpers';
import { getDateAndTimeSchema } from '../schemas';

export default class ItineraryController {
  static start(payload: any, respond: Function) {
    const message = ItineraryHelpers.createStartMessage();
    respond(message);
  }

  static async getPast(payload: any, respond: Function) {
    const message = await ItineraryHelpers.getPastTripsMessage(payload);
    respond(message);
  }

  static async getUpcoming(payload: any, respond: Function) {
    const message = await ItineraryHelpers.getUpcomingTripsMessage(payload);
    respond(message);
  }

  static async handleRescheduleOrCancel(payload: any, respond: Function) {
    const { value, action_id: actionId } = payload.actions[0];
    let message;
    if (actionId.startsWith(itineraryActions.reschedule)) {
      message = await RescheduleHelper.sendTripRescheduleModal(payload, value);
    } else {
      message = await ItineraryHelpers.cancelTrip(payload, value);
    }
    if (message) respond(message);
  }

  static async nextOrPrevPage(payload: any, respond: Function) {
    const { value } = payload.actions[0];
    let message;
    if (value.includes('pastTrips')) {
      message = await ItineraryHelpers.getPastTripsMessage(payload);
    } else if (value.includes('upcomingTrips')) {
      message = await ItineraryHelpers.getUpcomingTripsMessage(payload);
    }
    if (message) respond(message);
  }

  static async skipPage(payload: any, respond: Function) {
    await ItineraryHelpers.triggerPage(payload);
  }

  static async handleSkipPage(data: any, respond: Function) {
    const payload = {
      team: { id: data.team.id, domain: data.team.domain },
      user: { id: data.user.id, name: data.user.name, team_id: data.team.id },
      actions: [
        {
          action_id: `user_trip_page_${data.submission.pageNumber}`,
          block_id: 'user_trip_pagination',
          value: `${data.state}_page_${data.submission.pageNumber}`,
        },
      ],
    };
    ItineraryController.nextOrPrevPage(payload, respond);
  }

  static async handleRescheduleRequest(payload: any, submission: any,
    respond: IModalResponse, context: IModalCtx) {
    try {
      const userInfo = await NewSlackHelpers.getUserInfo(payload.user.id, context.botToken);
      const data = NewSlackHelpers.modalValidator(submission,
        getDateAndTimeSchema(userInfo.tz));
      await RescheduleHelper.completeReschedule(payload, data, context);
      respond.clear();
    } catch (err) {
      const errors = err.errors || { date: 'An unexpected error occured' };
      return respond.error(errors);
    }
  }
}
