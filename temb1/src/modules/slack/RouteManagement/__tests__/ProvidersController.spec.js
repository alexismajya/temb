import ProviderNotifications from '../../SlackPrompts/notifications/ProviderNotifications/index';
import ProvidersController from '../ProvidersController';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import { routeService } from '../../../routes/route.service';
import {
  route,
  cab,
  reassignCabPayload,
  reassignDriverPayload,
  user,
  driver,
  routeData,
  SlackAttachment
} from '../__mocks__/providersController.mock';
import { driverService } from '../../../drivers/driver.service';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import SlackNotifications from '../../SlackPrompts/Notifications';
import { providerService } from '../../../providers/provider.service';
import { cabService } from '../../../cabs/cab.service';
import { homebaseService } from '../../../homebases/homebase.service';
import { mockWhatsappOptions } from '../../../notifications/whatsapp/twilio.mocks';
import { routeBatchService } from '../../../routeBatches/routeBatch.service';

mockWhatsappOptions();

describe('Provider Controller', () => {
  let respond;
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ channel: 'BBBBBB' });
  });

  describe('reassigned cab', () => {
    beforeEach(() => {
      jest.spyOn(cabService, 'getById').mockResolvedValue({
        id: 1,
        regNuber: 'LKJ-123',
        providerId: 3
      });
      jest.spyOn(routeBatchService, 'updateRouteBatch').mockResolvedValue();
      jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockResolvedValue(route);
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('moon-token');
      jest.spyOn(ProviderNotifications, 'updateProviderReAssignCabMessage').mockResolvedValue({});
      jest.spyOn(ProvidersController, 'sendUserUpdatedRouteMessage').mockResolvedValue({});
    });

    afterEach(async () => {
      jest.restoreAllMocks();
    });

    it('should reassign a cab to route', async () => {
      await ProvidersController.handleCabReAssigmentNotification(reassignCabPayload, jest.fn());
      expect(ProviderNotifications.updateProviderReAssignCabMessage).toHaveBeenCalled();
      expect(ProvidersController.sendUserUpdatedRouteMessage).toHaveBeenCalled();
    });

    it('should fail when reassigning a cab to a route', async () => {
      respond = jest.fn;
      jest.spyOn(bugsnagHelper, 'log');
      jest.spyOn(ProviderNotifications, 'updateProviderReAssignCabMessage').mockRejectedValue();
      await ProvidersController.handleCabReAssigmentNotification(reassignCabPayload, respond);
      expect(bugsnagHelper.log).toHaveBeenCalled();
    });
  });

  describe('Send new cab details to user', () => {
    it('should send user update notification', async () => {
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('moooon');
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue();
      await ProvidersController.sendUserUpdatedRouteMessage(user, route, cab, 'moon-token');
      expect(SlackNotifications.getDMChannelId).toHaveBeenCalled();
      expect(SlackNotifications.sendNotification).toHaveBeenCalled();
    });
  });
});

describe('reassignDriver', () => {
  beforeEach(() => {
    jest.spyOn(routeBatchService, 'updateRouteBatch').mockResolvedValue();
    jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockResolvedValue(route);
    jest.spyOn(driverService, 'getDriverById').mockResolvedValue();
    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xoop-token');
    jest.spyOn(ProviderNotifications, 'updateProviderReasignDriverMessage').mockResolvedValue({});
    jest.spyOn(ProvidersController, 'sendUserRouteUpdateMessage').mockResolvedValue({});
  });
  afterEach(async () => {
    jest.restoreAllMocks();
  });
  it('Should reassign driver to a route', async () => {
    jest.spyOn(ProviderNotifications, 'updateProviderReasignDriverMessage').mockResolvedValue({});
    await ProvidersController.providerReassignDriver(reassignDriverPayload);
    expect(ProviderNotifications.updateProviderReasignDriverMessage).toHaveBeenCalled();
    expect(ProvidersController.sendUserRouteUpdateMessage).toHaveBeenCalled();
  });
  it('Should enter catch block', async () => {
    jest.spyOn(bugsnagHelper, 'log');
    jest.spyOn(ProviderNotifications, 'updateProviderReasignDriverMessage').mockRejectedValue();
    await ProvidersController.providerReassignDriver(reassignDriverPayload);
    expect(bugsnagHelper.log).toHaveBeenCalled();
  });
});

