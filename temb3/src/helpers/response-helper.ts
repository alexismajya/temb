import { Response } from 'express';
export default class ResponseHandler {
    static sendResponse(res: Response, code: number, success: boolean, message: string, data?: object) {
      return res.status(code).json({
        success,
        message,
        data,
      });
    }
  }
