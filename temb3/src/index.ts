import debug from 'debug';
import http from 'http';
import app from './app';
import env from './config/environment';

const logger = debug('log');
const server = http.createServer(app);

server.listen(env.PORT, async () => {
  logger(`Find me on http://localhost:${env.PORT}`);
});
