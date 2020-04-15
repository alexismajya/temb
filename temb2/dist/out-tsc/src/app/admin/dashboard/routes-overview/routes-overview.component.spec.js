import { async, TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { RoutesOverviewComponent } from './routes-overview.component';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';
describe('RoutesOverviewComponent', function () {
    var component;
    var fixture;
    var data = {
        Route: 'Nyika',
        RouteBatch: 'A',
        percentageUsage: 30
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [RoutesOverviewComponent, ShortenTextPipe],
            imports: [AngularMaterialModule]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(RoutesOverviewComponent);
        component = fixture.componentInstance;
        component.data = data;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=routes-overview.component.spec.js.map