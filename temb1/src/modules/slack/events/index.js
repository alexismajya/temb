import SlackNotifications from '../SlackPrompts/Notifications';
import ManagerNotifications from '../SlackPrompts/notifications/ManagerRouteRequest/index';
import { SlackEvents, slackEventNames } from './slackEvents';
import OperationsNotifications from '../SlackPrompts/notifications/OperationsRouteRequest';
import RouteNotifications from '../SlackPrompts/notifications/RouteNotifications';
import JoinRouteNotifications from '../../new-slack/routes/user/joinRoute.notifications';
import ProviderNotifications from '../SlackPrompts/notifications/ProviderNotifications';
import OperationsHelper from '../helpers/slackHelpers/OperationsHelper';
import Interactions from '../../new-slack/trips/manager/interactions';

const slackEvents = SlackEvents;

slackEvents.handle(slackEventNames.TRIP_WAITING_CONFIRMATION,
  Interactions.sendRequesterApprovedNotification);

slackEvents.handle(slackEventNames.RECEIVE_NEW_ROUTE_REQUEST,
  SlackNotifications.sendOperationsNewRouteRequest);

slackEvents.handle(slackEventNames.DECLINED_TRIP_REQUEST,
  SlackNotifications.sendRequesterDeclinedNotification);

slackEvents.handle(slackEventNames.NEW_TRAVEL_TRIP_REQUEST,
  SlackNotifications.sendOperationsTripRequestNotification);

slackEvents.handle(slackEventNames.NEW_ROUTE_REQUEST,
  ManagerNotifications.sendManagerNotification);

slackEvents.handle(slackEventNames.MANAGER_DECLINED_ROUTE_REQUEST,
  ManagerNotifications.sendManagerDeclineMessageToFellow);

slackEvents.handle(slackEventNames.MANAGER_APPROVED_ROUTE_REQUEST,
  ManagerNotifications.sendManagerApproval);

slackEvents.handle(slackEventNames.OPERATIONS_DECLINE_ROUTE_REQUEST,
  OperationsNotifications.completeOperationsDeclineAction);

slackEvents.handle(slackEventNames.NOTIFY_ROUTE_RIDERS,
  RouteNotifications.sendRouteNotificationToRouteRiders);

slackEvents.handle(slackEventNames.UPDATE_ROUTE_DRIVER,
  ProviderNotifications.sendProviderReasignDriverMessage);

SlackEvents.handle(slackEventNames.MANAGER_RECEIVE_JOIN_ROUTE,
  JoinRouteNotifications.sendManagerJoinRequest);

SlackEvents.handle(slackEventNames.OPS_FILLED_CAPACITY_ROUTE_REQUEST,
  JoinRouteNotifications.sendFilledCapacityJoinRequest);

SlackEvents.handle(slackEventNames.RIDERS_CONFIRM_ROUTE_USE,
  RouteNotifications.sendRouteUseConfirmationNotificationToRider);

SlackEvents.handle(slackEventNames.RIDER_CANCEL_TRIP,
  SlackNotifications.sendManagerCancelNotification);

SlackEvents.handle(slackEventNames.NOTIFY_OPS_CANCELLED_TRIP,
  SlackNotifications.sendOpsCancelNotification);

SlackEvents.handle(slackEventNames.SEND_PROVIDER_VEHICLE_REMOVAL_NOTIFICATION,
  ProviderNotifications.sendVehicleRemovalProviderNotification);

SlackEvents.handle(slackEventNames.SEND_PROVIDER_CREATED_ROUTE_REQUEST,
  ProviderNotifications.sendRouteApprovalNotification);

SlackEvents.handle(slackEventNames.COMPLETE_ROUTE_APPROVAL,
  OperationsHelper.completeRouteApproval);

export default slackEvents;
