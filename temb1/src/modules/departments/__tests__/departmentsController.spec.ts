import DepartmentsController from '../DepartmentsController';
import departmentModel from '../../../database/models/department';
import UserService from '../../users/user.service';
import { departmentService } from '../../../modules/departments/department.service';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import errorHandler from '../../../helpers/errorHandler';
import Homebase from '../../../database/models/homebase';
import Utils from '../../../utils';
import { departmentAnalytics } from '../__mocks__/addDepartments';
import Response from '../../../helpers/responseHelper';
import BugsnagHelper from '../../../helpers/bugsnagHelper';

describe('DepartmentControllers', () => {
  let req: any;
  let res: any;
  let userSpy: any;
  let teamServiceSpy: any;
  let validToken: string;

  beforeAll(() => {
    userSpy = jest.spyOn(UserService, 'getUserByEmail');
    teamServiceSpy = jest.spyOn(teamDetailsService, 'getTeamDetailsByTeamUrl');
    res = {
      status: jest.fn(() => ({
        json: jest.fn(),
      })).mockReturnValue({ json: jest.fn() }),
    };
    req = {
      body: {
        name: 'Updated Department',
        headEmail: 1,
        homebaseId: 1,
      },
      params: { id: 1 },
    };

    validToken = Utils.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
  });
  describe('DepartmentsController.updateDepartments', () => {
    it('should validate Location Existence', async () => {
      jest.spyOn(Homebase, 'findOne').mockResolvedValue(null);
      const response = {
        success: false, message: 'Homebase with provided homebaseId not found',
      };
      await DepartmentsController.addDepartment(req, res);
      expect(res.status).toBeCalledWith(404);
      expect(res.status().json).toBeCalledWith(response);
    });
    it('should validate head Existence', async () => {
      userSpy.mockReturnValue(null);
      const { success } = await DepartmentsController.validateHeadExistence(req.body.headEmail);
      await DepartmentsController.updateDepartment(req, res);
      expect(res.status).toBeCalledWith(404);
      expect(res.status().json).toBeCalledWith({
        message: 'Department Head with specified Email does not exist',
        success: false,
      });
      expect(success).toBe(false);
    });

    it('should return a department not found error with wrong id', async () => {
      jest.spyOn(departmentModel, 'update')
      .mockReturnValue([{}, {}]);
      jest.spyOn(DepartmentsController, 'validateHeadExistence')
      .mockReturnValue({ id: 1, success: true });
      await DepartmentsController.updateDepartment(req, res);
      expect(res.status).toBeCalledWith(404);
      expect(res.status().json).toBeCalledWith({
        success: false,
        message: 'Department Head with specified Email does not exist',
      });
    });

    it('should update Department successfully', async () => {
      const response = {
        success: true,
        message: 'Department record updated',
        department: {
          id: 14,
          name: 'Technicalwdde',
          head: {
            name: 'Arthur Kalule',
            email: 'arthur.kalule@andela.com',
          },
        },
      };

      jest.spyOn(DepartmentsController, 'validateHeadExistence').mockReturnValue({
        id: 1, success: true,
      });
      jest.spyOn(departmentService, 'updateDepartment').mockReturnValue(response.department);
      await DepartmentsController.updateDepartment(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.status().json).toBeCalledWith(response);
    });
  });

  describe('DepartmentControllers.addDepartment', () => {
    req = {
      email: 'test@test.com',
      name: 'TDD',
      slackUrl: 'Andela.slack.com',
      homebaseId: 1,
    };
    userSpy = jest.spyOn(UserService, 'getUser').mockReturnValue({});
    it('should create department successfully', async () => {
      jest.spyOn(departmentService, 'createDepartment').mockReturnValue([{}, true]);
      jest.spyOn(Homebase, 'findByPk').mockResolvedValue({
        get: ({ plain }: { plain: boolean }) => {
          if (plain) return {};
        },
      });
      jest.spyOn(DepartmentsController, 'returnCreateDepartmentResponse');
      teamServiceSpy.mockReturnValue({ teamId: 1 });
      await DepartmentsController.addDepartment(req, res);
      expect(DepartmentsController.returnCreateDepartmentResponse).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.status().json).toHaveBeenCalledWith({
        success: true,
        message: 'Department created successfully',
      });
    });

    it('should return error on failure to create department', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(departmentService, 'createDepartment').mockRejectedValue(error);
      jest.spyOn(errorHandler, 'sendErrorResponse');
      await DepartmentsController.addDepartment(req, res);
      expect(errorHandler.sendErrorResponse).toBeCalled();
      expect(res.status).toBeCalledWith(500);
      expect(res.status().json).toBeCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });

    it('should respond with missing homebaseId error', async () => {
      jest.spyOn(Homebase, 'findOne').mockResolvedValue(null);
      await DepartmentsController.addDepartment(req, res);
      expect(res.status().json).toBeCalledWith({
        success: false,
        message: 'Homebase with provided homebaseId not found',
      });
    });

    it('should validate the department existence', async () => {
      jest.spyOn(Homebase, 'findOne').mockResolvedValue({});
      jest.spyOn(departmentService, 'createDepartment').mockResolvedValue([{}, false]);
      await DepartmentsController.addDepartment(req, res);
      expect(res.status).toBeCalledWith(409);
      expect(res.status().json).toBeCalledWith({
        success: false,
        message: 'Department already exists.',
      });
    });
  });
  describe('DepartmentControllers.deleteDepartment', () => {
    it('should return a 404 if department is not found', async () => {
      req.body = {
        name: 'no department',
      };
      await DepartmentsController.deleteRecord(req, res);
      expect(res.status).toBeCalledWith(404);
      expect(res.status().json).toBeCalledWith({
        success: false,
        message: 'Department not found',
      });
    });
    it('should delete the department', async () => {
      jest.spyOn(departmentService, 'deleteDepartmentByNameOrId')
        .mockResolvedValue(true);
      await DepartmentsController.deleteRecord(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.status().json).toBeCalledWith({
        success: true,
        message: 'The department has been deleted',
      });
    });
  });

  describe('DepartmentControllers.readRecords', () => {
    it('should fail when page does not exist', async () => {
      req.query = {
        page: 1000000,
        size: 2,
      };
      req.headers = {
        homebaseid: 1,
      };
      jest.spyOn(UserService, 'getUserByEmail').mockImplementation(() => ({ homebaseId: 1 }));
      jest.spyOn(departmentService, 'getAllDepartments').mockImplementation(() => (
        { count: 0, rows: 0 }));
      await DepartmentsController.readRecords(req, res);
      expect(res.status).toBeCalledWith(404);
      expect(res.status().json).toBeCalledWith({
        success: false,
        message: 'There are no records on this page.',
      });
    });
    it('should paginate the departments record', async () => {
      req.query = {
        page: 1000000,
        size: 2,
      };
      req.headers = {
        homebaseid: 1,
      };

      jest.spyOn(UserService, 'getUserByEmail').mockImplementation(() => ({ homebaseId: 1 }));
      jest.spyOn(departmentService, 'getAllDepartments').mockImplementation(() => (
        { count: 1, rows: 2 }));

      const totalPages = Math.ceil(1 / 2);

      await DepartmentsController.readRecords(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.status().json).toHaveBeenCalledWith({
        success: true,
        message: `${req.query.page} of ${totalPages} page(s).`,
        pageMeta: { totalPages, totalResults: 1, page: req.query.page },
        departments: 2,
      });
    });
  });

  describe('DepartmentControllers.fetchDepartmentTrips', () => {
    it('should fetch department trip analytics', async () => {
      Response.sendResponse = jest.fn(() => {});
      jest.spyOn(departmentService, 'getDepartmentAnalytics')
        .mockResolvedValue(departmentAnalytics);
      await DepartmentsController.fetchDepartmentTrips(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(Response.sendResponse).toHaveBeenCalledTimes(1);
    });

    it('Should catch errors', async () => {
      const error = new Error('There is an error flagged');
      jest.spyOn(departmentService, 'getDepartmentAnalytics').mockRejectedValue(error);
      jest.spyOn(BugsnagHelper, 'log');
      jest.spyOn(errorHandler, 'sendErrorResponse');
      await DepartmentsController.fetchDepartmentTrips(req, res);
      expect(BugsnagHelper.log).toBeCalledWith(error);
      expect(errorHandler.sendErrorResponse).toBeCalledWith(error, res);
    });
  });
});
