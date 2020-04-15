
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './__services__/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      if (route.data.roles && !route.data.roles.includes(currentUser.roles[0])) {
        this.router.navigate(['/403']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
