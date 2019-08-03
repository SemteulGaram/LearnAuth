import fs from 'fs';

class Config {
  static DEFAULT_CONFIG: string;
  path: string;
  config: {
    mongoHost: string,
    mongoUser: string,
    mongoPassword: string,
    mongoDb: string,
    port: number
  };

  constructor (path: string) {
    this.path = path;
    this.config = {
      mongoHost: '',
      mongoUser: '',
      mongoPassword: '',
      mongoDb: '',
      port: 0
    };
  }

  async init() {
   this.config = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
  }

  async createConfig() {
    return await fs.promises.writeFile(this.path, Config.DEFAULT_CONFIG, 'utf-8');
  }
}
Config.DEFAULT_CONFIG = `{
  "mongoHost": "localhost:27017",
  "mongoUser": "",
  "mongoPassword": "",
  "mongoDb": "",
  "port": 3000
}`;

export default Config;
