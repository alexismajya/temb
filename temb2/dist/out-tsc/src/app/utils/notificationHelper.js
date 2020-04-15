import { environment } from 'src/environments/environment';
import { Events } from '../shared/events.constants';
var NotificationHelper = /** @class */ (function () {
    function NotificationHelper(socketService, swPush, authService) {
        this.socketService = socketService;
        this.swPush = swPush;
        this.authService = authService;
        this.socketService.setupSocketConnection();
        this.listenToTripApprovalEvent();
    }
    NotificationHelper.prototype.listenToTripApprovalEvent = function () {
        var _this = this;
        this.socketService
            .listen(Events.newTripApproved)
            .subscribe(function (message) {
            var name = message.approver.name, requesterHomebase = message.homebase.id;
            var currentUserHomebase = _this.authService.getCurrentUser().locations[0].id;
            _this.swPush
                .requestSubscription({
                serverPublicKey: environment.VAPID_PUBLIC_KEY
            })
                .then(function (subscription) {
                var manager = name + " just approved a trip. Its ready for your action :smiley:";
                if (currentUserHomebase === requesterHomebase) {
                    _this.socketService.broadcast(Events.newTripPushNotification, {
                        subscription: subscription,
                        message: { title: 'New Trip Approval', body: manager }
                    });
                }
            })
                .catch(function (err) { return console.error(err); });
        });
    };
    return NotificationHelper;
}());
export default NotificationHelper;
//# sourceMappingURL=notificationHelper.js.map