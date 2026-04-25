import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler';
import { globalRateLimiter, authRateLimiter, itemRateLimiter } from './middlewares/rateLimiter';
import { sanitizeBody } from './middlewares/sanitize';
import { logger, loggerStream } from './utils/logger';
import { sessionMiddleware } from './config/session';
import publicRouter from './modules/public/public.route';
import courseRouter from './modules/course/course.route';
import moduleRouter from './modules/module/module.route';
import adminRouter from './modules/admin/admin.route';
import authRouter from './modules/user/user.route';

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

// Session middleware (must come before routes that use req.session)
app.use(sessionMiddleware);

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
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/modules', moduleRouter);
app.use('/api/v1/admin', adminRouter);

// Auth routes
app.use('/api/v1/auth', authRouter);

// Error handling (should be last)
app.use(errorHandler);

export default app;
