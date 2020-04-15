var Io = /** @class */ (function () {
    function Io() {
    }
    Io.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.events[event].foreach(function (func) { return func.apply(void 0, args); });
    };
    Io.prototype.connect = function () {
        var _this = this;
        return {
            on: function (event, func) {
                if (_this.events[event]) {
                    return _this.events[event].push(func);
                }
                _this.events[event] = [func];
            },
            emit: this.emit,
        };
    };
    return Io;
}());
export default new Io();
//# sourceMappingURL=socket.ioMock.js.map