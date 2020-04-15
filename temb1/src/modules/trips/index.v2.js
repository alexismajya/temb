import { Router } from 'express';
import middlewares from '../../middlewares';
import TripsController from './TripsController';
import HomeBaseFilterValidator from '../../middlewares/HomeBaseFilterValidator';
import mainValidator from '../../middlewares/mainValidor';
import { confirmTripSchema } from './schemas';


const { TokenValidator, GeneralValidator, } = middlewares;

const tripsV2Router = Router();

tripsV2Router.use('/trips',
  TokenValidator.attachJwtSecretKey.bind(TokenValidator),
  TokenValidator.authenticateToken.bind(TokenValidator));


/**
 * @swagger
 * /trips/routetrips:
 *  get:
 *    summary: fetch route trips for a specified period
 *    tags:
 *      - Trips
 *    parameters:
 *      - name: page
 *        in: query
 *        required: false
 *      - name: size
 *        in: query
 *        required: false
 *    responses:
 *      200:
 *        description: route trips fetched successfully
 *      400:
 *        description: bad request
 */
tripsV2Router.get(
  '/trips/routetrips',
  HomeBaseFilterValidator.validateHomeBaseAccess,
  GeneralValidator.validateQueryParams,
  TripsController.getRouteTrips
);


/**
 * @swagger
 * /providers/confirm:
 *  post:
 *    summary: provider confirms by assigning a driver and a cab to a trip
 *    tags:
 *      - Providers
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - providerId
 *            - teamid
 *            - tripId
 *            - driverName
 *            - driverPhoneNo
 *            - vehicleModel
 *            - vehicleRegNo
 *          properties:
 *            providerId:
 *              type: integer
 *            tripId :
 *              type: integer
 *            driverName :
 *              type: string
 *            driverPhoneNo :
 *              type: string
 *            vehicleModel :
 *              type: string
 *            vehicleRegNo :
 *              type: string
 *    responses:
 *      201:
 *        description: Confirmation received
 */
tripsV2Router.post(
  '/providers/confirm', mainValidator(confirmTripSchema),
  TripsController.providerConfirm
);

export default tripsV2Router;