describe('Send user notification', () => {
  it('Should send user update notification', async () => {
    jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('xxxoop');
    jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue();

    await ProvidersController.sendUserRouteUpdateMessage(user, route, driver, 'xoob-try');
    expect(SlackNotifications.getDMChannelId).toHaveBeenCalled();
    expect(SlackNotifications.sendNotification).toHaveBeenCalled();
  });
});

describe('handleProviderRouteApproval', () => {
  let userMessageSpy;
  let OpsMessageSpy;
  let updateProviderMessageSpy;

  beforeEach(() => {
    jest.spyOn(providerService, 'findByPk').mockResolvedValue({ name: 'adaeze' });
    jest.spyOn(teamDetailsService, 'getTeamDetails').mockResolvedValue({ botToken: 'xoop' });
    jest.spyOn(cabService, 'getById').mockResolvedValue({ capacity: 4 });
    jest.spyOn(routeBatchService, 'updateRouteBatch').mockResolvedValue();
    jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockResolvedValue(routeData);
    userMessageSpy = jest.spyOn(ProvidersController, 'sendUserProviderAssignMessage')
      .mockResolvedValue();
    OpsMessageSpy = jest.spyOn(ProvidersController, 'sendOpsProviderAssignMessage')
      .mockResolvedValue();
    updateProviderMessageSpy = jest.spyOn(ProviderNotifications, 'updateRouteApprovalNotification')
      .mockResolvedValue();
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId')
      .mockResolvedValue({ channel: 'opsChannelId' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle provider approval', async () => {
    const state = JSON.stringify({ tripId: 1, channel: 'UXXID', timestamp: '123456789' });
    const payload = {
      team: { id: 'teamId' },
      submission: { driver: '2', cab: '1' },
      state,
      user: { id: 'U123' },
    };
    await ProvidersController.handleProviderRouteApproval(payload, jest.fn());
    expect(userMessageSpy).toHaveBeenCalled();
    expect(OpsMessageSpy).toHaveBeenCalled();
    expect(updateProviderMessageSpy).toHaveBeenCalled();
  });
});

describe('sendOpsProviderAssignMessage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('Should send ops provider approval message', async () => {
    jest.spyOn(SlackNotifications, 'createDirectMessage').mockResolvedValue();
    jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue();
    await ProvidersController.sendOpsProviderAssignMessage(
      'deeCabs', 'bay-area', 'XOOP', 'UXXID', SlackAttachment
    );
    expect(SlackNotifications.createDirectMessage).toHaveBeenCalled();
    expect(SlackNotifications.sendNotification).toHaveBeenCalled();
  });
});

describe('sendUserProviderAssignMessage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('Should send users provider assign message', async () => {
    const message = 'A driver and cab has been assigned to your route "*bay area*". :smiley:';
    jest.spyOn(SlackNotifications, 'createDirectMessage').mockResolvedValue();
    jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue();
    jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('UPMX1');
    await ProvidersController.sendUserProviderAssignMessage(
      routeData.riders, 'xoop', 'bay area', SlackAttachment
    );
    expect(SlackNotifications.createDirectMessage).toHaveBeenCalledWith('UPMX1', message, [SlackAttachment]);
    expect(SlackNotifications.sendNotification).toHaveBeenCalled();
  });

  describe('saveRoute', () => {
    it('Should save route', async () => {
      const updatedRouteData = { busStop: 'bloomsberg', routeImageUrl: 'www.pic.co' };
      const submission = { routeName: 'dee-dee', routeCapacity: 4, takeOffTime: '3:00' };
      jest.spyOn(routeService, 'createRouteBatch').mockResolvedValue(routeData);
      jest.spyOn(routeService, 'addUserToRoute').mockResolvedValue();
      await ProvidersController.saveRoute(updatedRouteData, submission, 1);
      expect(routeService.createRouteBatch).toHaveBeenCalled();
      expect(routeService.addUserToRoute).toHaveBeenCalled();
    });
  });
});
