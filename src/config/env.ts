const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/studyvault',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  // Firebase Admin SDK credentials
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
  // Session secret for cookie-based auth
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-key-change-in-production',
  SESSION_MAX_AGE: parseInt(process.env.SESSION_MAX_AGE || '604800000', 10),
  // Email configuration (Nodemailer)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.example.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
  EMAIL_USER: process.env.EMAIL_USER || 'noreply@example.com',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'StudyVault <noreply@example.com>',
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  // Admin credentials for seeding
  ADMIN_UID: process.env.ADMIN_UID || 'admin_001',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@studyvault.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'ChangeMe123!@#',
  ADMIN_DISPLAY_NAME: process.env.ADMIN_DISPLAY_NAME || 'Admin User',
  ADMIN_PHOTO_URL: process.env.ADMIN_PHOTO_URL || '',
  
  // Frontend URL for reset link
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export default env;
