/**
 * Error for authentication failures
 */
export default class AuthError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string = 'Authentication failed') {
    super(message);
    this.statusCode = 401;
    this.status = 'fail';
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error for authorization failures (RBAC)
 */
export class AuthorizationError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.statusCode = 403;
    this.status = 'fail';
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
