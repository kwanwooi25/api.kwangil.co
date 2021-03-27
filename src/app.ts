import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { port } from '~config';
import { logger } from '~logger';
import { getRoutes } from '~modules';
import { injectSeedData } from '~prisma';

(async function () {
  const app = express();

  app.get('/status', (req, res) => res.status(200).end());
  app.head('/status', (req, res) => res.status(200).end());

  // https://expressjs.com/ko/guide/behind-proxies.html
  app.enable('trust proxy');

  // enable cross origin resource sharing
  app.use(cors());

  // parse application/json
  app.use(bodyParser.json({ limit: '50mb' }));

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // load routes
  app.use('/', getRoutes());

  const server = app.listen(port, async () => {
    await injectSeedData();
    logger.info('>> App is running on port: %o', port);
  });
  server.on('error', logger.error);
})();
