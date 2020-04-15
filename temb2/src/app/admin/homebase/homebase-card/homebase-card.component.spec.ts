import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material';
import { Injector } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { HomebaseCardComponent } from './homebase-card.component';
import { AppTestModule } from '../../../__tests__/testing.module';
import { ProviderService } from '../../__services__/providers.service';
import { AppEventService } from '../../../shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';


const matDialogMock = {
  open: jest.fn().mockReturnValue({
    componentInstance: {
      executeFunction: {
        subscribe: () => of()
      }
    },
    afterClosed: () => of()
  }),
};
const mockMatDialogRef = {
  close: () => {},
};

const mockMatDialogData = {
  data: {
    displayText: 'display data',
    confirmText: 'yes'
  }
};

const analyticsMock = {
  sendEvent: jest.fn()
};

describe('HomebaseCardComponent', () => {
  let component: HomebaseCardComponent;
  let fixture: ComponentFixture<HomebaseCardComponent>;
  let injector: Injector;
  let appEventService: any;
  let providerService: any;
  let alert: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomebaseCardComponent, ConfirmModalComponent ],
      providers: [{provide: MatDialog, useValue: matDialogMock},
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: GoogleAnalyticsService, useValue: analyticsMock },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }],
      imports: [
        MatDialogModule, AppTestModule, BrowserAnimationsModule, NoopAnimationsModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomebaseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    injector = fixture.debugElement.injector;
    appEventService = injector.get(AppEventService);
    providerService = injector.get(ProviderService);
    alert = injector.get(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show more options', () => {
    jest.spyOn(component.showOptions, 'emit').mockImplementation();
    component.showMoreOptions();
    expect(component.hidden).toBe(true);
    expect(component.showOptions.emit).toBeCalled();
  });

  it('should open edit modal', () => {
    jest.spyOn(matDialogMock, 'open');
    component.openEditModal();
    expect(matDialogMock.open).toHaveBeenCalled();
  });

  describe('Delete Provider', () => {
    it('should open confirmation model', () => {
      component.showDeleteModal();
      expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('should unsubscribe updateSubscription on ngOnDestroy', () => {
      component.confirmDeleteSubscription = {
        unsubscribe: jest.fn()
      };
      component.ngOnDestroy();
      expect(component.confirmDeleteSubscription.unsubscribe).toHaveBeenCalled();
    });
    it('should unsubscribe deleteSubscription on ngOnDestroy', () => {
      component.closeDialogSubscription = {
        unsubscribe: jest.fn()
      };
      component.ngOnDestroy();
      expect(component.closeDialogSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
