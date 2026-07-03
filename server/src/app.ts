import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';

import './models/brand.model';
import './models/category.model';
export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
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
