import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export function isAuthorized(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Unauthorized: Missing or invalid token',
      data: null
    });
  }

  const accessToken = (authHeader as string).split(' ')[1];
  const secretKey = config.secret || process.env.SECRET || 'secret';

  jwt.verify(accessToken, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Unauthorized: Invalid or expired token',
        data: null
      });
    }

    req.user = decoded;
    next();
  });
}

export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user as jwt.JwtPayload).role !== 'admin') {
    res.status(403).json({
      success: false,
      statusCode: 403,
      message: 'Forbidden: Access denied',
      data: null
    });
  }
  next();
}
