import express from 'express';
import middleware from '../../middlewares';
import AuthController from './auth.controller';

const { AuthValidator } = middleware;

const AuthRouter = express.Router();

AuthRouter.get(
    '/auth/verify',
    AuthValidator.authenticateToken,
    AuthController.generateSecretKey,
);

export default AuthRouter;
