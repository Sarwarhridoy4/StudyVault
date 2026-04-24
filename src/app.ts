import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler';
import { globalRateLimiter, authRateLimiter, itemRateLimiter } from './middlewares/rateLimiter';
import { sanitizeBody } from './middlewares/sanitize';
import { logger, loggerStream } from './utils/logger';
import publicRouter from './modules/public/public.route';
import studyRouter from './modules/study/study.route';
import itemRouter from './modules/item/item.route';
import adminRouter from './modules/admin/admin.route';
import uploadRouter from './modules/upload/upload.route';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    },
  },
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate limiting (global)
app.use(globalRateLimiter);

// Strict rate limiting for auth endpoints
app.use('/api/v1/auth', authRateLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging with Winston
app.use(morgan('combined', {
  stream: loggerStream,
}));

// Public routes (landing page and about)
app.use('/', publicRouter);

// Health check (no rate limit)
app.get('/health', (_req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      memory: {
        used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
      },
      pid: process.pid,
    },
  };

  res.json(healthData);
});

// API Routes
app.use('/api/v1/studies', studyRouter);
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/admin', adminRouter);

// Upload routes (centralized file upload)
app.use('/api/v1/upload', uploadRouter);

// Auth routes (to be implemented)
// app.use('/api/v1/auth', authRouter);

// Error handling (should be last)
app.use(errorHandler);

export default app;
