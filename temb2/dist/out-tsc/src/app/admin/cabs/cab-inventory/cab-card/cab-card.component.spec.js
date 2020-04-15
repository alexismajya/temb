import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { CabCardComponent } from './cab-card.component';
import { AlertService } from 'src/app/shared/alert.service';
import { CabsInventoryService } from 'src/app/admin/__services__/cabs-inventory.service';
import { of } from 'rxjs';
describe('CabCardComponent', function () {
    var component;
    var fixture;
    var onDelete = jest.fn();
    var matDialogMock = {
        open: jest.fn().mockReturnValue({
            componentInstance: {
                executeFunction: {
                    subscribe: function () { return onDelete(); }
                }
            },
            afterClosed: function () { return of(); }
        })
    };
    var alert = {
        success: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn()
    };
    var mockCabsInventoryService = {
        delete: jest.fn()
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [CabCardComponent],
            imports: [RouterTestingModule.withRoutes([])],
            providers: [
                { provide: MatDialog, useValue: matDialogMock },
                { provide: AlertService, useValue: alert },
                { provide: CabsInventoryService, useValue: mockCabsInventoryService },
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(CabCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    describe('CabCardComponent', function () {
        it('should create cab card component successfully', function () {
            expect(component).toBeTruthy();
        });
        it('should open dialog successfully', function () {
            component.showCabDeleteModal(3);
            expect(matDialogMock.open).toBeCalledTimes(1);
            expect(onDelete).toBeCalledTimes(1);
        });
        it('should delete a cab successfully', function () {
            jest.spyOn(mockCabsInventoryService, 'delete').mockReturnValue(of({
                success: true,
                message: 'Cab deleted successfully'
            }));
            component.delete(3);
            expect(mockCabsInventoryService.delete).toHaveBeenCalled();
            expect(alert.success).toBeCalledWith('Cab deleted successfully');
        });
        it('should fail to delete a cab', function () {
            jest.spyOn(mockCabsInventoryService, 'delete').mockReturnValue(of({
                success: false,
                message: 'Something went wrong'
            }));
            component.delete(3);
            expect(mockCabsInventoryService.delete).toHaveBeenCalled();
            expect(alert.error).toBeCalledWith('Something went wrong');
        });
        it('should show more options', function () {
            jest.spyOn(component.showOptions, 'emit').mockImplementation();
            component.showMoreOptions();
            expect(component.showOptions.emit).toBeCalled();
        });
        it('should open edit dialog successfully', function () {
            jest.spyOn(matDialogMock, 'open');
            component.showCabEditModal();
            expect(matDialogMock.open).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=cab-card.component.spec.js.map