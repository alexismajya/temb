import sequelize, { Op } from 'sequelize';
import User from '../../database/models/user';
import database from '../../database';
import TripRequest from '../../database/models/trip-request';
import UserService from '../../modules/users/user.service';
import HttpError from '../../helpers/errorHandler';
import cache from '../shared/cache';
import Department, { DepartmentStatuses } from '../../database/models/department';
import { IUser } from '../../database/models/interfaces/user.interface';
import { BaseService } from '../shared/base.service';
import { homeBaseModelHelper } from '../../helpers/HomeBaseHelper';
import { string } from '@hapi/joi';

const getDeptKey = (id: number) => `dept_${id}`;
const userInclude = {
  model: User,
  as: 'head',
  required: true,
  attributes: ['name', 'email'],
  where: { },
};
export const departmentDataAttributes = {
  attributes: [
    'departmentId',
    [sequelize.literal('department.name'), 'departmentName'],
    [sequelize.fn('avg', sequelize.col('rating')), 'averageRating'],
    [sequelize.fn('count', sequelize.col('department.id')), 'totalTrips'],
    [sequelize.fn('sum', sequelize.col('cost')), 'totalCost'],
  ],
  group: ['department.id', 'departmentId'],
};

class DepartmentService extends BaseService<Department, number>
{
  constructor(department = database.getRepository(Department)) {
    super(department);
  }

  async createDepartment(user:IUser, name: string, teamId: string, homebaseId: number) {
    const data = await this.model.findOrCreate({
      where: { homebaseId, name: { [Op.iLike]: `${name}%` } },
      defaults: {
        teamId,
        homebaseId,
        name,
        headId: user.id,
      },
    });
    const department = { ...data[0].get() as Department };
    await this.update(department.id, { status: 'Active',  headId: user.id });
    return [department, true];
  }

  async getHeadId(email: string) {
    try {
      const headOfDepartment = await UserService.getUser(email);
      return headOfDepartment.id;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      HttpError.throwErrorIfNull(null, 'Error getting the head of department', 500);
    }
  }

  async updateDepartment(id: number, name: string, headId: number) {
    try {
      const oldDepartment = await this.findById(id, [userInclude]);
      if (!oldDepartment) {
        HttpError.throwErrorIfNull(oldDepartment,
          'Department not found. To add a new department use POST /api/v1/departments');
      }
      const department = await this.update(id, { name, headId });
      return department;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      return { message: 'Error updating department' };
    }
  }

  /**
   * @description returns paginated departments records
   * @param {number} size The size of a single paginated
   * @param {number} page The page number
   * @returns {object} an array of departments
   */
  async getAllDepartments(size: number, page: number, homebaseId: number) {
    return Department.findAndCountAll({
      raw: true,
      limit: size,
      where: homebaseId ? { homebaseId } : undefined,
      include: [
        { model: User, as: 'head' },
        homeBaseModelHelper(),
      ],
      offset: (size * (page - 1)),
      order: [['id', 'DESC']],
    });
  }

  /**
   * @description This method deletes a department
   * @param {number} id The id of the department
   * @param {string} name The name of the department
   * @returns {boolean} The status of the delete operation
   */
  async deleteDepartmentByNameOrId(id = -1, name = '') {
    const department = await Department.findOne({
      where: {
        [Op.or]: [{ id }, { name: { [Op.iLike]: `${name.trim()}` } }],
      },
    });

    HttpError.throwErrorIfNull(department, 'Department not found', 404);

    department.status = DepartmentStatuses.inactive;
    department.save();
    return true;
  }

  async getById(departmentId: number, includeOptions = ['head']) {
    if (Number.isNaN(parseInt(`${departmentId}`, 10))) {
      return { message: 'The parameter provided is not valid. It must be a valid number' };
    }
    const department = await this.findById(departmentId, includeOptions);
    await cache.saveObject(getDeptKey(departmentId), department);
    return department;
  }

  async getHeadByDeptId(departmentId: number) {
    const department = await this.findById(departmentId);
    const { head } = department;
    return head;
  }

  async getDepartmentsForSlack(teamId: string, homebaseId: number) {
    const departments = teamId ? await this.findAll({
      where: { teamId, homebaseId },
      include: ['head'],
    }) : await this.model.findAll({
      include: ['head'],
      where: { homebaseId },
    });
    return departments.map((item: any) => ({
      label: item.name,
      value: item.id,
      head: item.head ? item.head : item.head,
    }));
  }

  async mapDepartmentId(departmentNames : string[]): Promise<number[]> {
    const data = await Promise.all(departmentNames.map(async (departmentName) => {
      const { id } =  (await this.findOneByProp({ prop: 'name', value: { [Op.iLike]: `${String(departmentName).trim()}` } })) || { id: -1 };
      return id;
    }));
    return data;
  }

  async getDepartmentAnalytics(
    startDate: string, endDate: string, departments: string[],
    tripType: string, homebaseId: number) {
    const departmentId = await departmentService.mapDepartmentId(departments);
    let where = {};
    if (departmentId.length) { where = { id: { [Op.in]: departmentId } }; }
    const tripFilter = { homebaseId, tripType, tripStatus: 'Completed',
      createdAt: { [Op.between]: [startDate, endDate] },
    };
    if (tripType) { tripFilter.tripType = tripType; }
    // @ts-ignore
    const result = await TripRequest.findAll({
      where: tripFilter,
      include: [{ where, model: Department, as: 'department' }],
      ...departmentDataAttributes,
      raw: true,
    });
    return result;
  }
}
export const departmentService = new DepartmentService();
export default DepartmentService;
