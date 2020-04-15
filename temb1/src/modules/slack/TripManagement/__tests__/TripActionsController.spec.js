import TripActionsController from '../TripActionsController';
import SendNotifications from '../../SlackPrompts/Notifications';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import UserInputValidator from '../../../../helpers/slack/UserInputValidator';
import database from '../../../../database';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import { cabService } from '../../../cabs/cab.service';
import tripService from '../../../trips/trip.service';
import ProviderNotifications from '../../SlackPrompts/notifications/ProviderNotifications';
import DriverNotifications from
  '../../SlackPrompts/notifications/DriverNotifications/driver.notifications';
import { providerService } from '../../../providers/provider.service';
import appEvents from '../../../events/app-event.service';
import { mockWhatsappOptions } from '../../../notifications/whatsapp/twilio.mocks';
import Interactions from '../../../new-slack/trips/manager/interactions';
import { teamDetailsMock } from '../__mocks__/teamDetailMock';

mockWhatsappOptions();

const { models: { TripRequest } } = database;

jest.mock('../../SlackPrompts/Notifications.js');
jest.mock('../../events/', () => ({
  slackEvents: jest.fn(() => ({
    raise: jest.fn(),
    handle: jest.fn()
  }))
}));
jest.mock('../../events/slackEvents', () => ({
  SlackEvents: jest.fn(() => ({
    raise: jest.fn(),
    handle: jest.fn()
  })),
}));

jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('token');

jest.mock('../../SlackPrompts/Notifications.js');
jest.mock('../../events/', () => ({
  slackEvents: jest.fn(() => ({
    raise: jest.fn(),
    handle: jest.fn()
  }))
}));

