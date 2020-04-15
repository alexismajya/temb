import { createMessageAdapter } from '@slack/interactive-messages';
import SlackInteractions from './index';
import ManagerController from '../RouteManagement/ManagerController';
import { OperationsHandler } from '../RouteManagement/OperationsController';
import JoinRouteInteractions from '../RouteManagement/JoinRoute/JoinRouteInteractions';
import RateTripController from '../TripManagement/RateTripController';
import TripInteractions from '../SlackPrompts/notifications/TripNotifications/TripInteractions';
import TripCabController from '../TripManagement/TripCabController';
import SlackInteractionsHelpers from '../helpers/slackHelpers/SlackInteractionsHelpers';
import ProvidersController from '../RouteManagement/ProvidersController';
import tripsRouter from '../../new-slack/trips/trip-router';
import userTripActions from '../../new-slack/trips/user/actions';
import userRouteActions from '../../new-slack/routes/actions';
import UserTripBookingController from '../../new-slack/trips/user/user-trip-booking-controller';
import UserTripEditController from '../../new-slack/trips/user/user-trip-edit-controller';
import { blocks as routeBlocks } from '../SlackPrompts/notifications/RouteNotifications';
import ModalRouter from '../../new-slack/helpers/modal.router';
import ItineraryController from '../../new-slack/trips/user/itinerary.controller';
import TripController from '../../new-slack/trips/manager/trip.controller';
import managerTripActions from '../../new-slack/trips/manager/constants';
import JoinRouteInputHandlers from '../RouteManagement/JoinRoute/JoinRouteInputHandler';
import travelTripsActions from '../../new-slack/trips/travel/actions';
import TravelTripController from '../../new-slack/trips/travel/travel.controller';
import SeeAvailableRouteController from '../../new-slack/routes/user/seeAvailableRoute.controller';
import JoinRouteController from '../../new-slack/routes/user/joinRoute.controller';

const slackInteractionsRouter = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

export const modalRouter = new ModalRouter();

slackInteractionsRouter.action({ callbackId: 'change_location' },
  SlackInteractions.handleChangeLocation);
slackInteractionsRouter.action({ callbackId: 'back_to_launch' },
  SlackInteractions.launch);
slackInteractionsRouter.action({ callbackId: 'welcome_message' },
  SlackInteractionsHelpers.welcomeMessage);
slackInteractionsRouter.action({ callbackId: 'travel_trip_start' },
  SlackInteractions.bookTravelTripStart);
slackInteractionsRouter.action({ callbackId: /^travel_trip/ },
  SlackInteractions.handleTravelTripActions);
slackInteractionsRouter.action({ callbackId: 'itinerary_actions' },
  SlackInteractionsHelpers.handleItineraryActions);
slackInteractionsRouter.action({ actionId: 'send_feedback' },
  SlackInteractionsHelpers.handleFeedbackAction);
slackInteractionsRouter.action({ callbackId: 'get_feedback' },
  SlackInteractionsHelpers.handleGetFeedbackAction);
/**
 * reschedule trip with block kit
 */
slackInteractionsRouter.action({ callbackId: /^operations_approval/ },
  SlackInteractionsHelpers.sendCommentDialog);
slackInteractionsRouter.action({ callbackId: 'operations_reason_dialog_trips' },
  SlackInteractions.handleTripActions);

slackInteractionsRouter.action({ callbackId: 'trips_cab_selection' },
  SlackInteractionsHelpers.handleOpsAction);
slackInteractionsRouter.action({ callbackId: 'provider_actions' },
  SlackInteractions.handleSelectCabActions);
slackInteractionsRouter.action({ callbackId: 'confirm_ops_approval' },
  TripCabController.handleSelectProviderDialogSubmission);
slackInteractionsRouter.action({ callbackId: 'ops_approval_trip' },
  OperationsHandler.completeOpsAssignCabDriver);
slackInteractionsRouter.action({ callbackId: 'tembea_route' },
  SlackInteractions.startRouteActions);
slackInteractionsRouter.action({ callbackId: 'providers_route_approval' },
  SlackInteractionsHelpers.startProviderActions);
slackInteractionsRouter.action({ callbackId: /^providers_approval/ },
  SlackInteractions.handleSelectCabAndDriverAction);
slackInteractionsRouter.action({ callbackId: /^new_route/ },
  SlackInteractions.handleRouteActions);
