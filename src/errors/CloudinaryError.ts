import AppError from '../utils/AppError';

/**
 * Error for cloudinary upload failures
 */
export default class CloudinaryError extends AppError {
  constructor(message: string = 'Image upload failed') {
    super(message, 500);
  }
}
