import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';

export function createApp() {
  const app = express();
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors({
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));
  app.use(express.json({ limit: '100kb' }));
  app.get('/', (_, res) => {
  res.json({
    status: 'ok',
    message: 'HOC Perfume API running'
  });
});
  app.use('/api', routes);
  setupSwagger(app);
  app.use(errorHandler);
  return app;
  
}
