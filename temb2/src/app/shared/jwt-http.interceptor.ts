import {Inject, Injectable} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../auth/__services__/auth.service';
import { AlertService } from './alert.service';
import { HomeBaseManager } from './homebase.manager';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: AlertService,
    private hbManager: HomeBaseManager,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { tembeaToken } = this.authService;
    if (!request.url.includes('/auth/verify') && tembeaToken) {
      const homebaseid = this.hbManager.getHomebaseId();
      const authReq = request.clone({ setHeaders: {
        Authorization: tembeaToken, homebaseid , teamurl: environment.teamUrl} });

      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.toastr.error('Unauthorized access');
          } else if (error.status === 500) {
            this.toastr.error('Something went wrong. Maybe try again?');
          }
          return throwError(error);
        })
      );
    }

    return next.handle(request);
  }
}
