import { AddCabsModalComponent } from './add-cab-modal.component';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { of, throwError } from 'rxjs';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { responseMock, MockError, updateCabMock, updateResponse } from './__mocks__/add-cabs-mock';
describe('AddCabsModalComponent', function () {
    var component;
    var fixture;
    var mockCabsInventoryService = {
        add: jest.fn(),
        update: jest.fn()
    };
    var mockMatDialogRef = {
        close: function () { },
    };
    var mockAlert = {
        success: jest.fn(),
        error: jest.fn()
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [AddCabsModalComponent],
            imports: [FormsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: CabsInventoryService, useValue: mockCabsInventoryService },
                { provide: AlertService, useValue: mockAlert },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(AddCabsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('initial load', function () {
        it('should create component', function () {
            expect(component).toBeTruthy();
        });
    });
    describe('closeDialog', function () {
        it('should close the dialog', function () {
            jest.spyOn(component.dialogRef, 'close');
            component.closeDialog();
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
        });
    });
    describe('addCab', function () {
        it('should call cabService.addCab', function () {
            mockCabsInventoryService.add.mockReturnValue(of(responseMock));
            component.addCab();
            expect(component.cabService.add).toHaveBeenCalledTimes(1);
        });
        it('should call alert.success when request succeed', function () {
            mockCabsInventoryService.add.mockReturnValue(of(responseMock));
            jest.spyOn(component.alert, 'success');
            component.addCab();
            expect(component.alert.success).toHaveBeenCalledTimes(1);
        });
        it('should call alert.error when request fail with 409 conflict', function () {
            var error = new MockError(409, 'A cab with the registration already exists');
            mockCabsInventoryService.add.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.addCab();
            expect(component.alert.error).toHaveBeenCalledTimes(1);
            expect(component.alert.error).toHaveBeenCalledWith('A cab with the registration already exists');
        });
        it('should call alert.error when request fail with 404', function () {
            var error = new MockError(404, 'A cab with the registration does not exist');
            mockCabsInventoryService.add.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.addCab();
            expect(component.alert.error).toHaveBeenCalledTimes(1);
            expect(component.alert.error).toHaveBeenCalledWith('A cab with the registration does not exist');
        });
    });
    describe('editCab', function () {
        it('should call editCab', function () {
            mockCabsInventoryService.update.mockReturnValue(of(updateResponse));
            jest.spyOn(component.alert, 'success');
            component.cabData = updateCabMock;
            component.addCab();
            expect(component.alert.success).toHaveBeenCalledTimes(1);
        });
        it('should call alert.error when request fail with 409 conflict', function () {
            var error = new MockError(409, 'A cab with the registration already exists');
            mockCabsInventoryService.update.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.cabData = updateCabMock;
            component.addCab();
            expect(component.alert.error).toHaveBeenCalledTimes(1);
            expect(component.alert.error).toHaveBeenCalledWith('A cab with the registration already exists');
        });
        it('should call alert.error when request fail with 500 conflict', function () {
            var error = new MockError(500, 'Could not update cab details');
            mockCabsInventoryService.update.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.cabData = updateCabMock;
            component.addCab();
            expect(component.alert.error).toHaveBeenCalledTimes(1);
            expect(component.alert.error).toHaveBeenCalledWith('Could not update cab details');
        });
    });
});
//# sourceMappingURL=add-cab-modal.component.spec.js.map