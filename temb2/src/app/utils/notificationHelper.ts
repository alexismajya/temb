import { SocketioService } from '../shared/socketio.service';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/__services__/auth.service';
import { Events } from '../shared/events.constants';

export default class NotificationHelper {
  constructor(
    private socketService: SocketioService,
    private swPush: SwPush,
    private authService: AuthService
  ) {
    this.socketService.setupSocketConnection();
    this.listenToTripApprovalEvent();
  }

  listenToTripApprovalEvent() {
    this.socketService
      .listen(Events.newTripApproved)
      .subscribe((message: any) => {
        const {
          approver: { name },
          homebase: { id: requesterHomebase }
        } = message;
        const {
          locations: [{ id: currentUserHomebase }]
        } = this.authService.getCurrentUser();
        this.swPush
          .requestSubscription({
            serverPublicKey: environment.VAPID_PUBLIC_KEY
          })
          .then(subscription => {
            const manager = `${name} just approved a trip. Its ready for your action :smiley:`;
            if (currentUserHomebase === requesterHomebase) {
              this.socketService.broadcast(Events.newTripPushNotification, {
                subscription,
                message: { title: 'New Trip Approval', body: manager }
              });
            }
          })
          .catch(err => console.error(err));
      });
  }
}
