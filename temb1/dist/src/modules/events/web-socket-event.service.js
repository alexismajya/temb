"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
class WebSocketEvents {
    constructor(io = index_1.io) {
        this.io = io;
    }
    broadcast(name, data) {
        return this.io.emit(name, data);
    }
    subscribe(name, subscriber) {
        this.io.on('connection', (socket) => {
            socket.on(name, (data) => {
                return subscriber ? subscriber(data) : data;
            });
        });
    }
}
exports.default = WebSocketEvents;
//# sourceMappingURL=web-socket-event.service.js.map