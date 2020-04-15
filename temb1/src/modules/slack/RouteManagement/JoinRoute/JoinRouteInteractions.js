import moment from 'moment';
import {
  getPageNumber,
  triggerPage
} from '../../TripManagement/TripItineraryController';
import SequelizePaginationHelper from '../../../../helpers/sequelizePaginationHelper';
import RoutesHelpers from '../../helpers/routesHelper';
import { SLACK_DEFAULT_SIZE } from '../../../../helpers/constants';
import DialogPrompts from '../../SlackPrompts/DialogPrompts';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import {
  SlackAttachment,
  SlackButtonAction,
  SlackInteractiveMessage
} from '../../SlackModels/SlackMessageModels';
import { SlackDialog, SlackDialogTextarea } from '../../SlackModels/SlackDialogModels';
import { batchUseRecordService } from '../../../batchUseRecords/batchUseRecord.service';
import RateTripController from '../../TripManagement/RateTripController';
import Validators from '../../../../helpers/slack/UserInputValidator/Validators';
import CleanData from '../../../../helpers/cleanData';
import RouteJobs from '../../../../services/jobScheduler/jobs/RouteJobs';
import env from '../../../../config/environment';
import UserService from '../../../users/user.service';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import { homebaseService } from '../../../homebases/homebase.service';
import { actions } from '../../SlackPrompts/notifications/RouteNotifications';
import { Block, BlockMessage } from '../../../new-slack/models/slack-block-models';
import { BatchUseRecordStatuses } from '../../../../database/models/batch-use-record';
import { routeBatchService } from '../../../routeBatches/routeBatch.service';

class JoinRouteInteractions {
  static async handleViewAvailableRoutes(data, respond) {
    const payload = CleanData.trim(data);
    const { type } = payload;
    if (type === 'interactive_message') {
      await JoinRouteInteractions.handleSendAvailableRoutesActions(payload, respond);
    }
    if (type === 'dialog_submission') {
      await JoinRouteInteractions.sendAvailableRoutesMessage(payload, respond);
    }
  }

  static async sendAvailableRoutesMessage(data, respond) {
    const { origin = '' } = data.store || {};
    if (origin) { UpdateSlackMessageHelper.newUpdateMessage(origin, { text: 'Noted...' }); }
    const payload = CleanData.trim(data);
    const page = getPageNumber(payload);
    const sort = SequelizePaginationHelper.deserializeSort(
      'name,asc,batch,asc'
    );

    const homebase = await homebaseService.getHomeBaseBySlackId(payload.user.id);
    const pageable = { page, sort, size: SLACK_DEFAULT_SIZE };
    const where = JoinRouteInteractions.createWhereClause(payload);
    const isSearch = data.type === 'dialog_submission' && data.submission.search;

    const {
      routes: availableRoutes,
      totalPages,
      pageNo: currentPage
    } = await routeBatchService.getRoutes(pageable, where, homebase.id);
    const availableRoutesMessage = RoutesHelpers.toAvailableRoutesAttachment(
      availableRoutes,
      currentPage,
      totalPages,
      isSearch
    );
    respond(availableRoutesMessage);
  }

  static async sendCurrentRouteMessage({ user: { id } }, respond) {
    const { routeBatchId } = await UserService.getUserBySlackId(id);
    const routeInfo = await routeBatchService.getRouteBatchByPk(routeBatchId, true);
    const currentRouteMessage = RoutesHelpers.toCurrentRouteAttachment(routeInfo);
    respond(currentRouteMessage);
  }

  static async handleSendAvailableRoutesActions(data, respond) {
    const payload = CleanData.trim(data);
    const { name: actionName } = payload.actions[0];
    if (actionName === 'See Available Routes' || actionName.startsWith('page_')) {
      await JoinRouteInteractions.sendAvailableRoutesMessage(payload, respond);
      return;
    }
    triggerPage(payload, respond);
  }

