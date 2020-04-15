import JoinRouteHelpers from '../joinRoute.helpers';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import { blockMessage } from '../__mocks__/user-route-mocks';
import { routeData, payload, state, token, joinRequest, routeBatch } from
'../__mocks__/route-mocks';
import { SlackText } from '../../../models/slack-block-models';
import Cache from '../../../../shared/cache';
import UserService from '../../../../users/user.service';
import { joinRouteRequestService } from '../../../../joinRouteRequests/joinRouteRequest.service';
import * as formHelper from '../../../../slack/helpers/formHelper';
import { routeService } from '../../../../routes/route.service';
import { engagementService } from '../../../../engagements/engagement.service';
import DateDialogHelper from '../../../../../helpers/dateHelper';
import { partnerService } from '../../../../partners/partner.service';
import SlackHelpers from '../../../../../helpers/slack/slackHelpers';
import { routeBatchService } from '../../../../routeBatches/routeBatch.service';

describe(JoinRouteHelpers, () => {

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(JoinRouteHelpers.joinRouteModal, () => {
    it('should join the route modal', async () => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockReturnValueOnce(token);
      await JoinRouteHelpers.joinRouteModal(payload, state);
      expect(teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalledWith(payload.team.id);
    });
  });

  describe(JoinRouteHelpers.confirmRouteBlockMessage, () => {
    it('should confirm route block message', async () => {
      jest.spyOn(JoinRouteHelpers, 'joinRouteBlock').mockReturnValueOnce(blockMessage.blocks);
      await JoinRouteHelpers.confirmRouteBlockMessage(routeData);
      expect(JoinRouteHelpers.joinRouteBlock).toHaveBeenCalledWith(routeData);
    });
  });

  describe(JoinRouteHelpers.joinRouteBlock, () => {
    it('should join route block', async () => {
      const joinRoute = { routeBatch };
      jest.spyOn(JoinRouteHelpers, 'engagementFields').mockReturnValueOnce(blockMessage.blocks);
      jest.spyOn(JoinRouteHelpers, 'routeFields').mockReturnValueOnce(blockMessage.blocks);
      await JoinRouteHelpers.joinRouteBlock(joinRoute);
      expect(JoinRouteHelpers.engagementFields).toHaveBeenCalledWith(joinRoute);
      expect(JoinRouteHelpers.routeFields).toHaveBeenCalledWith(routeBatch);
    });
  });

  describe(JoinRouteHelpers.engagementFields, () => {
    it('should show engagement fields', async () => {
      jest.spyOn(JoinRouteHelpers, 'engagementBlockFields')
      .mockReturnValueOnce(blockMessage.blocks);
      await JoinRouteHelpers.engagementFields(joinRequest);
      expect(JoinRouteHelpers.engagementBlockFields).toHaveBeenCalledWith(joinRequest);
    });
  });

  describe(JoinRouteHelpers.engagementBlockFields, () => {
    it('should show engagement fields in block message', async () => {
      jest.spyOn(JoinRouteHelpers, 'engagementDateFields')
        .mockReturnValueOnce(blockMessage.blocks);
      await JoinRouteHelpers.engagementBlockFields(routeBatch);
      expect(JoinRouteHelpers. engagementDateFields).toHaveBeenCalledTimes(1);
    });
  });

  describe(JoinRouteHelpers.engagementDateFields, () => {
    it('should show engagement date fields', () => {
      const result = JoinRouteHelpers.engagementDateFields('2019-12-11', '2019-12-11');
      expect(result).toBeDefined();
    });
  });

  describe(JoinRouteHelpers.formatStartAndEndDates, () => {
    it('should format start date and end date', () => {
      const result = JoinRouteHelpers.formatStartAndEndDates('2019-12-11', '2019-12-11');
      expect(result).toBeDefined();
    });
  });

  describe(JoinRouteHelpers.joinRouteHandleRestrictions, () => {
    it('should not join a route when a user is not on any engagement', () => {
      JoinRouteHelpers.joinRouteHandleRestrictions(
          { routeBatchId: null }, null);
      expect(new SlackText(`Sorry! It appears you are not on any engagement at the moment.
         If you believe this is incorrect, contact Tembea Support.`))
          .toBeDefined();
    });

    it('should not join a route when a user is already on a route', () => {
      JoinRouteHelpers.joinRouteHandleRestrictions(
        { routeBatchId: 2 }, routeBatch.engagement);
      expect(new SlackText('You are already on a route. Cannot join another')).toBeDefined();
    });
  });

  describe(JoinRouteHelpers.routeFields, () => {
    it('should get route fields', () => {
      const result = JoinRouteHelpers.routeFields(routeBatch);
      expect(result).toBeDefined();
    });
  });

  describe(JoinRouteHelpers.notifyJoiningRouteMessage, () => {
    const tempJoinRoute = {
      routeBatch,
      manager: joinRequest.manager,
      engagement: routeBatch.engagement,
    };
    it('should send a notification message when joing a route', async () => {
      jest.spyOn(JoinRouteHelpers, 'joinNotFilledCapacity').mockReturnValueOnce(tempJoinRoute);
      await JoinRouteHelpers.notifyJoiningRouteMessage(payload, tempJoinRoute);
      expect(JoinRouteHelpers.joinNotFilledCapacity)
        .toHaveBeenCalledWith(payload, tempJoinRoute);
    });

    it('should not join filled capacity', async () => {
      jest.spyOn(JoinRouteHelpers, 'saveJoinRouteRequest').mockReturnValueOnce({
        id: 2, managerId: tempJoinRoute.manager.id,
        engagementId: routeBatch.engagement.fellow.id, routeBatchId: routeBatch.id,
      });
      jest.spyOn(joinRouteRequestService, 'updateJoinRouteRequest').mockReturnValueOnce(null);
      jest.spyOn(UserService, 'getUserBySlackId').mockReturnValueOnce(payload.user);
      jest.spyOn(formHelper, 'getFellowEngagementDetails')
      .mockReturnValueOnce(routeBatch.engagement);
      jest.spyOn(engagementService, 'updateEngagement').mockReturnValueOnce(null);
      jest.spyOn(routeService, 'addUserToRoute').mockReturnValueOnce(null);
      await JoinRouteHelpers.joinNotFilledCapacity(payload, tempJoinRoute);
      expect(JoinRouteHelpers.saveJoinRouteRequest).toHaveBeenCalledWith(payload,
        tempJoinRoute.routeBatch.id);
      expect(joinRouteRequestService.updateJoinRouteRequest).toHaveBeenCalledWith(2, {
        id: 2, status: 'Confirmed', engagement: { engagementId: routeBatch.engagement.fellow.id },
        manager: { managerId: tempJoinRoute.manager.id },
        routeBatch: { routeBatchId: routeBatch.id }});
      expect(UserService.getUserBySlackId).toHaveBeenCalledWith(payload.user.id);
      expect(formHelper.getFellowEngagementDetails)
      .toHaveBeenCalledWith(payload.user.id, payload.team.id);
      expect(engagementService.updateEngagement)
        .toHaveBeenCalledWith(12,
        { startDate: '2018-11-20', endDate: '2022-11-20', workHours: '20:00 - 00:00' });
      expect(routeService.addUserToRoute).toHaveBeenCalledWith(routeBatch.id, payload.user.id);
    });
  });

  describe(JoinRouteHelpers.saveJoinRouteRequest, () => {
    it('should save the joined request', async() => {
      jest.spyOn(Cache, 'fetch').mockReturnValueOnce({ manager: 'UP0RTRL02', workHours: '18:00 - 00:00' });
      jest.spyOn(Cache, 'fetch').mockReturnValueOnce({
        startDate: '2/12/2018', endDate: '2/12/2018', partnerName: 'Emmy'});
      jest.spyOn(DateDialogHelper, 'convertIsoString').mockReturnValueOnce({
        startDate: '2/12/2018', endDate: '2/12/2018'});
      jest.spyOn(partnerService, 'findOrCreatePartner')
        .mockReturnValueOnce(routeBatch.engagement.partner);
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId')
        .mockReturnValueOnce(routeBatch.engagement.fellow);
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId')
        .mockReturnValueOnce(joinRequest.manager);
      jest.spyOn(routeBatchService, 'getRouteBatchByPk')
        .mockReturnValueOnce(routeBatch);
      jest.spyOn(engagementService, 'findOrCreateEngagement')
        .mockReturnValueOnce(routeBatch.engagement);
      jest.spyOn(joinRouteRequestService, 'createJoinRouteRequest')
        .mockReturnValueOnce(null);
      await JoinRouteHelpers.saveJoinRouteRequest(payload, 2);
      expect(Cache.fetch).toHaveBeenCalledTimes(2);
      expect(Cache.fetch).toHaveBeenCalledWith('joinRouteRequestSubmission_UP0RTRL02');
      expect(Cache.fetch).toHaveBeenCalledWith('userDetailsUP0RTRL02');
      expect(DateDialogHelper.convertIsoString).toHaveBeenCalledTimes(1);
      expect(partnerService.findOrCreatePartner).toHaveBeenCalledTimes(1),
      expect(SlackHelpers.findOrCreateUserBySlackId).toHaveBeenCalledTimes(2),
      expect(routeBatchService.getRouteBatchByPk).toHaveBeenCalledTimes(1),
      expect(engagementService.findOrCreateEngagement).toHaveBeenCalledTimes(1);
      expect(joinRouteRequestService.createJoinRouteRequest).toHaveBeenCalledTimes(1);
    });
  });
});
