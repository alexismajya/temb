// idea was borrowed from https://github.com/jhipster/jhipster-sample-app-noi18n/blob/master/src/test/javascript/spec/helpers/spyobject.ts
var SpyObject = /** @class */ (function () {
    function SpyObject(type) {
        if (type === void 0) { type = null; }
        var _this = this;
        if (type) {
            Object.keys(type.prototype).forEach(function (prop) {
                var m = null;
                try {
                    m = type.prototype[prop];
                }
                catch (e) {
                    // As we are creating spys for abstract classes,
                    // these classes might have getters that throw when they are accessed.
                    // As we are only auto creating spys for methods, this
                    // should not matter.
                }
                if (typeof m === 'function' && !_this[prop]) {
                    // @ts-ignore
                    var spyInstance = jest.spyOn(type.prototype, prop);
                    spyInstance.mockReturnValue({});
                    _this[prop] = type.prototype[prop];
                }
            });
        }
    }
    return SpyObject;
}());
export { SpyObject };
//# sourceMappingURL=SpyObject.js.map