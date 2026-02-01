import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  // Placeholder for real token validation logic
  if (token !== 'valid-token') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  next();
};
