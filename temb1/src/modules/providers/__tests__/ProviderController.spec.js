import sequelize from 'sequelize';
import {
  successMessage,
  viableProviders,
  newProviders,
  newPaginatedData
} from '../__mocks__/ProviderMockData';
import BugsnagHelper from '../../../helpers/bugsnagHelper';
import ProviderHelper from '../../../helpers/providerHelper';
import Response from '../../../helpers/responseHelper';
import { providerService } from '../provider.service';
import HttpError from '../../../helpers/errorHandler';
import UserService from '../../users/user.service';
import {
  mockReturnedProvider,
  mockUser,
} from '../../../services/__mocks__';
import ProviderController from '../ProviderController';


describe(ProviderController, () => {
  let req;
  let providerServiceSpy;
  let createUserByEmailSpy;
  const res = {
    status() {
      return this;
    },
    json() {
      return this;
    }
  };

  beforeEach(() => {
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    createUserByEmailSpy = jest.spyOn(UserService, 'createUserByEmail');
    jest.spyOn(HttpError, 'sendErrorResponse').mockResolvedValue(null);
    jest.spyOn(Response, 'sendResponse').mockResolvedValue(null);
    jest.spyOn(BugsnagHelper, 'log').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });


  describe(ProviderController.getAllProviders, () => {
    beforeEach(() => {
      providerServiceSpy = jest.spyOn(providerService, 'getProviders');
      req = {
        query: {
          page: 1,
          size: 3,
          name: 'uber'
        },
        currentUser: { userInfo: { email: 'ddd@gmail.com' } },
        headers: {
          homebaseid: '4'
        }
      };
    });

    it('Should get all providers', async () => {
      const paginateSpy = jest.spyOn(ProviderHelper, 'paginateData');
      providerServiceSpy.mockResolvedValue(newProviders);
      paginateSpy.mockReturnValue(newPaginatedData);
      jest.spyOn(Response, 'sendResponse').mockReturnValue();
      await ProviderController.getAllProviders(req, res);
      expect(ProviderHelper.paginateData)
        .toHaveBeenCalled();
      expect(Response.sendResponse)
        .toBeCalledWith(res, 200, true, successMessage, newProviders);
    });

    it('Should catch errors', async () => {
      const error = new Error('Something went wrong');
      providerServiceSpy.mockRejectedValue(error);
      jest.spyOn(UserService, 'getUserByEmail').mockImplementation(() => ({ email: 'ddd@gmail.com' }));
      await ProviderController.getAllProviders(req, res);
      expect(BugsnagHelper.log)
        .toBeCalledWith(error);
      expect(HttpError.sendErrorResponse)
        .toBeCalledWith(error, res);
    });
  });

  describe(ProviderController.addProvider, () => {
    const providerData = {
      name: 'Uber Kenya',
      email: 'allan@andela.com',
      notificationChannel: '0',
    };
    let providerSpy;

    beforeEach(() => {
      req = {
        body: providerData,
        headers: {
          homebaseid: '4'
        }
      };
      jest.spyOn(UserService, 'getUserByEmail')
        .mockResolvedValue(mockUser);
      providerSpy = jest.spyOn(providerService, 'createProvider');
      jest.spyOn(providerService, 'verify').mockResolvedValue(null);
    });

    it('creates a provider successfully', async () => {
      const { homebaseid } = req.headers;
      providerSpy.mockResolvedValue(mockReturnedProvider.provider);
      await ProviderController.addProvider(req, res);
      expect(providerService.createProvider)
        .toHaveBeenCalledWith({ ...providerData, homebaseId: homebaseid });
      expect(Response.sendResponse)
        .toHaveBeenCalledWith(res, 201, true, 'Provider created successfully',
          mockReturnedProvider.provider);
    });

    it('logs HTTP errors', async () => {
      const err = 'validationError';
      providerSpy.mockRejectedValueOnce(err);
      await ProviderController.addProvider(req, res);
      expect(BugsnagHelper.log)
        .toHaveBeenCalledWith(err);
      expect(Response.sendResponse)
        .toHaveBeenCalledWith(res, 400, false, expect.any(String), expect.any(Object));
    });
  });

  describe(ProviderController.updateProvider, () => {
    it('should update provider successfully', async () => {
      createUserByEmailSpy.mockResolvedValue({ id: 1 });
      providerServiceSpy = jest.spyOn(providerService, 'updateProvider').mockReturnValue({});
      req = {
        params: 1,
        body: {
          name: 'Sharks Uber',
          email: 'Sharks@uber.com'
        },
        headers: { teamurl: 'teamurl' }
      };
      await ProviderController.updateProvider(req, res);
      expect(Response.sendResponse).toBeCalled();
      expect(Response.sendResponse).toBeCalledWith(res, 200, true, 'Provider Details updated Successfully', {});
    });

    it('should return message if provider doesnt exist', async () => {
      createUserByEmailSpy.mockResolvedValue({ id: 1 });
      providerServiceSpy = jest.spyOn(providerService, 'updateProvider').mockResolvedValue({ message: 'Update Failed. Provider does not exist' });
      req = {
        params: 100,
        body: {
          name: 'Sharks Uber',
          email: 'Sharks@uber.com'
        },
        headers: { teamurl: 'teamurl' }
      };
      await ProviderController.updateProvider(req, res);
      expect(Response.sendResponse).toBeCalledWith(res, 404, false, 'Update Failed. Provider does not exist');
    });

    it('should return message if user doesnt exist', async () => {
      createUserByEmailSpy.mockResolvedValue(false);
      providerServiceSpy = jest.spyOn(providerService, 'updateProvider').mockReturnValue({
        message: 'user with email doesnt exist'
      });
      req = {
        params: 100,
        body: {
          name: 'Sharks Uber',
          email: 'Sharks@uber.com'
        },
        headers: { teamurl: 'teamurl' }
      };
      await ProviderController.updateProvider(req, res);
      expect(Response.sendResponse).toBeCalledWith(res, 404, false, 'user with email doesnt exist');
    });

    it('should return message if update fails', async () => {
      const error = new Error('Something went wrong');
      createUserByEmailSpy.mockResolvedValue(false);
      providerServiceSpy = jest.spyOn(providerService, 'updateProvider').mockRejectedValue(error);
      req = {
        params: 100,
        body: {
          name: 'Sharks Uber',
          email: 'Sharks@uber.com'
        },
        headers: { teamurl: 'teamurl' }
      };
      await ProviderController.updateProvider(req, res);
      expect(BugsnagHelper.log).toBeCalled();
      expect(Response.sendResponse).toBeCalled();
    });
    it('should return message for sequelize validation error', async () => {
      const error = new sequelize.ValidationError();
      providerServiceSpy = jest.spyOn(providerService, 'updateProvider').mockRejectedValue(error);
      req = {
        params: 100,
        body: {
          name: 'Sharks Uber',
          email: 'Sharks@uber.com'
        },
        headers: { teamurl: 'teamurl' }
      };
      await ProviderController.updateProvider(req, res);
      expect(BugsnagHelper.log).toBeCalled();
      expect(Response.sendResponse).toBeCalled();
    });
  });
  describe(ProviderController.deleteProvider, () => {
    let deleteProviderSpy;
    let message;
    beforeEach(() => {
      req = {
        params: {
          id: 1
        },
        headers: {
          homebaseid: '4'
        }
      };
    });
    beforeEach(() => {
      deleteProviderSpy = jest.spyOn(providerService, 'deleteProvider');
    });

    it('should return server error', async () => {
      deleteProviderSpy.mockRejectedValueOnce('something happened');
      const serverError = {
        message: 'Server Error. Could not complete the request',
        statusCode: 500
      };
      await ProviderController.deleteProvider(req, res);
      expect(BugsnagHelper.log).toHaveBeenCalledWith('something happened');
      expect(HttpError.sendErrorResponse).toHaveBeenCalledWith(serverError, res);
    });

    it('should delete a provider successfully', async () => {
      message = 'Provider deleted successfully';
      deleteProviderSpy.mockReturnValue(1);
      await ProviderController.deleteProvider(req, res);
      expect(Response.sendResponse).toHaveBeenCalledWith(res, 200, true, message);
    });

    it('should return provider does not exist', async () => {
      message = 'Provider does not exist';
      deleteProviderSpy.mockReturnValue(0);
      await ProviderController.deleteProvider(req, res);
      expect(Response.sendResponse).toHaveBeenCalledWith(res, 404, false, message);
    });
  });

  describe(ProviderController.getViableProviders, () => {
    it('Should get a list of viable providers', async () => {
      jest.spyOn(providerService, 'getViableProviders').mockResolvedValue(viableProviders);
      await ProviderController.getViableProviders(req);
      expect(providerService.getViableProviders).toHaveBeenCalled();
    });
    it('should return a 404 error', async () => {
      const message = 'No viable provider exists';
      jest.spyOn(providerService, 'getViableProviders').mockResolvedValue([]);
      await ProviderController.getViableProviders(req, res);
      expect(Response.sendResponse).toHaveBeenCalledWith(res, 404, false, message);
    });
  });
});