describe('TripActionController operations decline tests', () => {
  const state = JSON.stringify({ trip: 1000000, actionTs: 212132 });
  const opsUserId = 1;
  let payload;

  beforeEach(() => {
    payload = {
      user: {
        id: 'TEST123'
      },
      channel: {
        id: 'CE0F7SZNU'
      },
      team: {
        id: 1
      },
      submission: {
        opsDeclineComment: 'abishai has it'
      },
      state
    };
    jest.spyOn(cabService, 'findOrCreateCab')
      .mockImplementation((driverName, driverPhoneNo, regNumber) => Promise.resolve({
        cab: { driverName, driverPhoneNo, regNumber },
      }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should run changeTripToDeclined()', async () => {
    teamDetailsService.getTeamDetails = jest.fn(() => Promise.resolve('token'));
    const findOrCreateUserBySlackId = jest.spyOn(SlackHelpers,
      'findOrCreateUserBySlackId');
    findOrCreateUserBySlackId.mockImplementation(() => ({
      id: 1
    }));
    const changeTripStatusToDeclined = jest.spyOn(
      TripActionsController, 'changeTripStatusToDeclined'
    );
    changeTripStatusToDeclined.mockImplementation(() => { });

    await TripActionsController.changeTripStatus(payload);

    expect(findOrCreateUserBySlackId).toHaveBeenCalledTimes(1);
    expect(changeTripStatusToDeclined).toHaveBeenCalledWith(1, payload, 'token');
  });

  it('should go to the changeTripStatus() catch block on error', async () => {
    const findOrCreateUserBySlackId = jest.spyOn(SlackHelpers,
      'findOrCreateUserBySlackId');
    findOrCreateUserBySlackId.mockImplementation(() => Promise.reject(new Error()));
    const changeTripStatusToConfirmed = jest.spyOn(
      TripActionsController, 'changeTripStatusToConfirmed'
    );
    changeTripStatusToConfirmed.mockImplementation(() => { });

    const response = await TripActionsController.changeTripStatus(payload);

    expect(findOrCreateUserBySlackId).toHaveBeenCalledTimes(1);
    expect(changeTripStatusToConfirmed).not.toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it('should run changeTripStatus() to declinedByOps', async () => {
    const trip = {
      destinationId: 2,
      name: 'A trip',
      riderId: 1,
      tripStatus: 'Approved',
      originId: 1,
      departureTime: '2018-12-12- 22:00',
      requestedById: 1,
      departmentId: 1,
      reason: 'I need to go',
      noOfPassengers: 1,
      tripType: 'Regular Trip'
    };

    jest.spyOn(SendNotifications, 'sendUserConfirmOrDeclineNotification').mockResolvedValue();
    jest.spyOn(SendNotifications, 'sendManagerConfirmOrDeclineNotification').mockResolvedValue();
    jest.spyOn(Interactions, 'sendOpsDeclineOrApprovalCompletion').mockResolvedValue();
    jest.spyOn(TripRequest, 'create').mockResolvedValueOnce(trip);
    jest.spyOn(tripService, 'updateRequest')
      .mockImplementation((t) => ({ ...t, status: 'DeclinedByOps' }));

    payload.state = JSON.stringify({ trip: trip.id, actionTs: 212132 });
    const result = await TripActionsController.changeTripStatusToDeclined(
      opsUserId, payload, teamDetailsMock
    );

    expect(result).toEqual('success');
    expect(SendNotifications.sendUserConfirmOrDeclineNotification).toHaveBeenCalled();
    expect(SendNotifications.sendManagerConfirmOrDeclineNotification).toHaveBeenCalled();
    expect(Interactions.sendOpsDeclineOrApprovalCompletion).toHaveBeenCalled();
  });

  it('should run the catchBlock on changeTripStatusToDeclined error ', async () => {
    jest.spyOn(tripService, 'getById')
      .mockRejectedValue(new Error('Dummy error'));
    try {
      await TripActionsController.changeTripStatusToDeclined(opsUserId, payload);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});

describe('TripActionController operations approve tests', () => {
  let payload;

  beforeEach(() => {
    payload = {
      user: {
        id: 'TEST123'
      },
      channel: {
        id: 'CE0F7SZNU'
      },
      team: {
        id: 1
      },
      submission: {
        confirmationComment: 'derick has it',
        driverName: 'derick',
        driverPhoneNo: '0700000000',
        regNumber: 'KAA666Q',
        cab: '1, SBARU, KAA666Q',
        driver: 1,
        capacity: '1',
        model: 'ferrari',
        providerId: 1
      },
      state: '{ "tripId": "3", "isAssignProvider": true }'
    };

    jest.spyOn(DriverNotifications, 'checkAndNotifyDriver').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  afterAll((done) => database.close().then(done));

  const opsUserId = 3;

  it('should change Trip Status for confirmation comment', async () => {
    teamDetailsService.getTeamDetails = jest.fn(() => Promise.resolve(teamDetailsMock));
    const findOrCreateUserBySlackId = jest.spyOn(SlackHelpers,
      'findOrCreateUserBySlackId');
    findOrCreateUserBySlackId.mockImplementation(() => ({
      id: 1
    }));
    const changeTripStatusToConfirmed = jest.spyOn(
      TripActionsController,
      'changeTripStatusToConfirmed'
    );
    changeTripStatusToConfirmed.mockImplementation(() => { });

    await TripActionsController.changeTripStatus(payload);

    expect(findOrCreateUserBySlackId).toHaveBeenCalledTimes(1);
    expect(changeTripStatusToConfirmed).toHaveBeenCalledWith(
      1, payload, teamDetailsMock
    );
  });

  it('should run notifiyProvider upon provider assignment', async () => {
    const notifyAll = jest.spyOn(TripActionsController, 'notifyAll').mockResolvedValue(null);
    jest.spyOn(Interactions, 'sendOpsDeclineOrApprovalCompletion').mockResolvedValue(null);
    jest.spyOn(providerService, 'getProviderById').mockResolvedValue({
      providerUserId: 1, name: 'Test Provider'
    });
    jest.spyOn(tripService, 'updateRequest').mockResolvedValue({ id: 1, name: 'Sample User' });

    await TripActionsController.changeTripStatusToConfirmed(opsUserId, payload, teamDetailsMock);
    expect(notifyAll).toHaveBeenCalled();
  });

  it('should run the catchBlock on changeTripStatusToConfirmed error ', async () => {
    jest.spyOn(tripService, 'getById')
      .mockRejectedValue(new Error('Dummy error'));
    try {
      await TripActionsController.changeTripStatusToConfirmed(opsUserId, payload,
        teamDetailsMock);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should run runCabValidation', () => {
    const validateCabDetailsSpy = jest.spyOn(UserInputValidator,
      'validateCabDetails');
    const result = TripActionsController.runCabValidation(payload);
    expect(validateCabDetailsSpy).toHaveBeenCalledWith(payload);
    expect(result.length).toBe(0);
  });

  it('should run runCabValidation', () => {
    payload.submission.regNumber = '%^&*(';
    const validateCabDetailsSpy = jest.spyOn(UserInputValidator, 'validateCabDetails');
    const result = TripActionsController.runCabValidation(payload);
    expect(validateCabDetailsSpy).toHaveBeenCalledWith(payload);
    expect(result.length).toBe(1);
  });

  it('should run notifyAll', async () => {
    jest.spyOn(SendNotifications, 'sendManagerConfirmOrDeclineNotification')
      .mockReturnValue();
    jest.spyOn(ProviderNotifications, 'sendTripNotification')
      .mockReturnValue();
    jest.spyOn(Interactions, 'sendOpsDeclineOrApprovalCompletion')
      .mockResolvedValue();
    await TripActionsController.notifyAll(payload, { rider: { slackId: 'AAA' } }, 'token');
    expect(SendNotifications.sendManagerConfirmOrDeclineNotification).toHaveBeenCalled();
    expect(ProviderNotifications.sendTripNotification).toHaveBeenCalled();
    expect(SendNotifications.sendUserConfirmOrDeclineNotification).toHaveBeenCalled();
  });

  describe(TripActionsController.completeTripRequest, () => {
    const mockTrip = { id: 1 };
    beforeEach(() => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xxop');
      jest.spyOn(tripService, 'completeCabAndDriverAssignment').mockResolvedValue(mockTrip);
      jest.spyOn(ProviderNotifications, 'UpdateProviderNotification')
        .mockResolvedValue({});
      jest.spyOn(appEvents, 'broadcast').mockImplementationOnce(() => jest.fn());
    });

    it('Should send notifications to provider and user on trip completion', async () => {
      await TripActionsController.completeTripRequest(payload);

      expect(tripService.completeCabAndDriverAssignment).toBeCalled();
    });
  });

  describe(TripActionsController.getTripNotificationDetails, () => {
    beforeEach(async () => {
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValue({ id: 'UE1FCCXXX' });
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken')
        .mockResolvedValue('xoxb-xxxx-xxxx');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should update trip notification details', async () => {
      const { ops, slackBotOauthToken } = await TripActionsController.getTripNotificationDetails({
        user: { id: 1 }, team: { id: 1 }
      });
      expect(ops.id).toEqual('UE1FCCXXX');
      expect(slackBotOauthToken).toEqual('xoxb-xxxx-xxxx');
      expect(SlackHelpers.findOrCreateUserBySlackId).toHaveBeenCalledTimes(1);
      expect(teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
    });
  });
});
