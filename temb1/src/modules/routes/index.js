import express from 'express';
import RoutesController from './RouteController';
import RoutesUsageController from './RouteUsageController';
import middlewares from '../../middlewares';
import validationSchemas from '../../middlewares/ValidationSchemas';


const {
  GeneralValidator, RouteValidator, RouteRequestValidator, mainValidator,
} = middlewares;
const routesRouter = express.Router();

/**
 * @swagger
 * /routes:
 *  get:
 *    summary: Gets all available route batches from the database
 *    tags:
 *      - Routes
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
 *      - name: id
 *        in: query
 *        required: false
 *        type: number
 *      - name: providerId
 *        in: query
 *        required: false
 *        type: number
 *      - name: sort
 *        in: query
 *        required: false
 *        type: string
 *      - name: status
 *        in: query
 *        required: false
 *        type: string
 *      - name: name
 *        in: query
 *        required: false
 *        type: string
 *      - name: country
 *        in: query
 *        required: false
 *        type: string
 *      - name: onRoute
 *        in: query
 *        required: false
 *        type: boolean
 *    responses:
 *      200:
 *        description: returns response object containing all available routes
 */
routesRouter.get(
  '/routes',
  GeneralValidator.validateQueryParams,
  RoutesController.getRoutes
);

/**
 * @swagger
 * /routes/ratings:
 *  get:
 *    summary: get all ratings for route batches
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: from
 *        in: path
 *        required: false
 *        type: date
 *        description: start date to filter by
 *      - name: to
 *        in: path
 *        required: false
 *        type: date
 *        description: end date to filter by
 *    responses:
 *      200:
 *        description: response object with all ratings for a routes and associated batch
 */

routesRouter.get(
  '/routes/ratings',
  RouteRequestValidator.validateRatingsStartEndDateAndLocalCountry,
  RoutesUsageController.getRouteRatings
);

/**
 * @swagger
 * /routes:
 *  post:
 *    summary: create routes
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: action
 *        in: query
 *        required: false
 *        description: optional parameter used for duplicating a route
 *        type: string
 *      - name: batchId
 *        in: query
 *        required: false
 *        description: id of route to be duplicated
 *        type: number
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - routeName
 *            - destination
 *            - vehicle
 *            - takeOffTime
 *            - capacity
 *          properties:
 *            routeName:
 *              type: string
 *            vehicle:
 *              type: string
 *              description: vehicle registration number
 *            takeOffTime:
 *              type: string
 *              example: "10:00"
 *            capacity:
 *              type: number
 *              example: 7
 *            destination:
 *              type: object
 *              example: { "address": "Abia!", "coordinates": { "lng": 7, "lat": 11 } }
 *    responses:
 *      200:
 *        description: route batch created successfully
 *      400:
 *        description: input contains errors
 */
routesRouter.post(
  '/routes',
  RouteValidator.validateNewRoute,
  RoutesController.createRoute
);

/**
 * @swagger
 * /routes/{routeId}:
 *  put:
 *    summary: update route batch details
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: routeId
 *        in: path
 *        description: id of the route batch to be updated
 *        required: true
 *        type: number
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - teamUrl
 *          properties:
 *            teamUrl:
 *              type: string
 *              example: example.slack.com
 *              description: team slack workspace URL
 *            status:
 *              example: "Active"
 *              type: string
 *              enum:
 *                - Inactive
 *                - Active
 *            batch:
 *              type: string
 *            capacity:
 *              type: number
 *              example: 8
 *              description: route capacity **(must be greater than 0)**
 *            takeOff:
 *              type: string
 *              description: time for takeoff **(24H format)**
 *              example: "10:00"
 *            regNumber:
 *              type: string
 *              description: vehicle registration number
 *            name:
 *              type: string
 *              description: route name
 *    responses:
 *      200:
 *        description: route batch successfully updated
 *      400:
 *        description: request object contains errors
 */
routesRouter.put(
  '/routes/:routeId',
  RouteValidator.validateRouteIdParam,
  RouteValidator.validateRouteUpdate,
  RouteValidator.validateRouteBatchUpdateFields,
  RoutesController.updateRouteBatch
);

/**
 * @swagger
 * /routes/requests:
 *  get:
 *    summary: get all confirmed route requests
 *    tags:
 *      - Routes
 *    responses:
 *      200:
 *        description: response object containing confirmed route requests
 */
routesRouter.get('/routes/requests',
  RoutesController.getAll);

