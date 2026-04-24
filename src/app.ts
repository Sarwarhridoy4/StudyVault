import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler';
import auth from './middlewares/auth';
import rbac from './middlewares/rbac';
import studyRouter from './modules/study/study.route';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(auth);
app.use(rbac);

// Health check endpoint with system info
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

app.use(errorHandler);

export default app;
