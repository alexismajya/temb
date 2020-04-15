import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { AlertService } from './shared/alert.service';
import { Observable } from 'rxjs';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CookieService } from './auth/__services__/ngx-cookie-service.service';
import { ClockService } from './auth/__services__/clock.service';
import { HomeBaseService } from './shared/homebase.service';
import { HomeBaseManager } from './shared/homebase.manager';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SocketioService } from './shared/socketio.service';
describe('AppComponent', function () {
    var fixture;
    var component;
    beforeEach(async(function () {
        var mockMatDialog = {
            open: function () { }
        };
        var alertMockData = {
            error: jest.fn(),
            success: jest.fn()
        };
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                AngularMaterialModule,
                HttpClientModule,
                RouterTestingModule,
                ServiceWorkerModule.register('', { enabled: false })
            ],
            declarations: [
                AppComponent,
                HomeComponent
            ],
            providers: [
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: AlertService, useValue: alertMockData },
                CookieService,
                ClockService,
                HomeBaseService,
                HomeBaseManager,
                JwtHelperService,
                SocketioService
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create the app', function () {
        expect(component).toBeTruthy();
    });
    it('should subscribe to offline event on ngOnInit', function () {
        var subscribeSpy = jest.spyOn(Observable.prototype, 'subscribe');
        component.ngOnInit();
        expect(subscribeSpy).toBeCalledTimes(1);
    });
    it('should unsubscribe to offline event on ngOnDestroy', function () {
        component.offlineSubscription = {
            unsubscribe: jest.fn()
        };
        component.ngOnDestroy();
        expect(component.offlineSubscription.unsubscribe).toBeCalledTimes(1);
    });
});
//# sourceMappingURL=app.component.spec.js.map