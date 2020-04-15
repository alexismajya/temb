import express from 'express';
import AuthenticationController from './AuthenticationController';
import middlewares from '../../middlewares';

export const authenticationRouter = express.Router();
const { TokenValidator } = middlewares;


export const authenticator = [
  TokenValidator.attachJwtSecretKey.bind(TokenValidator),
  TokenValidator.authenticateToken.bind(TokenValidator),
];

/**
 * @swagger
 * /auth/verify:
 *  get:
 *    summary: verify the user has a role on the application
 *    description: verify user role access to tembea with andela auth service token
 *    tags:
 *      - Auth
 *    parameters:
 *      - name: authorization
 *        in: header
 *        required: true
 *        description: Andela JWT
 *        type: string
 *    responses:
 *      200:
 *        description: response object containing user authorization details
 *      401:
 *        description: incorrect/no authorization token is provided
 */

authenticationRouter.get(
  '/auth/verify',
  ...authenticator,
  AuthenticationController.verifyUser
);
