import SeeAvailableRouteController from '../seeAvailableRoute.controller';
import SeeAvailaibleRouteHelpers from '../seeAvailableRoute.helpers';
import { homebaseService } from '../../../../homebases/homebase.service';
import { routeBatchService } from '../../../../routeBatches/routeBatch.service';
import { payload, homebase, unCompletePayload, skipPayload, dependencyMocks, blockMessage } from '../__mocks__/user-route-mocks';
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
import UpdateSlackMessageHelper from '../../../../../helpers/slack/updatePastMessageHelper';

describe(SeeAvailableRouteController, () => {
  const {
    actionRespond,
    modalRespond,
  } = dependencyMocks;

  const where = { status: 'Active' };

  const { response_url: state } = payload;
  const pagedResult = {
    data:[
        { id: 59, batch: 'A', capacity: 4, routeId: 59 },
        { id: 60, batch: 'A', capacity: 4, routeId: 60 },
    ],
  };
  const url = JSON.parse(payload.view.private_metadata);
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(SeeAvailableRouteController.seeAvailableRoutes, () => {
    it('should get availaible routes', async () => {
      jest.spyOn(SeeAvailableRouteController, 'getAllRoutes').mockReturnValueOnce(payload);
      await SeeAvailableRouteController.seeAvailableRoutes(payload, actionRespond);
      expect(SeeAvailableRouteController.getAllRoutes).toHaveBeenCalledWith(payload, where);
    });
  });

  describe(SeeAvailableRouteController.getAllRoutes, () => {
    it('should get all routes', async () => {
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(homebase);
      jest.spyOn(routeBatchService, 'getPagedAvailableRouteBatches')
      .mockReturnValueOnce(pagedResult);
      jest.spyOn(SeeAvailaibleRouteHelpers, 'getAvailableRoutesBlockMessage')
      .mockReturnValueOnce(pagedResult);
      await SeeAvailableRouteController.getAllRoutes(payload, where);
      expect(homebaseService.getHomeBaseBySlackId).toHaveBeenCalledWith(payload.user.id);
      expect(routeBatchService.getPagedAvailableRouteBatches).toHaveBeenCalledWith(
          homebase.id, 1, where);
      expect(SeeAvailaibleRouteHelpers.getAvailableRoutesBlockMessage).toHaveBeenCalledWith(
        pagedResult);
    });
  });

  describe(SeeAvailableRouteController.searchRoute, () => {
    it('should popup the modal for search route', async () => {
      jest.spyOn(SeeAvailaibleRouteHelpers, 'popModalForSeachRoute').mockResolvedValue(null);
      await SeeAvailableRouteController.searchRoute(payload);
      expect(SeeAvailaibleRouteHelpers.popModalForSeachRoute)
      .toHaveBeenCalledWith(payload, state);
    });
  });

  describe(SeeAvailableRouteController.handleSearchRoute, () => {
    it('should handle search route', async () => {
      jest.spyOn(SeeAvailableRouteController, 'getAllRoutes').mockReturnValueOnce(blockMessage);
      jest.spyOn(modalRespond, 'clear');
      jest.spyOn(UpdateSlackMessageHelper, 'sendMessage').mockReturnValueOnce(null);
      await SeeAvailableRouteController.handleSearchRoute(
          payload, {}, modalRespond);
      expect(SeeAvailableRouteController.getAllRoutes).toHaveBeenCalledWith(payload, where);
      expect(modalRespond.clear).toHaveBeenCalledTimes(1);
      expect(UpdateSlackMessageHelper.sendMessage).toHaveBeenCalledWith(url, blockMessage);
    });

    it('should respond with error when it fails to get all routes', async () => {
      jest.spyOn(SeeAvailableRouteController, 'getAllRoutes').mockReturnValueOnce(null);
      await SeeAvailableRouteController.handleSearchRoute(
        unCompletePayload, {}, modalRespond);
      expect(SeeAvailableRouteController.getAllRoutes).toHaveBeenCalledTimes(1);
    });
  });

  describe(SeeAvailableRouteController.skipPage, () => {
    it('should popup the modal for skip page', async () => {
      jest.spyOn(SeeAvailaibleRouteHelpers, 'popModalForSkipPage').mockResolvedValue(null);
      await SeeAvailableRouteController.skipPage(payload);
      expect(SeeAvailaibleRouteHelpers.popModalForSkipPage)
      .toHaveBeenCalledWith(payload, state);
    });
  });

  describe(SeeAvailableRouteController.handleSkipPage, () => {
    it('should handle skip page', async () => {
      jest.spyOn(SeeAvailableRouteController, 'getAllRoutes').mockReturnValueOnce(blockMessage);
      jest.spyOn(UpdateSlackMessageHelper, 'sendMessage').mockReturnValueOnce(null);
      await SeeAvailableRouteController.handleSkipPage(skipPayload,
        { pageNumber: '2' }, modalRespond);
      expect(SeeAvailableRouteController.getAllRoutes).toHaveBeenCalledTimes(1);
      expect(UpdateSlackMessageHelper.sendMessage).toHaveBeenCalledTimes(1);
    });

    it('should respond with error when it fails to skip a page', async () => {
      jest.spyOn(SeeAvailableRouteController, 'getAllRoutes').mockReturnValueOnce(blockMessage);
      await SeeAvailableRouteController.handleSkipPage(unCompletePayload, {}, modalRespond);
      expect(SeeAvailableRouteController.getAllRoutes).toHaveBeenCalledTimes(0);
    });
  });
});
