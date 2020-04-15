import moment from 'moment';
import tripService from '../../../trips/trip.service';
import { TripStatus, ITripState } from '../../../../database/models/trip-request';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import getSlackViews from '../../extensions/SlackViews';
import { InputBlock, DatePicker, TextInput, Modal, Block, MarkdownText } from '../../models/slack-block-models';
import userTripActions from './actions';
import { IModalCtx } from '../../helpers/modal.router';
import NewSlackHelpers from '../../../new-slack/helpers/slack-helpers';
import DateDialogHelper from '../../../../helpers/dateHelper';
import appEvents from '../../../events/app-event.service';
import { tripEvents } from '../../../events/trip-events.contants';
import InteractivePromptSlackHelper from '../../../slack/helpers/slackHelpers/InteractivePromptSlackHelper';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';

export default class RescheduleHelper {
  static async completeReschedule(payload: any, data: any, context: IModalCtx) {
    const { user: { id: slackUserId },  view: { private_metadata } } = payload;
    const { origin, tripId } = JSON.parse(private_metadata);
    const slackInfo = await NewSlackHelpers.getUserInfo(slackUserId, context.botToken);
    const tripState = await NewSlackHelpers.getTripState(tripId);
    if (tripState.currentState === TripStatus.pending) {
      const departureTime = DateDialogHelper.mergeDateAndTime(data, slackInfo.tz);
      await tripService.updateRequest(tripId, { departureTime });
      appEvents.broadcast({
        name: tripEvents.rescheduled,
        data: {
          data: {
            id: tripId,
          },
          botToken: context.botToken,
        },
      });
      const respond = (data: any) => UpdateSlackMessageHelper.sendMessage(origin, data);
      await InteractivePromptSlackHelper.sendCompletionResponse(respond, tripId, null, true);
    }
  }

  static isRescheduleTimeOut(time: string) {
    return moment(time).diff(moment(), 'minute') > 30;
  }

  static async sendTripRescheduleModal(payload: any, requestId: number) {
    const tripRequest = await tripService.getById(requestId);
    const tripState = await NewSlackHelpers.getTripState(requestId);
    const timedOut = RescheduleHelper.isRescheduleTimeOut(tripRequest.departureTime);
    if (tripState.currentState === TripStatus.pending) {
      RescheduleHelper.sendRescheduleModal(payload, requestId);
      return null;
    }

    const message = timedOut
      ? RescheduleHelper.getRescheduleStatusMessage(tripState)
      : RescheduleHelper.getRescheduleTimedOutMessage();

    return message;
  }

  static getRescheduleTimedOutMessage() {
    return new MarkdownText('Sorry! This trip is close to take-off and cannot be rescheduled but'
      + ' cancelled.');
  }

  static getRescheduleStatusMessage(tripState: ITripState) {
    return tripState.currentState === TripStatus.cancelled
      ? new MarkdownText('Sorry! This trip cannot be rescheduled as it was recently'
        + ' cancelled by you')
      : new MarkdownText('Sorry! This trip cannot be rescheduled as it was recently'
        + ` *${tripState.currentState.toLowerCase()}* by <@${tripState.lastActionById}>`);
  }

  static async sendRescheduleModal(payload: any, tripRequestId: number) {
    try {
      const modal = await RescheduleHelper.getRescheduleModal(tripRequestId, payload.response_url);
      const token = await teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
      return getSlackViews(token).open(payload.trigger_id, modal);
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }

  static getRescheduleModal(tripRequestId: number, origin: string) {
    const defaultDate = moment().format('YYYY-MM-DD');
    const date = new InputBlock(new DatePicker(defaultDate, 'select a date', 'date'),
      'Select Date', 'date');
    const time = new InputBlock(new TextInput('HH:mm', 'time'), 'Time', 'time');
    const modal = Modal.createModal({
      modalTitle: 'Reschedule Trip',
      modalOptions: {
        submit: 'Reschedule',
        close: 'Cancel',
      },
      inputBlocks: [date, time],
      metadata: JSON.stringify({ origin, tripId: tripRequestId.toString() }),
      callbackId: userTripActions.reschedule,
    });
    return modal;
  }
}
