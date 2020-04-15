import { Users } from './users.model';
import { Partner } from './partner.model';
var Engagement = /** @class */ (function () {
    function Engagement() {
    }
    Engagement.prototype.deserialize = function (input) {
        Object.assign(this, input);
        this.partner = new Partner().deserialize(input.partner);
        this.fellow = new Users().deserialize(input.fellow);
        return this;
    };
    return Engagement;
}());
export { Engagement };
//# sourceMappingURL=engagement.model.js.map