slackInteractionsRouter.action({ callbackId: /^manager_route/ },
  ManagerController.handleManagerActions);
slackInteractionsRouter.action({ callbackId: /^operations_route/ },
  OperationsHandler.handleOperationsActions);
slackInteractionsRouter.action({ callbackId: 'view_new_trip' },
  SlackInteractions.completeTripResponse);
slackInteractionsRouter.action({ callbackId: /^join_route/ },
  JoinRouteInputHandlers.handleJoinRouteActions);
slackInteractionsRouter.action({ callbackId: 'rate_trip' },
  RateTripController.rate);
slackInteractionsRouter.action({ callbackId: 'trip_completion' },
  TripInteractions.tripCompleted);
slackInteractionsRouter.action({ callbackId: 'trip_not_taken' },
  TripInteractions.reasonForNotTakingTrip);
slackInteractionsRouter.action({ callbackId: 'route_skipped' },
  JoinRouteInteractions.handleRouteSkipped);
slackInteractionsRouter.action({ callbackId: 'rate_route' },
  RateTripController.rate);
slackInteractionsRouter.action({ callbackId: 'reassign_driver' },
  ProvidersController.providerReassignDriver);
slackInteractionsRouter.action({ callbackId: 'cab_reassign' },
  ProvidersController.handleCabReAssigmentNotification);
slackInteractionsRouter.action({ callbackId: 'provider_actions_route' },
  SlackInteractions.handleProviderApproval);
slackInteractionsRouter.action({ callbackId: 'provider_accept_route' },
  ProvidersController.handleProviderRouteApproval);
slackInteractionsRouter.action({ callbackId: 'user_trip_skip_page' },
  ItineraryController.handleSkipPage);

// PLEASE DO NOT TOUCH EXCEPT YOUR NAME IS ADAEZE, BARAK OR RENE
slackInteractionsRouter.action({ callbackId: userTripActions.reasonDialog },
  UserTripBookingController.handleReasonSubmit);

slackInteractionsRouter.action({ callbackId: userTripActions.pickupModalSubmit },
  UserTripBookingController.savePickupDetails);

slackInteractionsRouter.action({ callbackId: userTripActions.destDialog },
  UserTripBookingController.saveDestination);

slackInteractionsRouter.action({ callbackId: userTripActions.payment },
  UserTripBookingController.paymentRequest);

slackInteractionsRouter.action({ blockId: routeBlocks.tripCompletion },
  JoinRouteInteractions.handleRouteBatchConfirmUse);

slackInteractionsRouter.action({ callbackId: managerTripActions.reasonSubmission },
  TripController.completeApproveOrDecline);
tripsRouter(slackInteractionsRouter);

modalRouter.submission(userTripActions.reschedule, ItineraryController.handleRescheduleRequest);

modalRouter.submission(userTripActions.pickupModalSubmit, UserTripBookingController.savePickupDetails);

modalRouter.submission(userTripActions.reschedule,
  ItineraryController.handleRescheduleRequest);

modalRouter.submission(travelTripsActions.submitContactDetails,
  TravelTripController.submitContactDetails.bind(TravelTripController));

modalRouter.submission(travelTripsActions.submitEditedContactDetails,
  TravelTripController.submitContactDetails.bind(TravelTripController));

modalRouter.submission(travelTripsActions.submitTripDetails,
  TravelTripController.submitTripDetails.bind(TravelTripController));

modalRouter.submission(travelTripsActions.submitNotes,
  TravelTripController.submitNotes.bind(TravelTripController));

modalRouter.submission(travelTripsActions.addLocations,
  TravelTripController.submitLocationInfo.bind(TravelTripController));

modalRouter.submission(travelTripsActions.submitFlightDetails,
  TravelTripController.submitFlightDetails.bind(TravelTripController));

modalRouter.submission(userRouteActions.selectManagerSubmit,
  JoinRouteController.handleSelectManager);

modalRouter.submission(userRouteActions.searchRouteSubmit,
  SeeAvailableRouteController.handleSearchRoute);

modalRouter.submission(userRouteActions.skipPageSubmit,
  SeeAvailableRouteController.handleSkipPage);

modalRouter.submission(userTripActions.editRequestModalSubmit,
  UserTripEditController.saveEditRequestDetails);

modalRouter.submission(userTripActions.editDestinationModalSubmit,
  UserTripEditController.saveEditedDestination);

export default slackInteractionsRouter;
