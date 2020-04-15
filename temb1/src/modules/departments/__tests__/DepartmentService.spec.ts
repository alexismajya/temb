import faker from 'faker';
import { departmentService } from '../department.service';
import database from '../../../database';
import { departmentMocks, departmentMocks2 } from '../__mocks__';
import cache from '../../shared/cache';

const { models: { Department, TripRequest } } = database;

describe('/DepartmentService', () => {
  afterAll(async () => {
    await database.close();
  });

  describe('Create department', () => {
    it('should find OR create the department', async () => {
      const user = {
        id: 1,
        name: faker.name.findName(),
        slackId: faker.random.word().toUpperCase(),
        phoneNo: faker.phone.phoneNumber('080########'),
        email: faker.internet.email(),
        homebaseId: 3,
      };
      const department = await departmentService.createDepartment(user, 'tembea', 'UIDG453', 3);
      expect(department).toBeDefined();
    });
  });
  describe('Departments update', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });
    it('should run the saveChanges catchBlock on error', async () => {
      jest.spyOn(Department, 'findByPk').mockResolvedValue(1);

      const result = await departmentService.updateDepartment(null, null, null);
      expect(Department.findByPk).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Error updating department' });
    });
    it('should update the department', async () => {
      jest.spyOn(Department, 'findByPk').mockResolvedValue(departmentMocks2[0]);
      jest.spyOn(Department, 'update').mockResolvedValue([{}, [departmentMocks2[1]]]);
      const result = await departmentService.updateDepartment(1, departmentMocks2[1].get());
      expect(Department.findByPk).toHaveBeenCalled();
      expect(Department.update).toHaveBeenCalled();
      expect(result).toEqual(departmentMocks2[1].get());
    });

    it('should return a single instance of a department', async () => {
      jest.spyOn(Department, 'findByPk').mockResolvedValue(departmentMocks2[0]);
      jest.spyOn(departmentService, 'findById')
        .mockImplementationOnce(() => (departmentMocks2[1].get()));
      const dept = await departmentService.getById(1);
      expect(typeof dept).toEqual('object');
      expect(dept).toEqual(departmentMocks2[1].get());
    });
  });
  describe('getDepartments', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });
    beforeAll(() => {
      jest.spyOn(Department, 'findAll').mockResolvedValue(departmentMocks);
    });

    it('should return an array with department entries', async () => {
      const departments = await departmentService.getDepartmentsForSlack();
      expect(departments).toBeInstanceOf(Array);
      expect(departments).toHaveLength(departmentMocks.length);
    });
  });
  describe('DepartmentService_getById', () => {
    beforeAll(() => {
      cache.saveObject = jest.fn(() => { });
      afterEach(() => {
        jest.clearAllMocks();
      });
    });

    it('should throw an error when given non-integer as departmentId', async () => {
      const result = await departmentService.getById('x');
      expect(result).toEqual({
        message:
        'The parameter provided is not valid. It must be a valid number',
      });
    });

    it('should test that database queries are cached', async () => {
      jest.spyOn(Department, 'findByPk').mockResolvedValue(departmentMocks2[0]);
      await departmentService.getById(2);
      expect(cache.saveObject).toBeCalled();
    });

    it('should return a single department', async () => {
      jest.spyOn(Department, 'findByPk').mockResolvedValue(departmentMocks2[0]);
      const department = await departmentService.getById(1);
      expect(department).toBeDefined();
      expect(department.head).toBeDefined();
    });
  });
  describe('DepartmentService_getHeadByDeptId', () => {
    it('should show that this method returns the head data', async () => {
      jest.spyOn(Department, 'findByPk').mockResolvedValue(departmentMocks2[0]);
      const head = await departmentService.getHeadByDeptId(2);
      expect(head).toBeDefined();
    });
  });
  describe('DepartmentService_getDepartmentAnalytics', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });
    beforeAll(() => {
      jest.spyOn(Department, 'findAll').mockResolvedValue(departmentMocks2[1]);
    });

    it('should return an array with department analytics data', async () => {
      jest.spyOn(departmentService, 'mapDepartmentId')
        .mockResolvedValue(['tdd', 'travel', 'Mathematics']);
      jest.spyOn(TripRequest, 'findAll').mockResolvedValue({ get: () => [{}] });
      const departmentData = await departmentService
        .getDepartmentAnalytics(null, null, ['tdd', 'travel', 'Mathematics'], 'Embassy Visit', null);
      expect(departmentData.get()).toBeInstanceOf(Array);
    });

    it('should return an empty array of department analytics data', async () => {
      jest.spyOn(departmentService, 'mapDepartmentId').mockResolvedValue([]);
      jest.spyOn(TripRequest, 'findAll').mockResolvedValue({});
      const departmentData = await departmentService.getDepartmentAnalytics();
      expect(departmentData).toEqual({});
    });
  });

  describe('DepartmentService_mapDepartmentId', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });
    beforeEach(() => {
      jest.spyOn(Department, 'findOne').mockResolvedValue(departmentMocks2[0]);
    });
    it('should map departmentId to department names', async () => {
      const departmentIds = await departmentService.mapDepartmentId(
        ['people', 'tdd', 'travel', 'Mathematics'],
      );
      expect(departmentIds[0]).toEqual(departmentMocks2[1].get().id);
    });
    it('should not map departmentId to department names', async () => {
      jest.spyOn(departmentService, 'findOneByProp').mockImplementationOnce(() => ({}));
      const departmentIds = await departmentService.mapDepartmentId([]);
      expect(departmentIds.length).toBe(0);
    });
  });
});
