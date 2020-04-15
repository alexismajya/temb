import { async, TestBed } from '@angular/core/testing';
import { FellowCardComponent } from './fellow-card.component';
import { MatDialog } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
describe('FellowCardComponent', function () {
    var component;
    var fixture;
    var emit = jest.fn();
    var matDialogMock = {
        open: jest.fn().mockReturnValue({
            componentInstance: {
                removeUser: {
                    subscribe: function () { return emit(); }
                }
            }
        })
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [FellowCardComponent],
            imports: [RouterTestingModule.withRoutes([])],
            providers: [
                { provide: MatDialog, useValue: matDialogMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(FellowCardComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    }));
    it('should create fellow card component successfully', function () {
        expect(component).toBeTruthy();
    });
    it('should open dialog successfully', function () {
        component.showFellowDeleteModal();
        expect(matDialogMock.open).toBeCalledTimes(1);
        expect(emit).toBeCalledTimes(1);
    });
});
//# sourceMappingURL=fellow-card.component.spec.js.map