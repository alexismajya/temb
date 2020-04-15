import express from 'express';
import { LocationController } from './location.controller';
import middlewares from '../../middlewares';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import { LocationService } from './location.service';
import database, { Location } from '../../database';

const {
  GeneralValidator,
} = middlewares;
const locationRouter = express.Router();

export const locationService = new LocationService(database.getRepository(Location), bugsnagHelper);
const locationController = new LocationController(locationService, bugsnagHelper);

/**
 * @swagger
 * /locations/{id}:
 *  get:
 *    summary: get location by ID
 *    tags:
 *      - Location
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: location id
 *        type: number
 *    responses:
 *      200:
 *        description: success response object containing location object
 *      404:
 *        description: no location found on the database
 */
locationRouter.get(
  '/locations/:id',
  GeneralValidator.validateQueryParams,
  locationController.getLocation.bind(locationController),
);

export default locationRouter;
