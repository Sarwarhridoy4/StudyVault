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

app.get('/health', (_req, res) => res.send('OK'));

// API Routes
app.use('/api/v1/studies', studyRouter);

app.use(errorHandler);

export default app;
