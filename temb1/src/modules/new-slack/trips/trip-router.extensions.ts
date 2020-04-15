import availableRouteController from '../routes/user/seeAvailableRoute.controller';
import userRouteActions from '../routes/actions';
import userRouteBlocks from '../routes/blocks';
import SlackInteractions from '../../slack/SlackInteractions';
import JoinRouteController from '../routes/user/joinRoute.controller';
import RouteLocationController from '../routes/user/routeLocation.controller';
import RouteInputHandlers from '../../slack/RouteManagement/RouteInputHandler';
import managerTripActions from './manager/constants';

const tripRoutesExtensions = [
  // ROUTE STARTS HERE
  {
    route: {
      actionId: userRouteActions.showAvailableRoutes,
      blockId: userRouteBlocks.availableRoutes,
    },
    handler: availableRouteController.seeAvailableRoutes,
  },
  {
    route: { actionId: userRouteActions.back, blockId: userRouteBlocks.navBlock },
    handler: SlackInteractions.launch,
  },
  {
    route: {
      actionId: new RegExp(`^${userRouteActions.userJoinRoute}_\\d+$`, 'g'),
      blockId: new RegExp(`^${userRouteBlocks.joinRouteBlock}_\\d+$`, 'g'),
    },
    handler: JoinRouteController.joinARoute,
  },
  {
    route: { actionId: userRouteActions.confirmJoining, blockId: userRouteBlocks.confirmRoute },
    handler: JoinRouteController.confirmJoiningRoute,
  },
  {
    route: { actionId: userRouteActions.searchPopup, blockId: userRouteBlocks.searchRouteBlock },
    handler: availableRouteController.searchRoute,
  },
  {
    route: {
      actionId: new RegExp(`^${userRouteActions.page}_\\d+$`, 'g'),
      blockId: userRouteBlocks.pagination,
    },
    handler: availableRouteController.seeAvailableRoutes,
  },
  {
    route: { actionId: userRouteActions.skipPage, blockId: userRouteBlocks.pagination },
    handler: availableRouteController.skipPage,
  },
  {
    route: { blockId: userRouteBlocks.confirmLocation },
    handler: RouteLocationController.confirmLocation,
  },
  {
    route: { actionId: userRouteActions.confirmLocation,
      blockId: userRouteBlocks.confirmHomeLocation },
    handler: RouteInputHandlers.handleBusStopRoute,
  },
  {
    route: { actionId: managerTripActions.confirmApprovedTrip },
    handler: SlackInteractions.handleTripActions, // re-using existing handler
  },
];

export default tripRoutesExtensions;
