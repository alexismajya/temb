import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { AlertService } from './shared/alert.service';
import { GoogleAnalyticsService } from './admin/__services__/google-analytics.service';
import { SocketioService } from './shared/socketio.service';
import notificationHelper from './utils/notificationHelper';
import { AuthService } from './auth/__services__/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      div {
        height: 100%;
        width: 100%;
      }
    `
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  offlineEvent: Observable<Event>;
  offlineSubscription: Subscription;

  constructor(
    private toastr: AlertService,
    private analytics: GoogleAnalyticsService,
    private socketService: SocketioService,
    private swPush: SwPush,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.offlineEvent = fromEvent(window, 'offline');

    this.offlineSubscription = this.offlineEvent.subscribe(() => {
      this.toastr.error('You seem to be offline.');
    });

    this.analytics.init();

    if (this.swPush.isEnabled) {
      this.swPush
      .requestSubscription({
        serverPublicKey: environment.VAPID_PUBLIC_KEY
      });
      // tslint:disable-next-line: no-unused-expression
      new notificationHelper(this.socketService, this.swPush, this.authService);
    }
  }

  ngOnDestroy(): void {
    this.offlineSubscription.unsubscribe();
  }
}
