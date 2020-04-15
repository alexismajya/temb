import WebSocketEvents from '../../../../events/web-socket-event.service';
import { SlackInteractiveMessage } from '../../../../slack/SlackModels/SlackMessageModels';
import UserTripBookingController from '../user-trip-booking-controller';
import UserTripHelpers from '../user-trip-helpers';
import userTripActions from '../actions';
import Interactions from '../interactions';
import UpdateSlackMessageHelper from '../../../../../helpers/slack/updatePastMessageHelper';
import Validators from '../validators';
import NewLocationHelpers from '../../../helpers/location-helpers';
import UserService from '../../../../users/user.service';
import { homebaseService } from '../../../../homebases/homebase.service';
import ScheduleTripHelpers from '../schedule-trip.helpers';
import NewSlackHelpers from '../../../helpers/slack-helpers';
import SlackHelpers from '../../../../../helpers/slack/slackHelpers';
import Cache from '../../../../shared/cache';
import TripHelpers from '../trip.helpers';
import { departmentService } from '../../../../departments/department.service';
import TripEventsHandlers from '../../../../events/trip-events.handlers';
import socketIoMock from '../../../../slack/__mocks__/socket.ioMock';

describe('UserTripBookingController', () => {
  const response = jest.fn();
  response.error = jest.fn((arg) => (arg));
  const context = {
    homebase: {
      id: 3,
      name: 'Nairobi',
      channel: null,
      addressId: 1,
      locationId: 38
    },
    botToken: 'xoxb-BotToken'
  };
  const [payload, res] = [{
    actions: [{
      action_id: userTripActions.forMe,
    }],
    submission: {
      date: '2019-12-03',
      time: '23:09',

    },
    user: {
      // tz_offset: 3600,
      id: 'UIS233',
      homebase: context.homebase
    },
    team: { id: 'UIS233' },
    response_url: 'http://url.com'
  }, response];

  
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(Cache, 'save').mockResolvedValue();
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue(1);
    jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
      () => (new WebSocketEvents(socketIoMock))
    );
  });

  describe('savePickupDetails', () => {
    beforeAll(() => {
      jest.spyOn(Cache, 'saveObject').mockResolvedValue();
      jest.spyOn(NewSlackHelpers, 'getUserInfo').mockResolvedValue({ tz: 'Africa/Nairobi' });
    });

    it('should run successfully if payload is valid', async () => {
      jest.spyOn(NewSlackHelpers, 'modalValidator').mockImplementationOnce(() => ({}));
      await UserTripBookingController.savePickupDetails(payload, payload.submission, res, context);
      expect(NewSlackHelpers.modalValidator).toHaveBeenCalled();
    });

    it('should send error message when payload is invalid', async () => {
      const data = { ...payload };
      const error = { date: 'An unexpected error occured' };
      data.submission.pickup = 'Others';
      jest.spyOn(Validators, 'validatePickUpSubmission').mockRejectedValue(error);
      jest.spyOn(NewSlackHelpers, 'getUserInfo').mockImplementationOnce(() => ({
        tz: {}
      }));
      const pickupDetails = await UserTripBookingController
        .savePickupDetails(payload, payload.submission, res, context);

      expect(pickupDetails).toEqual(error);
    });
  });

  describe('startTripBooking', () => {
    it('should send start booking trip message', () => {
      UserTripBookingController.startTripBooking(payload, res);
      expect(res).toHaveBeenCalledTimes(1);
    });
  });

  describe('forMe', () => {
    it('should handle foSomeone', async () => {
      const newPayload = {
        ...payload,
        actions: [{
          action_id: userTripActions.forSomeone,
        }]
      };
      await UserTripBookingController.forMe(newPayload, res);
      expect(Cache.save).toHaveBeenCalled();
    });

    it('should handle forMe', async () => {
      const state = { origin: payload.response_url };
      jest.spyOn(Interactions, 'sendTripReasonForm').mockResolvedValue();
      await UserTripBookingController.forMe(payload, res);
      expect(Interactions.sendTripReasonForm).toHaveBeenCalledWith(payload, state);
    });
  });

  describe('saveRider', () => {
    it('should save a rider', async () => {
      const newPayload = {
        ...payload,
        actions: [{
          ...payload.actions,
          selected_user: 'HJYYU8II'
        }]
      };
      const state = { origin: newPayload.response_url };
      jest.spyOn(Interactions, 'sendTripReasonForm').mockResolvedValue();
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValueOnce(null);
      await UserTripBookingController.saveRider(newPayload);
      expect(Cache.save).toHaveBeenCalled();
      expect(Interactions.sendTripReasonForm).toHaveBeenCalledWith(newPayload, state);
    });
  });

  describe('handleReasonSubmit', () => {
    const newPayload = {
      ...payload,
      submission: {
        reason: 'Good reason'
      },
      state: '{ "origin": "https://origin.com"}'
    };
    it('should handle reason dialog submission', async () => {
      jest.spyOn(UpdateSlackMessageHelper, 'newUpdateMessage');
      await UserTripBookingController.handleReasonSubmit(newPayload);
      expect(UpdateSlackMessageHelper.newUpdateMessage).toHaveBeenCalled();
      expect(Cache.save).toHaveBeenCalled();
    });

    it('should throw error when reason submission is empty', async () => {
      newPayload.submission.reason = '';
      const result = await UserTripBookingController.handleReasonSubmit(newPayload);
      expect(result).toBeDefined();
      expect(result.errors).toBeDefined();
      expect(result.errors[0].error).toBe('"reason" is not allowed to be empty');
    });

    it('should send add passengers message if there is no submission', async () => {
      newPayload.submission = null;
      jest.spyOn(UpdateSlackMessageHelper, 'newUpdateMessage');
      await UserTripBookingController.handleReasonSubmit(newPayload);
      expect(UpdateSlackMessageHelper.newUpdateMessage).toHaveBeenCalled();
    });
  });

  describe('saveExtraPassengers', () => {
    beforeEach(() => {
      jest.spyOn(Cache, 'fetch').mockResolvedValue({ forMe: true });
      jest.spyOn(departmentService, 'getDepartmentsForSlack')
        .mockResolvedValue([{ label: 'department', value: 22 }]);
    });
    it('should save extra passengers', async () => {
      const newPayload = {
        ...payload,
        actions: [{
          ...payload.actions,
          selected_option: { value: '2' }
        }]
      };
      jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue({ homebaseId: 1 });
      await UserTripBookingController.saveExtraPassengers(newPayload, res);
      expect(Cache.save).toHaveBeenCalled();
      expect(res).toHaveBeenCalled();
    });

    it('should not add extra passengers', async () => {
      const newPayload = {
        ...payload,
        actions: [{
          value: '0'
        }]
      };
      jest.spyOn(UserService, 'getUserBySlackId').mockImplementation(() => ({ homebaseId: 1 }));
      await UserTripBookingController.saveExtraPassengers(newPayload, res);
      expect(Cache.save).toHaveBeenCalled();
      expect(res).toHaveBeenCalled();
    });
  });

  describe('saveDepartment', () => {
    it('should save department', async () => {
      const newPayload = {
        ...payload,
        actions: [{
          value: 22,
          text: {
            text: 'Finance'
          }
        }]
      };
      jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue(newPayload.user);
      jest.spyOn(Cache, 'saveObject').mockImplementationOnce(() => ({
      }));
      jest.spyOn(Interactions, 'sendPickupModal').mockResolvedValue(context.homebase.name, newPayload);
      await UserTripBookingController.saveDepartment(newPayload);

      expect(Interactions.sendPickupModal).toBeCalledWith(context.homebase.name, newPayload);
    });
  });

  describe('sendDestination', () => {
    it('should send destination details dialog', async () => {
      jest.spyOn(Cache, 'fetch').mockResolvedValue({ homeBaseName: 'Kampala' });
      jest.spyOn(Interactions, 'sendDetailsForm').mockResolvedValue();
      await UserTripBookingController.sendDestinations(payload);
    });
  });

  describe('saveDestination', () => {
    const newPayload = {
      ...payload,
      submission: {
        destination: 'Nairobi',
        othersDestination: null
      }
    };

    beforeEach(() => {
      jest.spyOn(Interactions, 'sendPostDestinationMessage').mockResolvedValue();
      jest.spyOn(Cache, 'fetch').mockResolvedValue({ pickup: 'kigali', othersPickup: null, homeBaseName: 'Kampala' });
    });

    it('should save destination details', async () => {
      jest.spyOn(Cache, 'saveObject').mockResolvedValue();
      jest.spyOn(NewLocationHelpers, 'getDestinationCoordinates').mockResolvedValue();
      await UserTripBookingController.saveDestination(newPayload);
      expect(Cache.saveObject).toHaveBeenCalled();
      expect(Cache.fetch).toHaveBeenCalled();
    });

    it('should fail to save destination when input is empty', async () => {
      const tripPayload = { ...newPayload };
      tripPayload.submission.destination = '';
      const result = await UserTripBookingController.saveDestination(tripPayload);
      expect(result.errors).toBeDefined();
      expect(result.errors[0].error).toBe('"destination" is not allowed to be empty');
    });

    it('should fail to save when the trip has both origin and destination as one location', async () => {
      const tripPayload = { ...newPayload };
      tripPayload.submission.destination = 'kigali';
      const result = await UserTripBookingController.saveDestination(tripPayload);
      expect(result.errors).toBeDefined();
      expect(result.errors[0].error).toBe('Destination cannot be the same as origin');
    });

    it('should not send post destination message if no submission', async () => {
      newPayload.submission = null;
      const result = await UserTripBookingController.saveDestination(newPayload);
      expect(result).toHaveProperty('errors');
    });
  });

  describe('updateState', () => {
    it('should update the state', async () => {
      jest.spyOn(UpdateSlackMessageHelper, 'updateMessage').mockResolvedValue();
      await UserTripBookingController.updateState([payload.response_url]);
      expect(UpdateSlackMessageHelper.updateMessage)
        .toHaveBeenCalledWith([payload.response_url], { text: 'Noted' });
    });
  });

  describe('cancel', () => {
    it('should send thank you message after cancel', async () => {
      await UserTripBookingController.cancel(payload, res);
      expect(res).toHaveBeenCalled();
    });
  });

  describe('back', () => {
    let newPayload;
    beforeAll(() => {
      newPayload = {
        ...payload,
        actions: [{
          value: 'back_to_launch'
        }]
      };
    });

    it('should go back to launch', async () => {
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockReturnValue(
        { id: 1, name: 'Nairobi', country: { name: 'Kenya' } }
      );
      await UserTripBookingController.back(newPayload, res);
      expect(res).toHaveBeenCalledWith(await TripHelpers.getWelcomeMessage(payload.user.slackId));
    });

    it('should go back to start trip booking message', async () => {
      newPayload.actions[0].value = userTripActions.forMe;
      jest.spyOn(UserTripBookingController, 'startTripBooking').mockReturnValue();
      await UserTripBookingController.back(newPayload, res);
      expect(UserTripBookingController.startTripBooking)
        .toHaveBeenCalledWith(newPayload, res);
    });

    it('should go back to handle reason submission', async () => {
      newPayload.actions[0].value = userTripActions.forSomeone;
      jest.spyOn(UserTripBookingController, 'handleReasonSubmit').mockReturnValue();
      await UserTripBookingController.back(newPayload, res);
      expect(UserTripBookingController.handleReasonSubmit)
        .toHaveBeenCalledWith(newPayload, res);
    });

    it('should go back to add extra passengers', async () => {
      newPayload.actions[0].value = userTripActions.addExtraPassengers;
      await UserTripBookingController.back(newPayload, res);
      expect(res).toHaveBeenCalledWith(UserTripHelpers.getAddPassengersMessage());
    });

    it('should go back to add get department message', async () => {
      newPayload.actions[0].value = userTripActions.getDepartment;
      jest.spyOn(UserTripHelpers, 'getDepartmentListMessage').mockResolvedValue();
      await UserTripBookingController.back(newPayload, res);
      expect(res).toHaveBeenCalled();
    });

    it('should send default value when there is no back value provided', async () => {
      newPayload.actions[0].value = '';
      await UserTripBookingController.back(newPayload, res);
      expect(res).toHaveBeenCalledWith(new SlackInteractiveMessage('Thank you for using Tembea'));
    });
  });

  describe('confirmLocation', () => {
    const newPayload = {
      ...payload,
      actions: [{
        action_id: userTripActions.selectPickupLocation,
        selected_option: {
          text: {
            text: 'Nairobi'
          }
        }
      }]
    };
    beforeEach(() => {
      jest.spyOn(UserTripHelpers, 'handleLocationVerfication')
        .mockResolvedValue('verification message');
      jest.spyOn(UpdateSlackMessageHelper, 'newUpdateMessage').mockResolvedValue();
    });
    it('should confirm pickup location', async () => {
      await UserTripBookingController.confirmLocation(newPayload);
      expect(UpdateSlackMessageHelper.newUpdateMessage).toHaveBeenCalled();
    });

    it('should confirm destination location', async () => {
      newPayload.actions[0].action_id = userTripActions.selectDestinationLocation;
      await UserTripBookingController.confirmLocation(newPayload);
      expect(UpdateSlackMessageHelper.newUpdateMessage).toHaveBeenCalled();
    });
  });

  describe('confirmTripRequest', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
      jest.spyOn(Cache, 'fetch').mockResolvedValue({});
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValue({
        id: 1, slackId: 'U1234'
      });
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId')
        .mockResolvedValue({ id: 2, name: 'Lagos' });
    });

    it('should confirm trip request', async () => {
      jest.spyOn(ScheduleTripHelpers, 'createTripRequest').mockResolvedValue();
      jest.spyOn(Cache, 'delete').mockResolvedValue();
      await UserTripBookingController.confirmTripRequest(payload, res);
      expect(Cache.fetch).toHaveBeenCalledWith(expect.stringContaining(payload.user.id));
      expect(Cache.delete).toHaveBeenCalledTimes(1);
      expect(ScheduleTripHelpers.createTripRequest).toHaveBeenCalled();
    });

    it('should fail when confirming trip request', async () => {
      try {
        jest.spyOn(ScheduleTripHelpers, 'createTripRequest')
          .mockRejectedValue(new Error('Create Request error'));
        await UserTripBookingController.confirmTripRequest(payload, res);
      } catch (error) {
        expect(error).toBeDefined();
        expect(res).toHaveBeenCalled();
      }
    });
  });

  describe('paymentRequest', () => {
    it('save payment request', async () => {
      jest.spyOn(UserTripHelpers, 'savePayment').mockResolvedValue();
      await UserTripBookingController.paymentRequest(payload, res);
      expect(UserTripHelpers.savePayment).toHaveBeenCalled();
    });

    it('should return errors when request fails', async () => {
      jest.spyOn(UserTripHelpers, 'savePayment').mockResolvedValue({ errors: 'error' });
      const result = await UserTripBookingController.paymentRequest(payload, res);
      expect(UserTripHelpers.savePayment).toHaveBeenCalled();
      expect(result.errors).toBeDefined();
    });

    it('respond if there is no submission', async () => {
      const newPayload = {
        ...payload,
        submission: undefined
      };
      jest.spyOn(UserTripBookingController, 'paymentRequest').mockResolvedValue();
      await UserTripBookingController.paymentRequest(newPayload, res);
      expect(UserTripBookingController.paymentRequest).toHaveBeenCalled();
      expect(res).toHaveBeenCalledTimes(0);
    });
  });
});
