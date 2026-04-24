import type { Request, Response, NextFunction } from 'express';

const rbac = (req: Request, res: Response, next: NextFunction) => {
  // Implement RBAC logic here
  next();
};

export default rbac;
