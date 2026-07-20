import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';

export function createApp() {
  const app = express();
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'HOC Perfume API running' });
  });

  app.use('/api', routes);
  setupSwagger(app);
  app.use(errorHandler);
  return app;
}

// FIXED: export app instance để index.ts có thể import { app }
export const app = createApp();