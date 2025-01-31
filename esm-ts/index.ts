import config from './src/config';
import Server from './src/Server';
import { ServerOptions } from './src/types';

const options: ServerOptions = {
  port: config.port,
  database_url: config.database_url,
  env: config.env,
  server_url: config.server_url
};

const app = new Server(options);

void app.startServer();
