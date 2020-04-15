import { async, TestBed } from '@angular/core/testing';
import { DeleteFellowModalComponent } from './delete-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AlertService } from 'src/app/shared/alert.service';
import { mockToastr } from 'src/app/shared/__mocks__/mockData';
import { By } from '@angular/platform-browser';
import { FellowCardComponent } from '../fellow-card/fellow-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FellowsService } from '../../../__services__/fellows.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleAnalyticsService } from '../../../__services__/google-analytics.service';
describe('DeleteFellowModalComponent', function () {
    var fixture;
    var component;
    var debugElement;
    var mockMatDialogRef = {
        close: jest.fn(),
    };
    var mockMatDialogData = {
        fellow: {
            name: 'fellow', image: 'image', partner: 'partner', id: 3,
            tripsTaken: 10, startDate: '2019-01-23T00:00:00.000Z', endDate: '2020-01-23T00:00:00.000Z'
        }
    };
    var mockMatDialog = {
        open: jest.fn()
    };
    var analyticsMock = {
        sendEvent: jest.fn()
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DeleteFellowModalComponent, FellowCardComponent],
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
                { provide: AlertService, useValue: mockToastr },
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: GoogleAnalyticsService, useValue: analyticsMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(DeleteFellowModalComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
    }));
    describe('initial load', function () {
        it('should have correct title', function () {
            var title = debugElement.query(By.css('.header-title')).nativeElement.innerHTML;
            expect(title).toEqual(' Are you sure you want to Remove? ');
        });
    });
    describe('closeDialog', function () {
        afterEach(function () {
            jest.clearAllMocks();
        });
        it('should call dialogRef.close() when closeDialog() is called', function () {
            component.closeDialog();
            expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
        });
        it('should close the dialog when close button is clicked', function () {
            var button = debugElement.query(By.css('.close-button')).nativeElement;
            button.click();
            expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
        });
        it('should close the dialog when cancel button is clicked', function () {
            var button = debugElement.query(By.css('.cancel')).nativeElement;
            button.click();
            expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
        });
    });
    describe('deleteFellow', function () {
        var deleteFellowSpy;
        beforeEach(function () {
            deleteFellowSpy = jest.spyOn(FellowsService.prototype, 'removeFellowFromRoute');
        });
        afterEach(function () {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });
        it('should remove a fellow successfully when delete button is clicked', function () {
            deleteFellowSpy.mockReturnValue(of({ success: true, message: 'fellow removed successfully' }));
            var emitSpy = jest.spyOn(component.removeUser, 'emit').mockImplementation(jest.fn());
            var button = debugElement.query(By.css('.confirm')).nativeElement;
            button.click();
            expect(mockToastr.success).toBeCalledWith('fellow removed successfully');
            expect(emitSpy).toBeCalledTimes(1);
            expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
        });
        it('should show an error toast if a http error occurs', function () {
            deleteFellowSpy.mockReturnValue(throwError(new Error()));
            component.deleteFellow();
            expect(mockToastr.error).toBeCalledWith('Something went terribly wrong, we couldn\`t remove the fellow. Please try again.');
            expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=delete-dialog.component.spec.js.map