import { Sequelize } from 'sequelize-typescript';
import environment from '../config/environment';
import config from '../config/database';

const modelsPath = `${__dirname}/models`;

const database = new Sequelize(environment.DATABASE_URL, {
  models: [modelsPath],
  ...config[environment.NODE_ENV],
});

export default database;
export { Op as Op } from 'sequelize';
export { default as Address } from './models/address';
export { default as BatchUseRecord } from './models/batch-use-record';
export { default as Cab } from './models/cab';
export { default as Country } from './models/country';
export { default as Department } from './models/department';
export { default as Driver } from './models/driver';
export { default as Engagement } from './models/engagement';
export { default as Homebase } from './models/homebase';
export { default as JoinRequest } from './models/join-request';
export { default as Location } from './models/location';
export { default as Partner } from './models/partner';
export { default as User } from './models/user';
export { default as UserRole } from './models/user-role';
export { default as TripRequest } from './models/trip-request';
export { default as TripDetails } from './models/trip-details';
export { default as TeamDetails } from './models/team-details';
export { default as Route } from './models/route';
export { default as RouteUseRecord } from './models/route-use-record';
export { default as RouteRequest } from './models/route-request';
export { default as RouteBatch } from './models/route-batch';
export { default as Role } from './models/role';
export { default as Provider } from './models/provider';
export { default as Feedback } from './models/feedback';
