import { async, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirmation-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EventEmitter } from '@angular/core';
describe('ConfirmModalComponent', function () {
    var fixture;
    var element;
    var component;
    var mockMatDialogRef = {
        close: function () { },
    };
    var mockMatDialogData = {
        data: {
            displayText: 'display data',
            confirmText: 'yes'
        }
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ConfirmModalComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ConfirmModalComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });
    describe('initial load', function () {
        it('should have correct message', function () {
            expect(element.querySelector('p').textContent).toContain('Are you sure you want to ?');
        });
    });
    describe('functionality', function () {
        it('should close the dialog', function () {
            jest.spyOn(component.dialogRef, 'close');
            component.closeDialog();
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
        });
        it('should emit an event when confirmDialog is called', function () {
            var spy = jest.spyOn(EventEmitter.prototype, 'emit');
            component.confirmDialog();
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=confirmation-dialog.component.spec.js.map