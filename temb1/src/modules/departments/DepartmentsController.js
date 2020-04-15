import HttpError from '../../helpers/errorHandler';
import { departmentService } from './department.service';
import UserService from '../users/user.service';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import { DEFAULT_SIZE as defaultSize } from '../../helpers/constants';
import { teamDetailsService } from '../teamDetails/teamDetails.service';
import Response from '../../helpers/responseHelper';
import TripHelper from '../../helpers/TripHelper';
import { homebaseService } from '../homebases/homebase.service';

class DepartmentController {
  static async updateDepartment(req, res) {
    const { body: { name, headEmail }, params: { id } } = req;
    try {
      const { id: headId, success } = await DepartmentController
        .validateHeadExistence(headEmail, res);
      if (success) {
        const department = await departmentService.updateDepartment(
          id, name, headId
        );
        return res
          .status(200)
          .json({
            success: true,
            message: 'Department record updated',
            department
          });
      }
      return HttpError.sendErrorResponse({
        statusCode: 404, message: 'Department Head with specified Email does not exist'
      }, res);
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  static async addDepartment(req, res) {
    const {
      body: {
        name, email, slackUrl, homebaseId
      }
    } = req;
    try {
      const homeBase = await homebaseService.getById(homebaseId);
      let message = 'Homebase with provided homebaseId not found';
      if (homeBase) {
        const [user, { teamId }] = await Promise.all(
          [UserService.getUser(email), teamDetailsService.getTeamDetailsByTeamUrl(slackUrl) || {}]
        );
        if (teamId) {
          const [dept, created] = await departmentService.createDepartment(user,
            name, teamId, homebaseId);
          return DepartmentController.returnCreateDepartmentResponse(res, created, dept);
        }
        message = 'Team with provided slackURl not found';
      }
      return HttpError.sendErrorResponse({
        statusCode: 404, message
      }, res);
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  /**
   * @description Read the department records
   * @param {object} req The http request object
   * @param {object} res The http response object
   * @returns {object} The http response object
   */
  static async readRecords(req, res) {
    try {
      const { headers: { homebaseid } } = req;
      const page = req.query.page || 1;
      const size = req.query.size || defaultSize;
      const data = await departmentService.getAllDepartments(size,
        page, homebaseid);
      const { count, rows } = data;
      if (rows <= 0) {
        throw new HttpError('There are no records on this page.', 404);
      }
      const totalPages = Math.ceil(count / size);
      return res.status(200).json({
        success: true,
        message: `${page} of ${totalPages} page(s).`,
        pageMeta: { totalPages, totalResults: count, page },
        departments: rows,
      });
    } catch (error) {
      HttpError.sendErrorResponse(error, res);
    }
  }

  /**
   * @description This method handles the deleting of a department
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @returns {object} The http response object
   */
  static async deleteRecord(req, res) {
    try {
      const { body: { id: departmentId, name: departmentName } } = req;
      const success = await departmentService.deleteDepartmentByNameOrId(departmentId,
        departmentName);

      if (success) {
        return res.status(200).json({
          success,
          message: 'The department has been deleted'
        });
      }
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  /**
   * @description Get department trips from database
   * @param {object} req
   * @param {object} res
   * @returns {object} The http response object
   */
  static async fetchDepartmentTrips(req, res) {
    try {
      const {
        query: { tripType }, body: { startDate, endDate, departments },
        headers: { homebaseid }
      } = req;
      const analyticsData = await departmentService.getDepartmentAnalytics(
        startDate, endDate, departments, tripType, homebaseid
      );
      const deptData = [];
      const { finalCost, finalAverageRating, count } = await
      TripHelper.calculateSums(analyticsData);
      analyticsData.map((departmentTrip) => {
        const deptObject = departmentTrip;
        deptObject.averageRating = parseFloat(departmentTrip.averageRating).toFixed(2);
        return deptData.push(deptObject);
      });
      const data = {
        trips: analyticsData, finalCost, finalAverageRating, count
      };
      return Response.sendResponse(res, 200, true, 'Request was successful', data);
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  static async validateHeadExistence(headEmail) {
    const user = await UserService.getUserByEmail(headEmail);
    if (!user) return { success: false };
    return { ...user, success: true };
  }

  static returnCreateDepartmentResponse(res, created, dept) {
    if (created) {
      return res.status(201)
        .json({
          success: true,
          message: 'Department created successfully',
          department: dept.dataValues
        });
    }
    return res.status(409)
      .json({
        success: false,
        message: 'Department already exists.',
      });
  }
}

export default DepartmentController;
