import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(401).json({ error: 'Access denied. Please log in.' });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(403).json({ error: 'Invalid token' });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
}

export default authenticateToken;
