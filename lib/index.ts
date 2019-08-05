import express from 'express';
import mongoose from 'mongoose';
import Config from './config';

// Import Routes
import routeAuth from './routes/auth';
import { rejects } from 'assert';

;(async () => {
  // Read config
  console.debug('read config...');
  let config: Config;
  try {
    config = await Config.init('./config.json');
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
  
  // Create instance
  const app = express();

  // Connect MongoDB
  const mongoCallback = () => {
    console.debug('connected to db!');
  };
  mongoose.connect(config.buildMongoUrl(), { useNewUrlParser: true }, mongoCallback);

  // Middleware
  app.use(express.json());

  // Routes Middleware
  app.use('/api/user', routeAuth);

  app.listen(config.config.port, () => console.log('Server Up and running'));

})();
