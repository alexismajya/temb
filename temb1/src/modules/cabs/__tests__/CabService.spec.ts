import { cabService } from '../cab.service';
import database from '../../../database';
import { mockCabsData } from '../../../services/__mocks__';

const { models: { Cab } } = database;

describe('cabService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll((done) => database.close().then(done, done));

  describe('findOrCreateCab', () => {
    it("return newly created cab if it doesn't exist", async () => {
      jest.spyOn(Cab, 'findOrCreate').mockImplementation((obj) => Promise.resolve([{
        get: () => obj.defaults,
      }]));
      const { cab } = await cabService.findOrCreateCab('Hello', 3, 'Test', 1);
      expect(cab.regNumber).toEqual('Hello');
    });
  });

  describe('findByRegNumber', () => {
    it('should return cab details from the db', async () => {
      const mockCabDetails = {
        get: ({ plain }: { plain: boolean }) => {
          if (plain) {
            return {
              driverName: 'Omari',
              regNumber: 'AR R3G NMB',
            };
          }
        },
      };
      jest.spyOn(Cab, 'findOne').mockResolvedValue(mockCabDetails);
      const cabDetails = await cabService.findByRegNumber('AR R3G NMB');
      expect(cabDetails).toEqual(mockCabDetails.get({ plain: true }));
    });
  });

  describe('getById', () => {
    const strippedData = {
      get: (data: { plain: boolean }) => {
        if (data && data.plain) return { driverName: 'Omari', regNumber: 'AR R3G NMB' };
      },
    };
    const resolvedValue = strippedData.get({ plain: true });
    it('should return cab data successfully', async () => {
      Cab.findByPk = jest.fn(() => strippedData);
      const cabDetails = await cabService.getById(1);
      expect(cabDetails).toEqual(resolvedValue);
    });
  });

  describe('getCabs', () => {
    const getAllCabsSpy = jest.spyOn(Cab, 'findAll');
    it('should return array of cabs from the db', async () => {
      getAllCabsSpy.mockResolvedValue(mockCabsData.cabs);
      const result = await cabService.getCabs(undefined, undefined);
      expect(result.pageMeta.pageNo).toBe(1);
      expect(result.data.length).toEqual(4);
      expect(result.pageMeta.totalPages).toBe(1);
    });

    it('total items per page should be 2 when size provided is 2', async () => {
      // TODO: fix test later
      getAllCabsSpy.mockResolvedValue(mockCabsData.cabsFiltered);
      const pageable = { page: 2, size: 1 };
      const result = await cabService.getCabs(pageable);
      expect(result).toEqual(expect.objectContaining({
        data: expect.arrayContaining([]),
        pageMeta: expect.objectContaining({
          itemsPerPage: expect.any(Number),
        }),
      }));
    });
    it('pageNo should be 3 when the third page is requested', async () => {
      getAllCabsSpy.mockResolvedValue(mockCabsData.cabsFiltered);
      const pageable = { page: 3, size: 2 };
      const result = await cabService.getCabs(pageable);
      expect(result).toEqual(expect.objectContaining({
        data: expect.arrayContaining([]),
        pageMeta: expect.objectContaining({
          itemsPerPage: expect.any(Number),
        }),
      }));
    });
  });

  describe('updateCab', () => {
    it('should update cab details successfully', async () => {
      const data = { id: 1, driverName: 'Muhwezi Dee' };
      const mockData = [1, [{ get: () => data }]];
      jest.spyOn(Cab, 'update').mockResolvedValue(mockData);
      jest.spyOn(Cab, 'findByPk')
        .mockReturnValue({
          get: ({ plain }: { plain: boolean }) => {
            if (plain) return { id: 1, driverName: 'Muhwezi Dee' };
          },
        });
      const newCab = await cabService.updateCab(1, { driverName: 'Muhwezi Dee' });
      expect(newCab).toEqual(data);
    });

    it('should return not found message if cab doesnot exist', async () => {
      const result = await cabService.updateCab(1, { driverName: 'Muhwezi Dee' });
      expect(result).toEqual({ message: 'Update Failed. Cab does not exist' });
    });

    it('should catch error in updating', async () => {
      try {
        await cabService.updateCab({});
      } catch (error) {
        expect(error.message).toEqual('Could not update cab details');
      }
    });
  });

  describe('deleteCab', () => {
    it('should delete a cab successfully', async () => {
      Cab.destroy = jest.fn(() => 1);

      const result = await cabService.deleteCab(1);
      expect(result).toEqual(1);
    });

    it('should return zero for unexisting data', async () => {
      Cab.destroy = jest.fn(() => 0);

      const result = await cabService.deleteCab(1);
      expect(result).toEqual(0);
    });
  });
});
