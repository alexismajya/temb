import { Router } from 'express';
import middlewares from '../../middlewares';
import CabsController from './CabsController';

const {
  CabsValidator, GeneralValidator, ProviderValidator,
} = middlewares;

const cabsRouter = Router();

/**
 * @swagger
 * /cabs:
 *  post:
 *    summary: creates a new cab
 *    tags:
 *      - Cabs
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - regNumber
 *            - capacity
 *            - model
 *            - providerId
 *            - color
 *          properties:
 *            regNumber:
 *              type: string
 *            capacity:
 *              type: number
 *            model:
 *              type: string
 *            providerId:
 *              type: number
 *            color:
 *              type: string
 *    responses:
 *      201:
 *        description: cab created successfully
 */

cabsRouter.post(
  '/cabs',
  CabsValidator.validateAllInputs,
  ProviderValidator.validateProviderExistence,
  CabsController.createCab
);

/**
 * @swagger
 * /cabs:
 *  get:
 *    summary: get all cabs
 *    tags:
 *      - Cabs
 *    parameters:
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
 *        description: response object containing an array of cabs
 *      400:
 *        description: invalid parameters provided in url
 *      401:
 *        description: unauthorized access not allowed
 */
cabsRouter.get(
  '/cabs',
  GeneralValidator.validateQueryParams,
  CabsController.getAllCabs
);

/**
 * @swagger
 * /cabs/{id}:
 *  put:
 *    summary: update cab details
 *    tags:
 *      - Cabs
 *    parameters:
 *      - in : path
 *        name: id
 *        schema:
 *          type: number
 *        required: true
 *        description: ID of the cab to update
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          properties:
 *            regNumber:
 *              type: string
 *            capacity:
 *              type: number
 *            model:
 *              type: string
 *    responses:
 *      200:
 *        description: details of cab updated are returned
 *      404:
 *        cab not found
 *      400:
 *        Id should be a valid integer
 *        inputErrors
 */
cabsRouter.put(
  '/cabs/:id',
  GeneralValidator.validateIdParam,
  CabsValidator.validateCabUpdateBody,
  CabsController.updateCabDetails
);


/**
 * @swagger
 * /cabs/{id}:
 *  delete:
 *    summary: delete a specific cab
 *    tags:
 *      - Cabs
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: id of cab to be deleted
 *        type: number
 *    responses:
 *      200:
 *        description: Cab successfully deleted
 *      404:
 *        description: Cab does not exist
 */

cabsRouter.delete(
  '/cabs/:id',
  CabsValidator.validateDeleteCabIdParam,
  CabsController.deleteCab
);

export default cabsRouter;
