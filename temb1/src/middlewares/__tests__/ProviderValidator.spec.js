/* eslint-disable no-useless-escape */
import ProviderValidator from '../ProviderValidator';
import HttpError from '../../helpers/errorHandler';
import UserService from '../../modules/users/user.service';
import Response from '../../helpers/responseHelper';
import { providerService } from '../../modules/providers/provider.service';

const errorMessage = 'Validation error occurred, see error object for details';

describe(ProviderValidator, () => {
  let res;
  let next;
  let req;
  beforeEach(() => {
    res = {
      status: jest.fn(() => ({
        json: jest.fn()
      }))
    };
    next = jest.fn();
    jest.spyOn(HttpError, 'sendErrorResponse').mockReturnValue();
    jest.spyOn(Response, 'sendResponse').mockReturnValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe(ProviderValidator.verifyProviderUpdate, () => {
    let httpSpy;
    beforeEach(() => {
      httpSpy = jest.spyOn(HttpError, 'sendErrorResponse');
    });

    it('should validate update parameters ', () => {
      const error = { message: { invalidParameter: 'Id should be a valid integer' } };
      req = {
        params: { id: 'notValid' },
        body: {}
      };
      httpSpy.mockReturnValue(error);
      ProviderValidator.verifyProviderUpdate(req, res, next);
      expect(httpSpy).toBeCalled();
    });

    it('should validate empty request body', () => {
      req = {
        params: { id: 1 },
        body: {}
      };
      ProviderValidator.verifyProviderUpdate(req, res, next);
      expect(httpSpy).toBeCalled();
    });

    it('should validate empty request body values', () => {
      req = {
        params: { id: 1 },
        body: {
          name: '',
          email: 'me@email.com'
        }
      };

      ProviderValidator.verifyProviderUpdate(req, res, next);
      expect(httpSpy).toBeCalled();
    });

    it('should return next if valid update body ', () => {
      req = {
        params: { id: 1 },
        body: { email: 'me@email.com' }
      };

      ProviderValidator.verifyProviderUpdate(req, res, next);
      expect(httpSpy).not.toBeCalled();
      expect(next).toBeCalled();
    });
  });

  describe(ProviderValidator.validateNewProvider, () => {
    it('validates the PATCH method', () => {
      req = {
        method: 'PATCH',
        body: {}
      };
      ProviderValidator.validateNewProvider(req, res, next);
      expect(HttpError.sendErrorResponse)
        .toHaveBeenCalledWith({
          statusCode: 400,
          message: errorMessage,
          error: {
            email: 'Please provide email',
            name: 'Please provide name',
            notificationChannel: 'Please provide notificationChannel'
          },
        }, res);
    });

    it('returns next', () => {
      req = {
        body: {
          email: 'allan@andela.com',
          name: 'all',
          notificationChannel: '0',
        }
      };
      ProviderValidator.validateNewProvider(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe(ProviderValidator.validateDriverRequestBody, () => {
    it('should throw errors if fields are missing in body', async () => {
      const createReq = {
        body: {
          driverName: 'Muhwezi Deo',
          driverNumber: '42220222',
          email: 'Test@test.com'
        }
      };
      await ProviderValidator.validateDriverRequestBody(createReq, res, next);
      expect(HttpError.sendErrorResponse).toHaveBeenCalledWith({
        statusCode: 400,
        message: errorMessage,
        error: {
          driverPhoneNo: 'Please provide driverPhoneNo',
          providerId: 'Please provide providerId'
        }
      }, res);
    });
    it('should throw errors if a field is empty', async () => {
      const createReq = {
        body: {
          driverName: '',
          driverNumber: '42220222',
          email: 'Test@test.com',
          driverPhoneNo: '+2507042211313',
          providerId: 1
        }
      };
      await ProviderValidator.validateDriverRequestBody(createReq, res, next);
      expect(HttpError.sendErrorResponse).toHaveBeenCalledWith({
        statusCode: 400,
        message: errorMessage,
        error: { driverName: '\"driverName\" is not allowed to be empty' }
      }, res);
    });
    it('should call next if request body is valid', async () => {
      const createReq = {
        body: {
          driverName: 'Test User',
          driverNumber: '42220222',
          email: 'Test@test.com',
          driverPhoneNo: '+2507042211313',
          providerId: 1
        }
      };
      await ProviderValidator.validateDriverRequestBody(createReq, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe(ProviderValidator.validateProviderExistence, () => {
    it('should send error if a provider doesnt exist', async () => {
      const createReq = {
        body: {
          driverName: 'Test User',
          driverNumber: '42220222',
          email: 'Test@test.com',
          driverPhoneNo: '07042211313',
          providerId: 100
        }
      };
      jest.spyOn(providerService, 'findByPk').mockReturnValue(null);
      await ProviderValidator.validateProviderExistence(createReq, res, next);
      expect(Response.sendResponse).toBeCalledWith(res, 404, false, 'Provider doesnt exist');
    });
    it('should call next if provider exists', async () => {
      const createReq = {
        body: {
          driverName: 'Test User',
          driverNumber: '42220222',
          email: 'Test@test.com',
          driverPhoneNo: '07042211313',
          providerId: 1
        }
      };
      jest.spyOn(providerService, 'findByPk').mockReturnValue({
        name: 'Test Provider',
        email: 'test@test.com'
      });
      await ProviderValidator.validateProviderExistence(createReq, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe(ProviderValidator.validateProvider, () => {
    let testReq;
    beforeEach(() => {
      testReq = {
        body: {
          driverName: 'Test User',
          driverNumber: '42220222',
          email: 'Test@test.com',
          driverPhoneNo: '07042211313',
          notificationChannel: '0',
        },
        headers: {
          teamurl: 'https://temvea.test',
        }
      };

      jest.spyOn(UserService, 'createUserByEmail').mockResolvedValue({ id: 1 });
    });

    it('should add provider user id if user exists', async () => {
      const updateReq = { ...testReq };
      await ProviderValidator.validateProvider(updateReq, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
