import { Router } from 'express';
import middlewares from '../../middlewares';
import FellowController from './FellowsController';
import HomeBaseFilterValidator from '../../middlewares/HomeBaseFilterValidator';


const { GeneralValidator, HomebaseFilterValidator } = middlewares;

const fellowsRouter = Router();

/**
 * @swagger
 * /fellows/activity:
 *  get:
 *    summary: fetch a fellow's route activity
 *    tags:
 *      - Fellows
 *    parameters:
 *      - name: homebaseid
 *        in: header
 *        required: true
 *        description: id of your homebase
 *        type: number
 *      - name: page
 *        in: query
 *        required: false
 *        description: page number (defaults to **1**)
 *        type: number
 *      - name: size
 *        in: query
 *        required: false
 *        description: number of items per page
 *        type: number
 *      - name: id
 *        in: query
 *        required: true
 *        description: user id of a fellow
 *        type: number
 *    responses:
 *      200:
 *        description: response object containing all the details of a fellow's route movement
 */

fellowsRouter.get(
  '/fellows/activity',
  GeneralValidator.validateQueryParams,
  HomeBaseFilterValidator.validateHomeBaseAccess,
  FellowController.getFellowRouteActivity
);

/**
 * @swagger
 * /fellows:
 *  get:
 *    summary: fetch all fellows on routes
 *    tags:
 *      - Fellows
 *    parameters:
 *      - name: homebaseid
 *        in: header
 *        required: true
 *        description: id of your homebase
 *        type: number
 *      - name: page
 *        in: query
 *        required: false
 *        description: page number (defaults to **1**)
 *        type: number
 *      - name: size
 *        in: query
 *        required: false
 *        description: number of items per page
 *        type: number
 *    responses:
 *      200:
 *        description: an array of data objects containing details of fellows on routes
 */
fellowsRouter.get(
  '/fellows',
  GeneralValidator.validateQueryParams,
  HomebaseFilterValidator.validateHomeBaseAccess,
  FellowController.getAllFellows
);

export default fellowsRouter;
