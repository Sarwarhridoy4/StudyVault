/**
 * Error for cloudinary upload failures
 */
export default class CloudinaryError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string = 'Image upload failed') {
    super(message);
    this.statusCode = 500;
    this.status = 'error';
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
