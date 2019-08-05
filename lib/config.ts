import fs from 'fs';

class Config {
  static DEFAULT_CONFIG: string;
  path: string;
  config: {
    mongoHost: string,
    mongoUser: string,
    mongoPassword: string,
    mongoDb: string,
    mongoUseSrv: boolean,
    port: number
  };

  constructor () {
    throw new Error('Use Config.init(path: string) instead');
  }

  static async init(path: string): Promise<Config> {
    const obj: Config = Object.create(Config.prototype);
    obj.path = path;
    try {
      obj.config = JSON.parse(await fs.promises.readFile(obj.path, 'utf-8'));
      return obj;
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.debug('Config file not found. creating...');
        await obj._createConfig();
        console.info('Config file created. please edit config.json and restart server');
        process.exit(0);
      }
      throw err;
    }
  }

  async _createConfig() {
    return await fs.promises.writeFile(this.path, Config.DEFAULT_CONFIG, 'utf-8');
  }

  buildMongoUrl(): string {
    return 'mongodb'
      + (this.config['mongoUseSrv'] ? '+srv' : '')
      + '://' + ((this.config['mongoUser'] && this.config['mongoPassword']) 
        ? this.config['mongoUser'] + ':' + this.config['mongoPassword'] + '@' : '')
      + this.config['mongoHost'] + '/' + this.config['mongoDb'];
  }
}
Config.DEFAULT_CONFIG = `{
  "mongoHost": "localhost:27017",
  "mongoUser": "",
  "mongoPassword": "",
  "mongoDb": "",
  "mongoUseSrv": false,
  "port": 3000
}`;

export default Config;
