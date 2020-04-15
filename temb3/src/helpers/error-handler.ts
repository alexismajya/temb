import { Response } from 'express';
class Error {
  static handleError(message: string, statusCode: number, response: Response, error?: object ) {
    return response.status(statusCode).json({
      success: false,
      message,
      error,
    });
  }
}

export default Error;
