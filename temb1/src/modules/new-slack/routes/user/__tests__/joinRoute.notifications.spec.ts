import JoinRouteHelpers from '../joinRoute.helpers';
import JoinRouteNotifications from '../joinRoute.notifications';
import {
  routeData, payload, token, routeBatch,
} from '../__mocks__/route-mocks';
import { blockMessage, engagementObject } from '../__mocks__/user-route-mocks';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import { joinRouteRequestService } from '../../../../joinRouteRequests/joinRouteRequest.service';
import Cache from '../../../../shared/cache';
import { homebaseService } from '../../../../homebases/homebase.service';
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
import SlackJoinRouteNotifications from
'../../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
import SlackNotifications from '../../../../slack/SlackPrompts/Notifications';

describe(JoinRouteHelpers, () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(JoinRouteNotifications.sendManagerJoinRequest, () => {
    it('should send a join request notification to the manager ', async () => {
      jest.spyOn(joinRouteRequestService, 'getJoinRouteRequest')
        .mockReturnValueOnce(routeBatch);
      jest.spyOn(JoinRouteHelpers, 'joinRouteBlock').mockReturnValueOnce(blockMessage.blocks);
      jest.spyOn(teamDetailsService, 'getTeamDetails').mockReturnValueOnce(token);
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(payload.channel.id);
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue(null);
      await JoinRouteNotifications.sendManagerJoinRequest(payload, routeData.id);
      expect(joinRouteRequestService.getJoinRouteRequest).toHaveBeenCalledTimes(1);
      expect(JoinRouteHelpers.joinRouteBlock).toHaveBeenCalledTimes(1);
      expect(teamDetailsService.getTeamDetails).toHaveBeenCalledTimes(1);
      expect(homebaseService.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
      expect(SlackNotifications.sendNotification).toHaveBeenCalled();
    });
  });

  describe(JoinRouteNotifications.sendFilledCapacityJoinRequest, () => {
    it('should send a filled capacity join request to the manager', async () => {
      jest.spyOn(Cache, 'fetch').mockReturnValueOnce(routeBatch);
      jest.spyOn(Cache, 'fetch').mockReturnValueOnce(engagementObject);
      jest.spyOn(SlackJoinRouteNotifications, 'generateJoinRouteFromSubmission')
        .mockReturnValueOnce(routeBatch);
      jest.spyOn(JoinRouteHelpers, 'joinRouteBlock').mockReturnValueOnce(blockMessage.blocks);
      jest.spyOn(teamDetailsService, 'getTeamDetails').mockReturnValueOnce(token);
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(payload.channel.id);
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue(null);
      await JoinRouteNotifications.sendFilledCapacityJoinRequest(routeBatch);
      expect(Cache.fetch).toHaveBeenCalledTimes(2);
      expect(SlackJoinRouteNotifications.generateJoinRouteFromSubmission)
      .toHaveBeenCalledTimes(1);
      expect(JoinRouteHelpers.joinRouteBlock).toHaveBeenCalledTimes(1);
      expect(teamDetailsService.getTeamDetails).toHaveBeenCalledTimes(1);
      expect(homebaseService.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
      expect(SlackNotifications.sendNotification).toHaveBeenCalled();
    });
  });
});
