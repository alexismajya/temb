import debug from 'debug';
import http from 'http';
import socketIo from 'socket.io';
import environment from './config/environment';
import app from './app';
import startUpHelper from './scripts/startUpHelper';
import initializeEvents from './helpers/eventListeners';

const logger = debug('log');
const server = http.createServer(app);

export const io = socketIo(server);

// create super admin method
startUpHelper.ensureSuperAdminExists();
startUpHelper.registerEventHandlers();
if (environment.NODE_ENV !== 'test') {
  server.listen(environment.PORT, async () => {
    app.set('host', `http://localhost:${environment.PORT}`);

    logger(`Find me on http://localhost:${environment.PORT}`);

    initializeEvents();
  });
}
