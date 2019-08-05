import fs from 'fs';
import crypto from 'crypto';

export interface IConfig {
  mongoHost: string;
  mongoUser: string;
  mongoPassword: string;
  mongoDb: string;
  mongoUseSrv: boolean;
  port: number;
  jsonWebTokenSecreatKey: string;
}

export class Config {
  static DEFAULT_CONFIG: string;
  ready: boolean;
  path: string;
  private _v: IConfig; 

  constructor (path: string) {
    this.path = path;
    this._v = JSON.parse(Config.DEFAULT_CONFIG);
    this.ready = false;
  }

  async init(): Promise<Config> {
    try {
      this._v = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
      this.ready = true;
      return this;
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.debug('Config file not found. creating...');
        await this._createConfig();
        console.info('Config file created. please edit config.json and restart server');
        process.exit(0);
      }
      throw err;
    }
  }

  get(key: keyof IConfig): any {
    if (!this.ready) throw new Error('Config must initialize before use.');
    return this._v[key];
  }

  static _createRandomToken () {
    return crypto.randomBytes(8).toString('hex');
  }

  async _createConfig() {
    return await fs.promises.writeFile(this.path, Config.DEFAULT_CONFIG, 'utf-8');
  }

  buildMongoUrl(): string {
    return 'mongodb'
      + (this._v.mongoUseSrv ? '+srv' : '')
      + '://' + ((this._v.mongoUser && this._v.mongoPassword) 
        ? this._v.mongoUser + ':' + this._v.mongoPassword + '@' : '')
      + this._v.mongoHost + '/' + this._v.mongoDb;
  }
}
Config.DEFAULT_CONFIG = `{
  "mongoHost": "localhost:27017",
  "mongoUser": "",
  "mongoPassword": "",
  "mongoDb": "",
  "mongoUseSrv": false,
  "port": 3000,
  "jsonWebTokenSecreatKey": "${ Config._createRandomToken() }"
}`;

export const instance = new Config('./config.json');
