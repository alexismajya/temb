import { async, TestBed } from '@angular/core/testing';
import { ProviderVerifyComponent } from './provider-verify.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatIconModule } from '@angular/material';
import { NavigationEnd, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from '../../../shared/alert.service';
import { toastrMock } from '../../routes/__mocks__/create-route';
describe('ProviderVerifyComponent', function () {
    var fixture;
    var element;
    var component;
    var mockProviderService = {
        verify: jest.fn()
    };
    var mockMatDialogRef = {
        close: function () { }
    };
    var mockMatDialogData = {
        data: {
            displayText: 'display data',
            confirmText: 'yes'
        }
    };
    var routerMock = {
        events: of(new NavigationEnd(0, '/', null))
    };
    var tokenMock = {
        token: '2342kje-4i4ui-3hddj-12asd'
    };
    var verificationResponseMock = {
        verified: true,
        message: 'Your account has been successfully verified',
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ProviderVerifyComponent],
            imports: [
                HttpClientModule,
                MatIconModule,
                RouterTestingModule
            ],
            providers: [
                { provide: RouterModule, useValue: routerMock },
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
                { provide: AlertService, useValue: toastrMock },
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ProviderVerifyComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });
    describe('functionality', function () {
        it('should be initialized', function () {
            expect(component).toBeDefined();
        });
        it('should register icons', function () {
            spyOn(component, 'registerIcons');
            component.registerIcons();
            expect(component.registerIcons).toHaveBeenCalled();
        });
        it('should call getPayload function', function () {
            spyOn(component, 'getPayload');
            component.ngOnInit();
            expect(component.getPayload).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=provider-verify.component.spec.js.map