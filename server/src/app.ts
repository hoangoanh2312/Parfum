import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.get('/', (_, res) => {
    res.json({
      status: 'ok',
      message: 'HOC Perfume API running',
    });
  });
  // PF-43: health check endpoint cho monitoring / deploy (uptime + timestamp)
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });
  app.use('/api', routes);
  setupSwagger(app);
  app.use(errorHandler);
  return app;
}
