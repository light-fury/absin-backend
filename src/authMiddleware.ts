// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include the apiKey
declare module 'express-serve-static-core' {
  interface Request {
    apiKey?: string;
  }
}

// Middleware to extract API key from the Authorization header
export const extractApiKey = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const [authType, apiKey] = authHeader.split(' ');

  if (authType !== 'Bearer' || !apiKey) {
    return res.status(401).json({ error: 'Invalid authorization format' });
  }

  req.apiKey = apiKey; // Attach the API key to the request object

  next();
};
