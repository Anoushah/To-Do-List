import { Request, Response, NextFunction } from 'express';
import logger from '../../logger';

function logRequestResponse(req: Request, res: Response, next: NextFunction): void {
  const { method, originalUrl, body } = req;

  logger.info(`[${method}] ${originalUrl}`);
  logger.info(`Request Body: ${JSON.stringify(body)}`);

  const originalSend = res.send;

  res.send = function (body: any): Response {
    originalSend.call(res, body); 
    logger.info(`Response Body: ${JSON.stringify(body)}`);
    return res; 
  };

  next();
}

export default logRequestResponse;
