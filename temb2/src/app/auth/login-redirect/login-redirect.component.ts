import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../__services__/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/shared/alert.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.scss']
})
export class LoginRedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: AlertService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams.token;
    const loggedIn = this.authService.setAisToken(token);

    if (!loggedIn) {
      this.authService.unAuthorizeUser();
      this.navigateTo('/');
    }
    this.authService.login()
    .subscribe(data => {
      const { data: response } = data;
      if (response.isAuthorized) {
        this.authService.authorizeUser(response);
        this.navigateTo('/admin');
      }
    }, (err: any) => this.handleEventError(err));
  }

  handleEventError(err: any) {
    if (err instanceof HttpErrorResponse && err.status === 401 || err.status === 500 ) {
      this.authService.unAuthorizeUser();
    }
    this.toastr.error('Something went wrong! try again');
    this.navigateTo('/');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
