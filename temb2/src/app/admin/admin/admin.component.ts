import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry, MatSidenav, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Event as RouterEvent, Router, NavigationEnd } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { NavMenuService } from '../__services__/nav-menu.service';
import * as mainRoutes from './main-routes.json';
import { HeaderComponent } from '../header/header.component';
import { AppEventService } from '../../shared/app-events.service';
import { GoogleAnalyticsService } from '../__services__/google-analytics.service';
import { IUser } from '../../shared/models/user.model';
import { AuthService } from '../../auth/__services__/auth.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy, AfterViewInit {
  position: String = 'side';
  watcher: Subscription;
  counterSubscription: Subscription;
  activeRoute = '';
  loading: Boolean = false;
  routes: any;
  value = 0;
  counter = interval(500);

  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(HeaderComponent) header: HeaderComponent;
  private readonly user: IUser;

  constructor(
    private events: AppEventService,
    private analytics: GoogleAnalyticsService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private media: MediaObserver,
    private router: Router,
    private navMenuService: NavMenuService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
  ) {
    this.registerIcons();
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
        this.analytics.sendPageView(this.activeRoute);
      }
    });
    this.user = this.authService.getCurrentUser();
    this.routes = mainRoutes.routes.filter((route) => this.canAccess(route.allow));
  }

  responsiveLogout = () => {
    this.events.broadcast({
      name: 'SHOW_LOGOUT_MODAL'
    });
  }

  ngOnInit() {
    this.navMenuService.addSubscriber((data: boolean) => {
      this.loading = data;
       this.counterSubscription = this.counter.subscribe(() => {
        this.value = this.value + 10;
        if (this.value === 250) {
          this.counterSubscription.unsubscribe();
        }
      });
    });
  }

  ngAfterViewInit() {
    this.navMenuService.setSidenav(this.sidenav);
    this.createMediaWatcher();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.watcher) {
      this.watcher.unsubscribe();
    }
  }

  registerIcons = () => {
    const logos = [
      { name: 'logo', url: 'assets/logo.svg' },
      { name: 'dashboard', url: 'assets/sidebar-icons/ic_active_dashboard.svg' },
      { name: 'dashboard-inactive', url: 'assets/sidebar-icons/ic_inactive_dashboard.svg' },
      { name: 'routes', url: 'assets/sidebar-icons/ic_active_routes.svg' },
      { name: 'routes-inactive', url: 'assets/sidebar-icons/ic_inactive_routes.svg' },
      { name: 'trips', url: 'assets/sidebar-icons/ic_active_location.svg' },
      { name: 'trips-inactive', url: 'assets/sidebar-icons/ic_inactive_location.svg' },
      { name: 'travel', url: 'assets/sidebar-icons/ic_active_travel.svg' },
      { name: 'travel-inactive', url: 'assets/sidebar-icons/ic_inactive_travel.svg' },
      { name: 'cabs', url: 'assets/sidebar-icons/ic_active_cabs.svg' },
      { name: 'cabs-inactive', url: 'assets/sidebar-icons/ic_inactive_cabs.svg' },
      { name: 'settings', url: 'assets/sidebar-icons/ic_active_settings.svg' },
      { name: 'settings-inactive', url: 'assets/sidebar-icons/ic_inactive_settings.svg' },
      { name: 'users', url: 'assets/sidebar-icons/ic_active_users.svg' },
      { name: 'users-inactive', url: 'assets/sidebar-icons/ic_inactive_users.svg' },
      { name: 'homebases', url: 'assets/sidebar-icons/ic_active_homebases.svg' },
      { name: 'homebases-inactive', url: 'assets/sidebar-icons/ic_inactive_homebases.svg' },
    ];

    logos.forEach(item => {
      this.iconRegistry.addSvgIcon(item.name,
        this.sanitizer.bypassSecurityTrustResourceUrl(item.url));
    });
  }

  createMediaWatcher = () => {
    this.watcher = this.media.asObservable().subscribe((changes: MediaChange[]) => {
      changes.map(change => {
        if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
          this.navMenuService.close();
          this.position = 'over';
        } else {
          this.navMenuService.open();
          this.position = 'side';
        }
      });
    });
  }

  menuClicked = (shouldCloseWhenClicked) => {
    if (this.position === 'over' && shouldCloseWhenClicked) {
      this.navMenuService.close();
    }
  }

  canAccess(roles: string[]) {
    return roles ? roles.includes(this.user.roles[0]) : true;
  }
}
