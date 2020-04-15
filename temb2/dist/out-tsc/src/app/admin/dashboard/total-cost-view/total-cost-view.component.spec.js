import { async, TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { TotalCostViewComponent } from './total-cost-view.component';
describe('TotalCostViewComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TotalCostViewComponent],
            imports: [AngularMaterialModule]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TotalCostViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=total-cost-view.component.spec.js.map