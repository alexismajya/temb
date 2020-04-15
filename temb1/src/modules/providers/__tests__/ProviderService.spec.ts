import ProviderHelper from '../../../helpers/providerHelper';
import { providerService } from '../provider.service';
import UserService from '../../users/user.service';
import {
  mockGetCabsData,
  mockCreatedProvider,
  mockProviderRecord,
  mockCabsData,
  mockDriversData,
  mockProviderRecordByProviderId,
  mockProviderRecordById,
} from '../__mocks__/ProviderMockData';
import database from '../../../database';
import Notifications from '../../../modules/slack/SlackPrompts/Notifications';
import { mockProviderInformation, mockInformation, mockTeamDetailInformation }
  from '../notifications/__mocks__/mockInformation';

const { models: { Provider } } = database;

describe('ProviderService', () => {
  describe(providerService.getProviders, () => {

    beforeEach(() => {
      ProviderHelper.serializeDetails = jest.fn();
    });

    it('returns a list of providers', async () => {
      jest.spyOn(Provider, 'findAll').mockResolvedValue(mockCabsData.cabsFiltered);
      const result = await providerService.getProviders({ page: 1, size: 10 }, {}, 1);
      expect(result.pageMeta.pageNo).toBe(1);
      expect(Provider.findAll).toBeCalled();
    });

    it('returns a list of providers when the page able parameter is not passed', async () => {
      jest.spyOn(Provider, 'findAll').mockResolvedValue(mockCabsData.cabsFiltered);
      const result = await providerService.getProviders({ page: undefined, size:undefined }, {}, 1);
      expect(result.pageMeta.pageNo).toBe(1);
      expect(Provider.findAll).toBeCalled();
    });

    it('returns a list of providers when page <= totalPages', async () => {
      jest.spyOn(Provider, 'findAll').mockResolvedValue(mockCabsData.cabsFiltered);
      const result = await providerService.getProviders({ page: 2, size: 10 }, {}, 1);
      expect(result.pageMeta.pageNo).toBe(1);
      expect(Provider.findAll).toBeCalled();
    });

  });

  describe(providerService.createProvider, () => {
    beforeEach(() => {
      jest.spyOn(Provider, 'create').mockResolvedValue(mockCreatedProvider[0]);
    });

    it('test createProvider', async () => {
      const result = await providerService.createProvider({
        name: 'Uber Kenya', providerUserId: 3,
      });

      expect(Provider.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedProvider[0].get());
    });
  });

  describe(providerService.deleteProvider, () => {
    beforeAll(() => {
      jest.spyOn(Provider, 'destroy').mockResolvedValue(1);
    });

    it('should delete a provider successfully', async () => {
      const result = await providerService.deleteProvider(1);
      expect(result).toEqual(1);
    });

    it('should return zero for unexisting data', async () => {
      jest.spyOn(Provider, 'destroy').mockResolvedValue(0);
      const result = await providerService.deleteProvider(1);
      expect(result).toEqual(0);
    });

  });

  describe(providerService.updateProvider, () => {
    it('should update provider details successfully', async () => {
      const mockData = [1, [{ name: 'Uber Uganda' }]];
      jest.spyOn(UserService, 'getUserByEmail')
        .mockReturnValue({
          dataValues: { id: 1 },
        });
      jest.spyOn(providerService, 'updateProvider').mockReturnValueOnce(mockData);
      const results = await providerService.updateProvider({ name: 'Uber Uganda' }, 100);
      expect(results[1][0].name)
        .toEqual('Uber Uganda');
    });
  });

  describe(providerService.findByPk, () => {
    it('should find provider by PK', async () => {
      const mockResponse = {
        get: () => ({
          mockProviderRecordById,
        }),
      };
      jest.spyOn(Provider, 'findByPk').mockReturnValue(mockResponse);
      const results = await providerService.findByPk(1, true);
      expect(Provider.findByPk).toBeCalled();
    });
  });

  describe(providerService.findProviderByUserId, () => {
    it('should find provider by user id', async () => {
      jest.spyOn(Provider, 'findOne').mockReturnValue(mockProviderRecordByProviderId);
      const results = await providerService.findProviderByUserId(16);
      expect(Provider.findOne).toBeCalled();
    });
  });

  describe(providerService.getViableProviders, () => {
    it('should get viable providers in providers drop down', async () => {
      const dummyProviders = [{
        get: () => ({
          vehicles: mockCabsData.cabs, drivers: mockDriversData,
        }),
      }];
      jest.spyOn(Provider, 'findAll').mockResolvedValue(dummyProviders);
      await providerService.getViableProviders(1);
      expect(Provider.findAll).toBeCalled();
    });
  });

  describe(providerService.getProviderBySlackId, () => {
    it('should get provider by slack id', async () => {
      const result = await providerService.getProviderBySlackId('3');
      expect(result).toBeDefined();
    });
  });

  describe(providerService.notifyTripRequest, () => {
    it('should notify user using Direct message channel', async () => {
      jest.spyOn(Notifications, 'sendNotification').mockResolvedValue(null);
      jest.spyOn(Notifications, 'getDMChannelId').mockResolvedValue(null);
      await providerService.notifyTripRequest(mockProviderInformation,
        mockTeamDetailInformation, mockInformation.tripDetails);
    });
  });
});
