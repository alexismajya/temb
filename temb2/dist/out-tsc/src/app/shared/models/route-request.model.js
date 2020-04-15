import { Location } from './location.model';
import { Engagement } from './engagement.model';
import { Users } from './users.model';
var RouteRequest = /** @class */ (function () {
    function RouteRequest() {
    }
    RouteRequest.prototype.deserialize = function (input) {
        Object.assign(this, input);
        this.engagement = new Engagement().deserialize(input.engagement);
        this.manager = new Users().deserialize(input.manager);
        this.busStop = new Location().deserialize(input.busStop);
        this.home = new Location().deserialize(input.home);
        return this;
    };
    return RouteRequest;
}());
export { RouteRequest };
//# sourceMappingURL=route-request.model.js.map