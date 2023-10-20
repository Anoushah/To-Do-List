import { Request, Response, NextFunction } from 'express';

class CustomErrorType extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomErrorType';
  }
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof CustomErrorType) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
}

export default errorHandler;
