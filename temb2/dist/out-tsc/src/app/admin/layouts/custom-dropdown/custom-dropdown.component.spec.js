import { async, TestBed } from '@angular/core/testing';
import { CustomDropdownComponent } from './custom-dropdown.component';
import { FormsModule } from '@angular/forms';
describe('CustomDropdownComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [CustomDropdownComponent],
            imports: [FormsModule]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(CustomDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=custom-dropdown.component.spec.js.map