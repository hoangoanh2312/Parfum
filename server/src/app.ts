import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';
import { mongoSanitize } from './middlewares/sanitize.middleware';

export function createApp() {
  const app = express();
  const isAllowedOrigin = (origin: string) => {
    if (env.allowedOrigins.includes(origin)) return true;
    if (env.nodeEnv !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return true;
    }
    return false;
  };

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
          connectSrc: ["'self'", 'https:'],
          fontSrc: ["'self'", 'https:', 'data:'],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || isAllowedOrigin(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }),
  );
  app.use(
    express.json({
      limit: '100kb',
      verify(req, _res, buffer) {
        (req as any).rawBody = Buffer.from(buffer);
      },
    }),
  );
  app.use(mongoSanitize);
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
  app.get('/', (_, res) => {
    res.json({
      status: 'ok',
      message: 'HOC Perfume API running',
    });
  });
  app.use('/api', routes);
  setupSwagger(app);
  app.use(errorHandler);
  return app;
}

// FIXED: export app instance để index.ts có thể import { app }
export const app = createApp();