/**
 * @swagger
 * /routes/requests/{requestId}/status:
 *  put:
 *    summary: decline/approve a route request
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: requestId
 *        in: path
 *        required: true
 *        description: id of request to be updated
 *        type: number
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - teamUrl
 *            - newOpsStatus
 *            - comment
 *            - routeName
 *            - takeOff
 *            - cabRegNumber
 *            - provider
 *          properties:
 *            teamUrl:
 *              type: string
 *              example: andela-tembea.slack.com
 *            newOpsStatus:
 *              type: string
 *              description: can be either of **approve** or **decline**
 *              example: approve
 *              enum:
 *                - approve
 *                - decline
 *            comment:
 *              type: string
 *            routeName:
 *              type: string
 *              description: this is **required** if route is to be approved
 *            takeOff:
 *              type: string
 *              example: "10:00"
 *            provider:
 *              type: object
 *              example: { "id": 1, "name": "Uber Kenya", "providerUserId": 1, "user": { "name": "New Name", "phoneNo": "2349782037189", "email": "me.you@test.com" } }
 *    responses:
 *      200:
 *        description: route request status updated successfully
 *      400:
 *        description: errors in the request object
 *      401:
 *        description: not authenticated
 *      403:
 *        description: route request needs to be confirmed by manager first
 *      409:
 *        description: route request has already been approved
 */
routesRouter.put(
  '/routes/requests/:requestId/status',
  RouteRequestValidator.validateRequestBody,
  RouteRequestValidator.validateParams,
  RoutesController.updateRouteRequestStatus
);

/**
 * @swagger
 * /routes/{routeBatchId}:
 *  delete:
 *    summary: delete specific route batch
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: routeBatchId
 *        in: path
 *        required: true
 *        description: id of route batch to be deleted
 *        type: number
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - teamUrl
 *          properties:
 *            teamUrl:
 *              type: string
 *              description: team slack workspace url
 *              example: andela-tembea.slack.com
 *    responses:
 *      200:
 *        description: route batch deletion successful
 *      400:
 *        description: errors in the request body object
 *      404:
 *        description: route batch not found
 */
routesRouter.delete(
  '/routes/:routeBatchId',
  RouteValidator.validateDelete,
  RouteValidator.validateRouteIdParam,
  RoutesController.deleteRouteBatch
);

/**
 * @swagger
 * /routes/{id}:
 *  get:
 *    summary: get a specic route's details
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: the id to the desired route
 *    responses:
 *      200:
 *        description: response object contains a Route's Details
 *      400:
 *        description: invalid id parameter
 *      404:
 *        description: no route associated to the id parameter passed
 */
routesRouter.get(
  '/routes/:id',
  GeneralValidator.validateIdParam,
  RoutesController.getOne
);

/**
 * @swagger
 * /routes/fellows/{userId}:
 *  delete:
 *    summary: delete fellow from specific route batch
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: id of route fellow to be deleted
 *        type: number
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - teamUrl
 *          properties:
 *            teamUrl:
 *              type: string
 *    responses:
 *      200:
 *        description: fellow removed from route successfully
 *      404:
 *        description: fellow not found
 */
routesRouter.delete(
  '/routes/fellows/:userId',
  RouteValidator.validateDelete,
  RouteValidator.validateRouteIdParam,
  RoutesController.deleteFellowFromRoute
);

/**
 * @swagger
 * /routes/status/usage:
 *  get:
 *    summary: Get the most and least used route batches
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: from
 *        in: path
 *        required: false
 *        description: the start date of the range you want to get records for. e.g 2019-05-08
 *        type: date
 *      - name: to
 *        in: path
 *        required: false
 *        description: the end date of the range you want to get records for e.g 2019-05-08
 *        type: date
 *    responses:
 *      200:
 *        description: Percentage Usage Generated
 */
routesRouter.get(
  '/routes/status/usage',
  mainValidator(validationSchemas.routeRequestUsage),
  RoutesUsageController.getRouteUsage
);

/**
 * @swagger
 * /routes/ratings:
 *  get:
 *    summary: Get the most and least used route batches
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: homebasid
 *        in: header
 *        required: true
 *      - name: from
 *        in: query
 *        type: date
 *        description: the start date of the range you want to get records for e.g 2019-05-08
 *      - name: to
 *        in: query
 *        required: false
 *        description: the end date of the range you want to get records for e.g 2019-05-08
 *        type: date
 *    responses:
 *      200:
 *        description: Percentage Usage Generated
 */
routesRouter.get(
  '/routes/ratings',
  RoutesUsageController.getRouteRatings
);
/**
 * @swagger
 * /routes/status/usage:
 *  get:
 *    summary: Get the most and least used route batches
 *    tags:
 *      - Routes
 *    parameters:
 *      - name: from
 *        in: path
 *        required: false
 *        description: the start date of the range you want to get records for. e.g 2019-05-08
 *        type: date
 *      - name: to
 *        in: path
 *        required: false
 *        description: the end date of the range you want to get records for e.g 2019-05-08
 *        type: date
 *    responses:
 *      200:
 *        description: Percentage Usage Generated
 */
routesRouter.get(
  '/routes/statistics/riders',
  GeneralValidator.validateHomebaseId, RouteValidator.validateDateInputForRouteRiderStatistics,
  RoutesController.getRouteStatistics
);

export default routesRouter;
