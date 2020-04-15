import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '../../../shared/alert.service';
import { DriverCardComponent } from './driver-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { of } from 'rxjs';
var mockMatDialogRef = {
    close: function () { },
};
var alert = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
};
var mockMatDialogData = {
    data: {
        displayText: 'display data',
        confirmText: 'yes'
    }
};
describe('DriverCardComponent', function () {
    var component;
    var fixture;
    var matDialogMock = {
        open: jest.fn().mockReturnValue({
            componentInstance: {
                executeFunction: {
                    subscribe: function () { return of(); }
                }
            },
            afterClosed: function () { return of(); }
        }),
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DriverCardComponent],
            imports: [RouterTestingModule.withRoutes([])],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: MatDialog, useValue: matDialogMock },
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
                { provide: AlertService, useValue: alert }
            ],
        })
            .compileComponents();
        fixture = TestBed.createComponent(DriverCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should show more options', function () {
        jest.spyOn(component.showOptions, 'emit').mockImplementation();
        component.showMoreOptions();
        expect(component.showOptions.emit).toBeCalled();
    });
    it('should open dialog successfully', function () {
        component.showDeleteModal();
        expect(matDialogMock.open).toBeCalledTimes(1);
    });
    it('should create subscription to Modal closing event" ', function () {
        component.showDeleteModal();
        expect(component.dialogRef).toBeDefined();
        component.dialogRef.afterClosed().subscribe(function () {
            expect(component.refreshWindow.emit).toHaveBeenCalled();
        });
    });
    it('should open edit modal', function () {
        jest.spyOn(matDialogMock, 'open');
        component.openEditModal();
        expect(matDialogMock.open).toHaveBeenCalled();
        expect(component.editDialogRef).toBeDefined();
        component.editDialogRef.afterClosed().subscribe(function () {
            expect(component.refreshWindow.emit).toHaveBeenCalled();
        });
    });
    it('should show more options', function () {
        jest.spyOn(component.showOptions, 'emit').mockImplementation();
        component.showMoreOptions();
        expect(component.hidden).toBe(true);
        expect(component.showOptions.emit).toBeCalled();
    });
});
//# sourceMappingURL=driver-card.component.spec.js.map