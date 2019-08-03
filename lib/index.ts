import express from 'express';
import mongoose from 'mongoose';
import Config from './config';

// Import Routes
import routeAuth from './routes/auth';

;(async () => {
  // Read config
  console.debug('read config...');
  const config = new Config('./config.json');
  try {
    await config.init();
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.debug('Config file not found. creating...');
      await config.createConfig();
      console.info('Config file created. please edit config.json and restart server');
      process.exit(0);
    }
  }
  
  // Create instance
  const app = express();

  const mongoCallback = () => {
    console.debug('connected to db!');
  };
  if (config.config['mongoUser'] && config.config['mongoPassword']) {
    console.debug('mongo auth info found. try mongodb+srv');
    mongoose.connect(`mongodb+srv://${ config.config['mongoUser'] }:${
      config.config['mongoPassword'] }${ config.config['mongoHost'] }/${
        config.config['mongoDb'] }`, { useNewUrlParser: true }, mongoCallback);
  } else {
    console.debug('mongo auth not found.');
    mongoose.connect(`mongodb://${ config.config['mongoHost'] }/${
      config.config['mongoDb'] }`, { useNewUrlParser: true }, mongoCallback);
  }

  // Routes Middleware
  app.use('/api/user', routeAuth);

  app.listen(config.config.port, () => console.log('Server Up and running'));

})();
