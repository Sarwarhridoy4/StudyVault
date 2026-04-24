import multer from 'multer';
import type { Request } from 'express';

// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// File size limit (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Storage configuration - store in memory for Cloudinary upload
const storage = multer.memoryStorage();

// Multer upload configuration
export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (req: Request, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`));
    }
    cb(null, true);
  },
});

// Type guard for uploaded file
export interface MulterFile extends Express.Multer.File {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

// Helper to extract single image file from request
export const uploadSingleImage = upload.single('image');

// Middleware wrapper to handle multer errors properly
export const handleUploadError = (err: Error, _req: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 5MB allowed.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only 1 image allowed.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Use "image" field name.',
      });
    }
  }

  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Pass to global error handler
  next(err);
};
