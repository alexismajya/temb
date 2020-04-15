"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Io {
    emit(event, ...args) {
        this.events[event].foreach((func) => func(...args));
    }
    connect() {
        return {
            on: (event, func) => {
                if (this.events[event]) {
                    return this.events[event].push(func);
                }
                this.events[event] = [func];
            },
            emit: this.emit,
        };
    }
}
exports.default = new Io();
//# sourceMappingURL=socket.ioMock.js.map