import type { Request, Response, NextFunction } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
  // Firebase Auth verification would happen here
  next();
};

export default auth;
