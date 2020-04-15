import request from 'request-promise-native';
import CountryService, { countryService } from '../country.service';
import database from '../../../database';
import { mockReturnedCountryData, mockCountryError } from '../../../services/__mocks__';
import * as mocked from '../__mocks__';
import { deletedCountryMock } from '../../../helpers/__mocks__/countryHelperMock';

const { models: { Country } } = database;

describe(CountryService, () => {
  beforeAll((done) => database.close().then(done, done));

  afterAll((done) => database.close().then(done, done));

  describe('test function GetAllCountries()', () => {
    let findAllCountriesSpy: any;

    beforeEach(() => {
      jest.spyOn(Country, 'count').mockResolvedValue(2);
      findAllCountriesSpy = jest.spyOn(Country, 'findAll');
    });

    it('should get all countries', async () => {
      findAllCountriesSpy.mockResolvedValue(mocked.mockCountryCreationResponse.countries);
      const countries = await countryService.getAllCountries(1, 1, '');
      expect(findAllCountriesSpy).toHaveBeenCalled();
      expect(countries).toEqual({
        count: 1,
        rows: [mocked.mockCountryCreationResponse.countries[0].get()],
      });
    });
  });

  describe('test getCountryByID()', () => {
    it('should get a country by id', async () => {
      const mockedResponse = {
        get: () => ({
          id: 1,
          name: 'Kenya',
          status: 'Active',
          createdAt: '2019-04-01T12:07:13.002Z',
          updatedAt: '2019-04-01T12:07:13.002Z',
        }),
      };
      const findOneSpy = jest.spyOn(Country, 'findOne')
        .mockResolvedValue(mockedResponse);
      const country = await countryService.getCountryById(1);
      expect(findOneSpy).toHaveBeenCalled();
      expect(country).toEqual(mockedResponse.get());
    });
  });

  describe('test findCountryByName', () => {
    it('should find country by name', async () => {
      const findOneSpy = jest.spyOn(Country, 'findOne')
        .mockResolvedValue(mocked.mockCountryCreationResponse.countries[0]);
      const country = await countryService.findCountry('Kenya');
      expect(findOneSpy).toHaveBeenCalled();
      expect(country).toEqual(mocked.mockCountryCreationResponse.countries[0]);
    });
  });

  describe('test createCountry()', () => {
    it('should create a country with supplied name', async () => {
      const createCountrySpy = jest.spyOn(Country, 'findOrCreate');
      createCountrySpy.mockResolvedValue([
        mocked.mockReturnedCountryData, mocked.mockReturnedCountryData._options.isNewRecord,
      ]);
      const result = await countryService.createCountry('Kenya');
      expect(createCountrySpy).toHaveBeenCalled();
      expect(result).toEqual({
        country: { ...mocked.mockReturnedCountryData.get() }, isNewCountry: true,
      });
    });
  });

  describe('test updateCountryName()', () => {
    const countryDetails = {
      id: 1,
      name: 'Kenya',
      status: 'Active',
      createdAt: '2019-04-01T12:07:13.002Z',
      updatedAt: '2019-04-01T12:07:13.002Z',
    };
    it('should update country name', async () => {
      const plainResponse = {
        get: ({ plain }: { plain?: boolean } = {}) => {
          if (plain) {
            return countryDetails;
          }
        },
      };
      const findOneSpy = jest.spyOn(Country, 'findByPk')
        .mockResolvedValue(plainResponse);
      jest.spyOn(Country, 'update').mockImplementation((data: any, options: any) => ([
        null, [{ get: () => ({ id: options.where.id, ...data }) }],
      ]));

      const result = await countryService.updateCountryName(1, 'New Kenya');

      expect(result).toHaveProperty('name', 'New Kenya');
      expect(findOneSpy).toHaveBeenCalled();
    });

    it('should return an error when the name already exists', async () => {
      const plainResponse = {
        get: ({ plain }: { plain: true }) => {
          if (plain) {
            return countryDetails;
          }
        },
      };
      const findOneSpy = jest.spyOn(Country, 'findByPk')
        .mockResolvedValue(plainResponse);
      jest.spyOn(Country, 'update').mockRejectedValue(new Error());

      const result = await countryService.updateCountryName(2, 'New Kenya');

      expect(result).toHaveProperty('message', 'Country name already exists');
      expect(findOneSpy).toHaveBeenCalled();
    });

    it('should return an error when the is not found', async () => {
      const plainResponse = {
        get: ({ plain }: { plain: boolean }): any => {
          if (plain) return undefined;
        },
      };
      const findOneSpy = jest.spyOn(Country, 'findByPk')
        .mockResolvedValue(plainResponse);

      const result = await countryService.updateCountryName(2, 'New Kenya');

      expect(result).toHaveProperty('message', 'Country does not exist');
      expect(findOneSpy).toHaveBeenCalled();
    });
  });

  describe('test deleteCountryName', () => {
    it('should delete a country', async () => {
      const mockResponse = {
        get: () => ({
          status: 'active',
          name: 'Kenya',
          id: 1,
        }),
        id: 1,
      };

      const findOneSpy = jest.spyOn(Country, 'findOne')
        .mockResolvedValue(mockResponse);
      jest.spyOn(Country, 'update').mockResolvedValue([1, [mockResponse]]);

      const result = await countryService.deleteCountryByNameOrId(null, 'Kenya');
      expect(findOneSpy).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result).toEqual(true);
    });
  });

  describe('test findDeletedCountry', () => {
    beforeAll(() => {
      jest.spyOn(Country, 'scope').mockReturnValue({
        findOne: jest.fn(),
      });
    });

    it('should find a country that is deleted and return it', async () => {
      jest.spyOn(Country.scope(), 'findOne').mockReturnValue(deletedCountryMock);
      const returnedCountry = await countryService.findDeletedCountry('Kenya');
      expect(Country.scope).toHaveBeenCalledWith('all');
      expect(returnedCountry).toEqual(deletedCountryMock);
    });

    describe('test findIfCountryIsListedGlobally', () => {
      let getSpy: any;
      beforeEach(() => {
        getSpy = jest.spyOn(request, 'get');
        jest.resetAllMocks();
      });

      it('should return a country that is listed globally', async () => {
        getSpy.mockResolvedValue(mockReturnedCountryData);
        const result = await countryService.findIfCountryIsListedGlobally('Kenya');
        expect(request.get).toHaveBeenCalled();
        expect(result).toEqual(mockReturnedCountryData);
      });

      it('should return an error object if country was not found', async () => {
        getSpy.mockRejectedValue(mockCountryError);
        const result = await countryService.findIfCountryIsListedGlobally('abuja');
        expect(request.get).toHaveBeenCalled();
        expect(result).toEqual(mockCountryError);
      });
    });
  });
});
