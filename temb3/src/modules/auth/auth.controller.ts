import { Request, Response} from 'express';
import Redis from 'ioredis';
import uuid from 'uuid/v4';
import redis from '../../cache/redis-cache';
import ResponseHandler from '../../helpers/response-helper';
import { IClientData } from '../../interfaces/schedul-request.interface';

class AuthController {
  /**
   * @description Generate a uniquie client secret for client registering with tembea
   * @param {object} req The http request object
   * @param {object} res The http response object
   * @returns {object} The http response object
   */
    static async generateSecretKey(req: Request, res: Response) {
        const clientId: Redis.KeyType = req.headers.client_id.toString();
        const secretKey: string = uuid();
        const clientSecret: string = await AuthController.addClient(clientId, secretKey);
        const message = 'Client Secret Succesfully generated';
        ResponseHandler.sendResponse(res, 201, true, message, {clientSecret});

    }

  /**
   * @description Add new client secret key or get existing secret key
   * @param {Redis.KeyType} clientId The client id to register
   * @param {string} secretKey The secret key to register
   * @returns {string} The client secret key
   */
    static async addClient(clientId: string, clientSecret: string): Promise<string> {
        let secretId: string;
        const client: IClientData = await redis.fetchObject(clientId);
        if (!client) {
            redis.saveObject(clientId, { clientId, clientSecret });
            secretId = clientSecret;
        }
        secretId = client.clientSecret;
        return secretId;
    }
}

export default AuthController;
