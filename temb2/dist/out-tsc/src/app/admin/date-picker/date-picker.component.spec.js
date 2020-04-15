import { async, TestBed } from '@angular/core/testing';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './date-picker.component';
describe('DatePickerComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DatePickerComponent],
            imports: [MatDatepickerModule, MatNativeDateModule, MatNativeDateModule, FormsModule]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(DatePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=date-picker.component.spec.js.map