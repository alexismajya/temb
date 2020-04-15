import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderVerifyComponent } from './provider-verify.component';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatIconModule
} from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from '../../../shared/alert.service';
import { toastrMock } from '../../routes/__mocks__/create-route';

describe('ProviderVerifyComponent', () => {
  let fixture: ComponentFixture<ProviderVerifyComponent>;
  let element: HTMLElement;
  let component: ProviderVerifyComponent;
  const mockProviderService = {
    verify: jest.fn()
  };

  const mockMatDialogRef = {
    close: () => {}
  };

  const mockMatDialogData = {
    data: {
      displayText: 'display data',
      confirmText: 'yes'
    }
  };
  const routerMock = {
    events: of(new NavigationEnd(0, '/', null))
  };
  const tokenMock = {
    token: '2342kje-4i4ui-3hddj-12asd'
  };

  const verificationResponseMock = {
    verified: true,
    message: 'Your account has been successfully verified',
  };

  beforeEach(async(() => {
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

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderVerifyComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  describe('functionality', () => {
    it('should be initialized', () => {
      expect(component).toBeDefined();
    });

    it('should register icons', () => {
      spyOn(component, 'registerIcons');
      component.registerIcons();
      expect(component.registerIcons).toHaveBeenCalled();
    });

    it('should call getPayload function', () => {
      spyOn(component, 'getPayload');
      component.ngOnInit();
      expect(component.getPayload).toHaveBeenCalled();
    });
  });
});
