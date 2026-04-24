import session from 'express-session';
import createMongoStore from 'connect-mongodb-session';
import env from './env';

const MongoStore = createMongoStore(session);

export const sessionMiddleware = session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: false,
  cookie: {
    maxAge: env.SESSION_MAX_AGE,
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },
  store: new MongoStore({
    uri: env.MONGO_URI,
    collection: 'sessions',
    ttl: env.SESSION_MAX_AGE / 1000,
    autoRemove: 'native',
  } as any), // Cast to any to bypass type definitions mismatch in @types/connect-mongodb-session
});
