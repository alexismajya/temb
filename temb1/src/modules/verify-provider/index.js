import express from 'express';
import ProviderController from '../providers/ProviderController';

const app = express.Router();

/**
 * send an email verification to check if exist
 */

/**
 * @swagger
 * /providers/verify:
 *  post:
 *    summary: verify a provider
 *    tags:
 *      - Providers
 *    responses:
 *      200:
 *        description: user created successfully or user already exists
 *      400:
 *        description: errors in request body object
*/

app.post('/providers/verify',
  ProviderController.activateProvider);


export default app;
