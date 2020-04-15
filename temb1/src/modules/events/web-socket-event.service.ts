import { io as WebSocket } from '../../index';

export default class WebSocketEvents {

  constructor(private readonly io = WebSocket) {}

  broadcast(name: string, data:Object): SocketIO.Namespace {
    return this.io.emit(name, data);
  }
  subscribe(name: string, subscriber?: Function) {
    this.io.on('connection', (socket) => {
      socket.on(name, (data) => {
        return subscriber ? subscriber(data) : data;
      });
    });
  }
}
