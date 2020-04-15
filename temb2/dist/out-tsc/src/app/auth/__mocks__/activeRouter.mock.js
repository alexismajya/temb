var FakeActivatedRoute = /** @class */ (function () {
    function FakeActivatedRoute() {
    }
    // When the component calls this.dialog.open(...) we'll return an object
    // with an afterClosed method that allows to subscribe to the dialog result observable.
    FakeActivatedRoute.prototype.snapshot = function () { return { data: {} }; };
    return FakeActivatedRoute;
}());
export { FakeActivatedRoute };
//# sourceMappingURL=activeRouter.mock.js.map