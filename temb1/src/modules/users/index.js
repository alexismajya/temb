import express from 'express';
import UsersController from './UsersController';
import middlewares from '../../middlewares';

const { UserValidator, GeneralValidator } = middlewares;
const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *  put:
 *    summary: updates the user record
 *    tags:
 *      - Users
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - slackUrl
 *            - email
 *          properties:
 *            slackUrl:
 *              type: string
 *              example: andela-tembea.slack.com
 *            email:
 *              type: string
 *              description: email of user record to be updated
 *            newEmail:
 *              type: string
 *            newName:
 *              type: string
 *            newPhoneNo:
 *              type: string
 *              example: "02830294830"
 *    responses:
 *      200:
 *        description: user record updated successfully
 *      400:
 *        decription: some details are missing in the request body/details provided contain errors
 */
userRouter.put(
  '/users',
  UserValidator.validateUpdateBody,
  UsersController.updateRecord
);

/**
 * @swagger
 * /users:
 *  post:
 *    summary: creates new user record
 *    tags:
 *      - Users
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - slackUrl
 *            - email
 *          properties:
 *            slackUrl:
 *              type: string
 *              example: "andela-tembea.slack.com"
 *            email:
 *              type: string
 *              example: "first.last@domain.com"
 *    responses:
 *      200:
 *        description: user created successfully or user already exists
 *      400:
 *        description: errors in request body object
 */
userRouter.post(
  '/users',
  UserValidator.validateNewBody,
  UsersController.newUserRecord
);

/**
 * @swagger
 * /users:
 *  get:
 *    summary: read user records
 *    tags:
 *      - Users
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
 *        description: response object containing all users on the db
 *      401:
 *        description: not authenticated
 *      404:
 *        description: no records found
 */
userRouter.get(
  '/users',
  GeneralValidator.validateQueryParams,
  UsersController.readRecords
);

/**
 * @swagger
 * /users:
 *  delete:
 *    summary: delete the user
 *    tags:
 *      - Users
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - email
 *          properties:
 *            email:
 *              type: string
 *              description: email of user record to be deleted
 *    responses:
 *      200:
 *        description: user deleted successfully
 *      400:
 *        decription: some details are missing in the request body/details provided contain errors
 */
userRouter.delete(
  '/users/:email',
  UserValidator.validateDeleteUser,
  UsersController.deleteRecord
);

export default userRouter;
