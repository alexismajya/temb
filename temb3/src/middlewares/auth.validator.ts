import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import redis from '../cache/redis-cache';
import ErrorHandler from '../helpers/error-handler';
import ResponseHandler from '../helpers/response-helper';

class AuthValidator {
  static async authenticateClient(req: Request, res: Response, next: NextFunction) {
    const { 'client-id': clientId, 'client-secret': clientSecret } = req.headers;
    if (!clientId || !clientSecret) {
      const message = 'Please Provide client-id and client-secret';
      return ErrorHandler.handleError(message, 401, res);
    }
    const client = await redis.fetchObject(clientId.toString());
    const authenticated = clientSecret === client.clientSecret;
    if (!authenticated) {
      const message = 'Unknown client';
      return ErrorHandler.handleError(message, 401, res);
    }
    next();
  }

  static async authenticateToken(req: Request, res: Response, next: NextFunction) {
    const tokenString: string = req.headers.authorization;
    const token = tokenString.split(' ')[1];
    if (!token) {
      const message = 'No token provided';
      return ResponseHandler.sendResponse(res, 401, false, message);
    }

    try {
      const secret = Buffer.from(process.env.AIS_PUBLIC_KEY, 'base64').toString('ascii');
      await jwt.verify(token, secret);
      next();
    } catch (error) {
      const errorMessage = 'Failed to authenticate token! Valid token required';
      return ResponseHandler.sendResponse(res, 401, false, errorMessage);
    }
  }
}

export default AuthValidator;
