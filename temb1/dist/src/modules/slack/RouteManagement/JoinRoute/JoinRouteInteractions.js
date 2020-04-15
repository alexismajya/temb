"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const TripItineraryController_1 = require("../../TripManagement/TripItineraryController");
const sequelizePaginationHelper_1 = __importDefault(require("../../../../helpers/sequelizePaginationHelper"));
const routesHelper_1 = __importDefault(require("../../helpers/routesHelper"));
const constants_1 = require("../../../../helpers/constants");
const DialogPrompts_1 = __importDefault(require("../../SlackPrompts/DialogPrompts"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const SlackDialogModels_1 = require("../../SlackModels/SlackDialogModels");
const batchUseRecord_service_1 = require("../../../batchUseRecords/batchUseRecord.service");
const RateTripController_1 = __importDefault(require("../../TripManagement/RateTripController"));
const Validators_1 = __importDefault(require("../../../../helpers/slack/UserInputValidator/Validators"));
const cleanData_1 = __importDefault(require("../../../../helpers/cleanData"));
const RouteJobs_1 = __importDefault(require("../../../../services/jobScheduler/jobs/RouteJobs"));
const environment_1 = __importDefault(require("../../../../config/environment"));
const user_service_1 = __importDefault(require("../../../users/user.service"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const RouteNotifications_1 = require("../../SlackPrompts/notifications/RouteNotifications");
const slack_block_models_1 = require("../../../new-slack/models/slack-block-models");
const batch_use_record_1 = require("../../../../database/models/batch-use-record");
const routeBatch_service_1 = require("../../../routeBatches/routeBatch.service");
class JoinRouteInteractions {
    static handleViewAvailableRoutes(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { type } = payload;
            if (type === 'interactive_message') {
                yield JoinRouteInteractions.handleSendAvailableRoutesActions(payload, respond);
            }
            if (type === 'dialog_submission') {
                yield JoinRouteInteractions.sendAvailableRoutesMessage(payload, respond);
            }
        });
    }
    static sendAvailableRoutesMessage(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin = '' } = data.store || {};
            if (origin) {
                updatePastMessageHelper_1.default.newUpdateMessage(origin, { text: 'Noted...' });
            }
            const payload = cleanData_1.default.trim(data);
            const page = TripItineraryController_1.getPageNumber(payload);
            const sort = sequelizePaginationHelper_1.default.deserializeSort('name,asc,batch,asc');
            const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(payload.user.id);
            const pageable = { page, sort, size: constants_1.SLACK_DEFAULT_SIZE };
            const where = JoinRouteInteractions.createWhereClause(payload);
            const isSearch = data.type === 'dialog_submission' && data.submission.search;
            const { routes: availableRoutes, totalPages, pageNo: currentPage } = yield routeBatch_service_1.routeBatchService.getRoutes(pageable, where, homebase.id);
            const availableRoutesMessage = routesHelper_1.default.toAvailableRoutesAttachment(availableRoutes, currentPage, totalPages, isSearch);
            respond(availableRoutesMessage);
        });
    }
    static sendCurrentRouteMessage({ user: { id } }, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routeBatchId } = yield user_service_1.default.getUserBySlackId(id);
            const routeInfo = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatchId, true);
            const currentRouteMessage = routesHelper_1.default.toCurrentRouteAttachment(routeInfo);
            respond(currentRouteMessage);
        });
    }
    static handleSendAvailableRoutesActions(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = cleanData_1.default.trim(data);
            const { name: actionName } = payload.actions[0];
            if (actionName === 'See Available Routes' || actionName.startsWith('page_')) {
                yield JoinRouteInteractions.sendAvailableRoutesMessage(payload, respond);
                return;
            }
            TripItineraryController_1.triggerPage(payload, respond);
        });
    }
    static createWhereClause(data) {
        const payload = cleanData_1.default.trim(data);
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
        const attachment = new SlackMessageModels_1.SlackAttachment('', text);
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('showAvailableRoutes', '< Back', state, '#FFCCAA'),
            new SlackMessageModels_1.SlackButtonAction('continueJoinRoute', 'Continue', state)
        ]);
        attachment.addOptionalProps('join_route_actions');
        return new SlackMessageModels_1.SlackInteractiveMessage('Selected Full Capacity Route', [
            attachment
        ]);
    }
    static confirmRouteUse(respond, user, batchRecordId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield batchUseRecord_service_1.batchUseRecordService.createSingleRecord({
                userId: user.id,
                batchRecordId,
                userAttendStatus: batch_use_record_1.BatchUseRecordStatuses.confirmed,
            });
            const ratingMessage = yield RateTripController_1.default.sendRatingMessage(batchRecordId, 'rate_route');
            respond(ratingMessage);
        });
    }
    static handlePending(user, batchRecordId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield batchUseRecord_service_1.batchUseRecordService.createSingleRecord({
                userId: user.id,
                batchRecordId,
                userAttendStatus: batch_use_record_1.BatchUseRecordStatuses.pending,
            });
            const extensionTime = { hours: 0, minutes: environment_1.default.TRIP_COMPLETION_TIMEOUT - 60, seconds: 0 };
            const rescheduleTime = moment_1.default(new Date()).add(extensionTime).format();
            RouteJobs_1.default.scheduleTripCompletionNotification({
                takeOff: rescheduleTime,
                recordId: batchRecordId,
            });
            return new slack_block_models_1.BlockMessage([new slack_block_models_1.Block().addText('Noted... We will get back to you soon')]);
        });
    }
    static handleDecline(payload, respond, user, batchRecordId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield batchUseRecord_service_1.batchUseRecordService.createSingleRecord({
                userId: user.id,
                batchRecordId,
                userAttendStatus: batch_use_record_1.BatchUseRecordStatuses.skip,
            });
            yield JoinRouteInteractions.hasNotTakenTrip(payload, respond);
        });
    }
    static handleRouteBatchConfirmUse(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_service_1.default.getUserBySlackId(payload.user.id);
                const { actions: [{ action_id: action, value: batchRecordId }] } = payload;
                switch (action) {
                    case RouteNotifications_1.actions.confirmation:
                        return JoinRouteInteractions.confirmRouteUse(respond, user, batchRecordId);
                    case RouteNotifications_1.actions.pending:
                        return JoinRouteInteractions.handlePending(user, batchRecordId);
                    case RouteNotifications_1.actions.decline:
                        return JoinRouteInteractions.handleDecline(payload, respond, user, batchRecordId);
                    default:
                        break;
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static handleRouteSkipped(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_service_1.default.getUserBySlackId(payload.user.id);
                const { submission, state: batchRecordId } = payload;
                const checkIfEmpty = Validators_1.default.validateDialogSubmission(payload);
                if (checkIfEmpty.length) {
                    return { errors: checkIfEmpty };
                }
                yield batchUseRecord_service_1.batchUseRecordService.createSingleRecord({
                    batchRecordId,
                    userId: user.id,
                    reasonForSkip: submission.tripNotTakenReason,
                    userAttendStatus: batch_use_record_1.BatchUseRecordStatuses.skip,
                });
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Thank you for sharing your experience.'));
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static hasNotTakenTrip(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted...'));
                const { actions: [{ value }] } = payload;
                const dialog = new SlackDialogModels_1.SlackDialog('route_skipped', 'Reason', 'Submit', true, value);
                const textarea = new SlackDialogModels_1.SlackDialogTextarea('Reason', 'tripNotTakenReason', 'Reason for not taking trip');
                dialog.addElements([textarea]);
                respond(yield DialogPrompts_1.default.sendDialog(dialog, payload));
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
}
exports.default = JoinRouteInteractions;
//# sourceMappingURL=JoinRouteInteractions.js.map