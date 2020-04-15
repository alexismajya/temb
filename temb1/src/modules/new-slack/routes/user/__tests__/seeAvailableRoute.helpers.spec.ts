import SeeAvailaibleRouteHelpers from '../seeAvailableRoute.helpers';
import { SlackText } from '../../../models/slack-block-models';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import { blockMessage } from '../__mocks__/user-route-mocks';
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
import { routesMock, routeData, notFoundRoutes, payload, state, token } from
'../__mocks__/route-mocks';

describe(SeeAvailaibleRouteHelpers, () => {

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(SeeAvailaibleRouteHelpers.getAvailableRoutesBlockMessage, () => {
    it('should return available routes block message', async () => {
      jest.spyOn(SeeAvailaibleRouteHelpers, 'routeBlock').mockReturnValueOnce(blockMessage.blocks);
      await SeeAvailaibleRouteHelpers.getAvailableRoutesBlockMessage(routesMock);
      expect(SeeAvailaibleRouteHelpers.routeBlock).toHaveBeenCalledWith(routeData);
    });

    it('should return sorry message if routes are not found', () => {
      SeeAvailaibleRouteHelpers.getAvailableRoutesBlockMessage(notFoundRoutes);
      expect(new SlackText('Sorry, route not available at the moment :disappointed:'))
        .toBeDefined();
    });
  });

  describe(SeeAvailaibleRouteHelpers.routeBlock, () => {
    it('should return a route block message', () => {
      const message = SeeAvailaibleRouteHelpers.routeBlock(routeData);
      expect(message).toBeDefined();
    });
  });

  describe(SeeAvailaibleRouteHelpers.popModalForSeachRoute, () => {
    it('should return a pop modal to search a route', async() => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockReturnValueOnce(token);
      await SeeAvailaibleRouteHelpers.popModalForSeachRoute(payload, state);
      expect(teamDetailsService.getTeamDetailsBotOauthToken).toBeCalledWith(payload.team.id);
    });
  });

  describe(SeeAvailaibleRouteHelpers.popModalForSkipPage, () => {
    it('should return a pop modal to skip a page', async() => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockReturnValueOnce(token);
      await SeeAvailaibleRouteHelpers.popModalForSkipPage(payload, state);
      expect(teamDetailsService.getTeamDetailsBotOauthToken).toBeCalledWith(payload.team.id);
    });
  });
});
