var RenameRouteBatch = /** @class */ (function () {
    function RenameRouteBatch(routes, lastRoute) {
        this.renamedBatches = [];
        this.sameRoute = [];
        this.newCharArray = [];
        this.routesList = routes.slice();
        this.lastRoute = lastRoute;
    }
    RenameRouteBatch.prototype.nextLetter = function (letter) {
        return letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
    };
    RenameRouteBatch.prototype.incrementChar = function (batchString) {
        var lastChar = batchString[batchString.length - 1];
        var remString = batchString.slice(0, batchString.length - 1);
        var newChar = lastChar === undefined ? 'A' : this.nextLetter(lastChar);
        this.newCharArray.unshift(newChar);
        if (lastChar === 'Z') {
            return this.incrementChar(remString);
        }
        var newBatchString = remString + this.newCharArray.slice().join('');
        this.newCharArray = [];
        return newBatchString;
    };
    RenameRouteBatch.prototype.isSameBatch = function (sameBatch, routeBatch) {
        if (routeBatch && (sameBatch.name === routeBatch.name)) {
            return sameBatch.takeOff === routeBatch.takeOff;
        }
        return false;
    };
    RenameRouteBatch.prototype.updateBatches = function () {
        var _a;
        this.batchLetter = this.isSameBatch(this.sameRoute[0], this.lastRoute) ? this.lastRoute.batch : 'A';
        for (var k = 0; k < this.sameRoute.length; k++) {
            this.sameRoute[k].batch = this.batchLetter;
            this.batchLetter = this.incrementChar(this.batchLetter);
        }
        (_a = this.renamedBatches).push.apply(_a, this.sameRoute);
        this.sameRoute = [];
    };
    RenameRouteBatch.prototype.renameRouteBatches = function () {
        while (this.routesList.length > 0) {
            this.sameRoute.push(this.routesList.shift());
            if (this.routesList.length === 0) {
                this.updateBatches();
                return this.renamedBatches;
            }
            if (!(this.isSameBatch(this.sameRoute[0], this.routesList[0]))) {
                this.updateBatches();
            }
        }
    };
    return RenameRouteBatch;
}());
export default RenameRouteBatch;
//# sourceMappingURL=routes-inventory.helper.js.map