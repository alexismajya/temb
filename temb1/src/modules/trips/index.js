import { Router } from 'express';
import middlewares from '../../middlewares';
import TripsController from './TripsController';
import HomeBaseFilterValidator from '../../middlewares/HomeBaseFilterValidator';


const { TripValidator, GeneralValidator, } = middlewares;

const tripsRouter = Router();
/**
 * @swagger
 * /trips:
 *  get:
 *    summary: fetch all trips
 *    tags:
 *      - Trips
 *    parameters:
 *      - name: homebaseid
 *        type: number
 *        required: true
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
 *      - name: status
 *        in: query
 *        required: false
 *        description: trip status
 *        type: string
 *      - name: searchterm
 *        in: query
 *        required: false
 *        description: filters trips by requester, rider, origin and destination
 *        type: string
 *    responses:
 *      200:
 *        description: response object containing all trips from the database
 */
tripsRouter.get(
  '/trips',
  TripValidator.validateGetTripsParam,
  HomeBaseFilterValidator.validateHomeBaseAccess,
  TripsController.getTrips
);

/**
 * @swagger
 * /trips/{tripId}:
 *  put:
 *    summary: updates trip status
 *    tags:
 *      - Trips
 *    parameters:
 *      - name: tripId
 *        in: path
 *        required: true
 *        description: id of trip to be updated
 *        type: number
 *      - name: action
 *        in: query
 *        required: true
 *        type: string
 *        enum:
 *          - "confirm"
 *          - "decline"
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - slackUrl
 *            - comment
 *          properties:
 *            slackUrl:
 *              type: string
 *              example: andela-tembea.slack.com
 *            comment:
 *              type: string
 *            providerId:
 *              type: number
 *              description: This is required when "action" is "confirm"
 *    responses:
 *      200:
 *        description: trip confirmed or trip declined
 */
tripsRouter.put(
  '/trips/:tripId',
  TripValidator.validateAll,
  TripsController.updateTrip
);

/**
 * @swagger
 * /trips/travel:
 *  post:
 *    summary: fetch travel trips for specified period by department
 *    tags:
 *      - Trips
 *    parameters:
 *      - name: homebaseid
 *        type: number
 *        required: true
 *        in: header
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - startDate
 *            - endDate
 *          properties:
 *            startDate:
 *              type: string
 *            endDate:
 *              type: string
 *            departmentList:
 *              description: array of departments
 *              type: array
 *              items:
 *                type: string
 *    responses:
 *      200:
 *        description: travel trips fetched successfully
 *      400:
 *        description: bad format  request body parameters
 */
tripsRouter.post(
  '/trips/travel',
  HomeBaseFilterValidator.validateHomeBaseAccess,
  TripValidator.validateTravelTrip,
  TripsController.getTravelTrips
);

/**
 * @swagger
 * /trips/routetrips:
 *  get:
 *    summary: fetch route trips
 *    tags:
 *      - Trips
 *    parameters:
 *      - name: homebaseid
 *        type: number
 *        in: header
 *        required: true
 *      - name: page
 *        in: query
 *        required: false
 *        type: number
 *      - name: size
 *        in: query
 *        required: false
 *        type: number
 *    responses:
 *      200:
 *        description: route trips fetched successfully
 *      400:
 *        description: bad request
 */
tripsRouter.get(
  '/trips/routetrips',
  HomeBaseFilterValidator.validateHomeBaseAccess,
  GeneralValidator.validateQueryParams,
  TripsController.getRouteTrips
);

export default tripsRouter;
