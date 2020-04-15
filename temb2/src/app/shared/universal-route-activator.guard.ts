import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/__services__/auth.service';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HomeBaseManager } from './homebase.manager';
import { IUser } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UniversalRouteActivatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private readonly hbManager: HomeBaseManager,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    const { isAuthenticated } = this.authService;
    const token = this.cookieService.get('tembea_token');
    const helper = new JwtHelperService();
    const isTokenExpired = helper.isTokenExpired(token);

    if (!isAuthenticated && token && !isTokenExpired) {
      try {
        let userInfo: IUser;
        ({ userInfo } = helper.decodeToken(token));
        this.authService.setCurrentUser(userInfo);
        this.authService.tembeaToken = token;
        this.authService.setupClock();
        this.authService.isAuthenticated = true;
        this.authService.isAuthorized = true;
        this.hbManager.setHomebase(userInfo.locations[0].name);
      } catch (err) {
        return this.redirectHome();
      }
    }

    this.deleteTokenIfExpired(isTokenExpired);

    return this.authService.isAuthenticated && !isTokenExpired
      ? true
      : this.redirectHome();
  }

  deleteTokenIfExpired(isTokenExpired: boolean) {
    if (isTokenExpired) {
      this.cookieService.delete('tembea_token');
    }
  }

  redirectHome(): boolean {
    this.router.navigate(['/']);
    return false;
  }
}
