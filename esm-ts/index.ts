import config from './src/config/index.js';
import Server from './src/Server.js';
import { ServerOptions } from './src/types/index.js';

const options: ServerOptions = {
  port: config.port,
  database_url: config.database_url,
  env: config.env,
  server_url: config.server_url
};

const app = new Server(options);

void app.startServer().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
