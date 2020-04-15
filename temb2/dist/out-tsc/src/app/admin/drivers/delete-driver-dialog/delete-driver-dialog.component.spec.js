import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { DeleteDriverDialogComponent } from './delete-driver-dialog.component';
import { DriverCardComponent } from '../driver-card/driver-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService } from 'src/app/shared/alert.service';
import { mockToastr } from 'src/app/shared/__mocks__/mockData';
import { DriversInventoryService } from '../../__services__/drivers-inventory.service';
describe('DeleteDriverDialogComponent', function () {
    var component;
    var fixture;
    var debugElement;
    var mockMatDialogData = {
        driver: {
            id: 1,
            name: 'John Doe',
            email: 'johndoe@email.com',
            phoneNo: '08012345678',
            providerId: 1,
        }
    };
    var mockMatDialog = {
        open: jest.fn()
    };
    var mockMatDialogRef = {
        close: jest.fn(),
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DeleteDriverDialogComponent, DriverCardComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
                { provide: AlertService, useValue: mockToastr },
                { provide: MatDialog, useValue: mockMatDialog }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(DeleteDriverDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        debugElement = fixture.debugElement;
    }));
    describe('initial load', function () {
        it('it should have the correct title', function () {
            var title = debugElement.query(By.css('.header-title')).nativeElement.innerHTML;
            expect(title).toEqual(' Are you sure you want to Delete? ');
        });
    });
    describe('delete', function () {
        var deleteDriverSpy;
        beforeEach(function () {
            deleteDriverSpy = jest.spyOn(DriversInventoryService.prototype, 'deleteDriver');
        });
        afterEach(function () {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });
        it('should remove a driver successfully when the delete button is clicked', function () {
            deleteDriverSpy.mockReturnValue(of({ success: true, message: 'Driver successfully deleted' }));
            var emitSpy = jest.spyOn(component.refresh, 'emit').mockImplementation(jest.fn());
            var button = debugElement.query(By.css('.confirm')).nativeElement;
            button.click();
            expect(mockToastr.success).toBeCalledWith('Driver successfully deleted');
            expect(emitSpy).toBeCalledTimes(1);
            expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
        });
        it('should show an error toast if http error occurs', function () {
            deleteDriverSpy.mockReturnValue(of({ success: false, message: 'Driver does not exist' }));
            var button = debugElement.query(By.css('.confirm')).nativeElement;
            button.click();
            expect(mockToastr.error).toBeCalledWith('Driver does not exist');
            expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=delete-driver-dialog.component.spec.js.map