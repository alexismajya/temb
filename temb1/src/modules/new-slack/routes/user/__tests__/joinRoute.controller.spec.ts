
import JoinRouteController from '../joinRoute.controller';
import JoinRouteHelpers from '../joinRoute.helpers';
import Cache from '../../../../shared/cache';
import JoinRouteNotifications from
'../../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
import * as formHelper from '../../../../slack/helpers/formHelper';
import UserService from '../../../../users/user.service';
import NewSlackHelpers from '../../../helpers/slack-helpers';
import UpdateSlackMessageHelper from '../../../../../helpers/slack/updatePastMessageHelper';
import { payload, dependencyMocks, engagementObject } from '../__mocks__/user-route-mocks';
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';

describe(JoinRouteController, () => {
  const {
    actionRespond,
    modalRespond,
  } = dependencyMocks;

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(JoinRouteController.joinARoute, () => {
    it('should not join a route when there is a restriction', async () => {
      jest.spyOn(UserService, 'getUserBySlackId').mockReturnValueOnce(payload);
      jest.spyOn(formHelper, 'getFellowEngagementDetails').mockReturnValueOnce(payload);
      jest.spyOn(JoinRouteHelpers, 'joinRouteHandleRestrictions')
      .mockReturnValueOnce(payload);
      await JoinRouteController.joinARoute(payload, actionRespond);
      expect(UserService.getUserBySlackId).toHaveBeenCalledTimes(1);
      expect(formHelper.getFellowEngagementDetails).toHaveBeenCalledTimes(1);
      expect(JoinRouteHelpers.joinRouteHandleRestrictions).toHaveBeenCalledTimes(1);
    });

    it('should open a modal when there is no restriction to join a route', async () => {
      jest.spyOn(UserService, 'getUserBySlackId').mockReturnValueOnce(null);
      jest.spyOn(formHelper, 'getFellowEngagementDetails').mockReturnValueOnce(null);
      jest.spyOn(JoinRouteHelpers, 'joinRouteHandleRestrictions').mockReturnValueOnce(null);
      jest.spyOn(JoinRouteHelpers, 'joinRouteModal').mockReturnValueOnce(null);
      jest.spyOn(Cache, 'save').mockReturnValueOnce(null);
      await JoinRouteController.joinARoute(payload, actionRespond);
      expect(UserService.getUserBySlackId).toHaveBeenCalledTimes(1);
      expect(formHelper.getFellowEngagementDetails).toHaveBeenCalledTimes(1);
      expect(JoinRouteHelpers.joinRouteHandleRestrictions).toHaveBeenCalledTimes(1);
      expect(Cache.save).toHaveBeenCalledTimes(1);
    });
  });

  describe(JoinRouteController.handleSelectManager, () => {
    it('should handle select manager', async () => {
      jest.spyOn(NewSlackHelpers, 'modalValidator').mockReturnValueOnce(payload);
      jest.spyOn(Cache, 'save').mockReturnValueOnce(engagementObject);
      jest.spyOn(Cache, 'fetch').mockReturnValueOnce(engagementObject);
      jest.spyOn(Cache, 'fetch').mockReturnValueOnce(engagementObject);
      jest.spyOn(JoinRouteNotifications, 'generateJoinRouteFromSubmission')
          .mockReturnValueOnce(payload);
      jest.spyOn(JoinRouteHelpers, 'confirmRouteBlockMessage').mockReturnValueOnce(payload);
      jest.spyOn(UpdateSlackMessageHelper, 'sendMessage').mockReturnValueOnce(payload);
      await JoinRouteController.handleSelectManager(payload, {}, modalRespond);
      expect(NewSlackHelpers.modalValidator).toHaveBeenCalledTimes(1);
      expect(Cache.save).toHaveBeenCalledTimes(1);
      expect(Cache.fetch).toHaveBeenCalledTimes(2);
      expect(Cache.fetch).toHaveBeenCalledWith('ROUTE_REQUEST_UP0RTRL02');
      expect(Cache.fetch).toHaveBeenCalledWith('userDetailsUP0RTRL02');
      expect(JoinRouteNotifications.generateJoinRouteFromSubmission).toHaveBeenCalledTimes(1);
      expect(JoinRouteHelpers.confirmRouteBlockMessage).toHaveBeenCalledTimes(1);
      expect(UpdateSlackMessageHelper.sendMessage).toHaveBeenCalledTimes(1);
    });

    it('should respond with an error when it fetches once from cache', async () => {
      jest.spyOn(NewSlackHelpers, 'modalValidator').mockReturnValueOnce(payload);
      jest.spyOn(Cache, 'save').mockReturnValueOnce(engagementObject);
      jest.spyOn(Cache, 'fetch').mockReturnValueOnce(engagementObject);
      await JoinRouteController.handleSelectManager(payload, {}, modalRespond);
      expect(NewSlackHelpers.modalValidator).toHaveBeenCalledTimes(1);
      expect(Cache.save).toHaveBeenCalledTimes(1);
    });
  });

  describe(JoinRouteController.confirmJoiningRoute, () => {
    it('should enable a user to confirm to join a route', async () => {
      jest.spyOn(Cache, 'fetch').mockReturnValueOnce(engagementObject);
      jest.spyOn(Cache, 'fetch').mockReturnValueOnce(engagementObject);
      jest.spyOn(JoinRouteNotifications, 'generateJoinRouteFromSubmission')
        .mockReturnValueOnce(payload);
      jest.spyOn(JoinRouteHelpers, 'notifyJoiningRouteMessage')
        .mockReturnValueOnce(payload);
      await JoinRouteController.confirmJoiningRoute(payload, actionRespond);
      expect(Cache.fetch).toHaveBeenCalledTimes(2);
      expect(Cache.fetch).toHaveBeenCalledWith('ROUTE_REQUEST_UP0RTRL02');
      expect(Cache.fetch).toHaveBeenCalledWith('userDetailsUP0RTRL02');
      expect(JoinRouteNotifications.generateJoinRouteFromSubmission).toHaveBeenCalledTimes(1);
      expect(JoinRouteHelpers.notifyJoiningRouteMessage).toHaveBeenCalledTimes(1);
    });
  });
});