  static createWhereClause(data) {
    const payload = CleanData.trim(data);
    const { submission } = payload;
    const where = (submission && submission.search) ? {
      status: 'Active',
      name: submission.search
    } : {
      status: 'Active'
    };
    return where;
  }

  static fullRouteCapacityNotice(state) {
    const text = 'This route is filled up to capacity.'
      + ' By clicking continue, a notification will be sent to Ops '
      + 'and they will get back to you asap';
    const attachment = new SlackAttachment('', text);
    attachment.addFieldsOrActions('actions', [
      new SlackButtonAction('showAvailableRoutes', '< Back', state, '#FFCCAA'),
      new SlackButtonAction('continueJoinRoute', 'Continue', state)
    ]);
    attachment.addOptionalProps('join_route_actions');
    return new SlackInteractiveMessage('Selected Full Capacity Route', [
      attachment
    ]);
  }

  static async confirmRouteUse(respond, user, batchRecordId) {
    await batchUseRecordService.createSingleRecord({
      userId: user.id,
      batchRecordId,
      userAttendStatus: BatchUseRecordStatuses.confirmed,
    });
    const ratingMessage = await RateTripController.sendRatingMessage(batchRecordId, 'rate_route');
    respond(ratingMessage);
  }

  static async handlePending(user, batchRecordId) {
    await batchUseRecordService.createSingleRecord({
      userId: user.id,
      batchRecordId,
      userAttendStatus: BatchUseRecordStatuses.pending,
    });
    const extensionTime = { hours: 0, minutes: env.TRIP_COMPLETION_TIMEOUT - 60, seconds: 0 };
    const rescheduleTime = moment(new Date()).add(extensionTime).format();
    RouteJobs.scheduleTripCompletionNotification({
      takeOff: rescheduleTime,
      recordId: batchRecordId,
    });
    return new BlockMessage([new Block().addText('Noted... We will get back to you soon')]);
  }

  static async handleDecline(payload, respond, user, batchRecordId) {
    await batchUseRecordService.createSingleRecord({
      userId: user.id,
      batchRecordId,
      userAttendStatus: BatchUseRecordStatuses.skip,
    });
    await JoinRouteInteractions.hasNotTakenTrip(payload, respond);
  }

  static async handleRouteBatchConfirmUse(payload, respond) {
    try {
      const user = await UserService.getUserBySlackId(payload.user.id);
      const { actions: [{ action_id: action, value: batchRecordId }] } = payload;

      switch (action) {
        case actions.confirmation:
          return JoinRouteInteractions.confirmRouteUse(respond, user, batchRecordId);
        case actions.pending:
          return JoinRouteInteractions.handlePending(user, batchRecordId);
        case actions.decline:
          return JoinRouteInteractions.handleDecline(payload, respond, user, batchRecordId);
        default:
          break;
      }
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static async handleRouteSkipped(payload, respond) {
    try {
      const user = await UserService.getUserBySlackId(payload.user.id);
      const { submission, state: batchRecordId } = payload;
      const checkIfEmpty = Validators.validateDialogSubmission(payload);
      if (checkIfEmpty.length) { return { errors: checkIfEmpty }; }

      // create record
      await batchUseRecordService.createSingleRecord({
        batchRecordId,
        userId: user.id,
        reasonForSkip: submission.tripNotTakenReason,
        userAttendStatus: BatchUseRecordStatuses.skip,
      });

      respond(new SlackInteractiveMessage('Thank you for sharing your experience.'));
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static async hasNotTakenTrip(payload, respond) {
    try {
      respond(new SlackInteractiveMessage('Noted...'));
      const { actions: [{ value }] } = payload;
      const dialog = new SlackDialog(
        'route_skipped', 'Reason', 'Submit', true, value
      );
      const textarea = new SlackDialogTextarea(
        'Reason', 'tripNotTakenReason', 'Reason for not taking trip'
      );
      dialog.addElements([textarea]);
      respond(await DialogPrompts.sendDialog(dialog, payload));
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }
}

export default JoinRouteInteractions;
