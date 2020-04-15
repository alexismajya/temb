import { async, TestBed } from '@angular/core/testing';
import { PageNotFoundComponent } from './page-not-found.component';
import { RouterTestingModule } from '@angular/router/testing';
describe('PageNotFoundComponent', function () {
    var component;
    var fixture;
    var notFoundPage;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [PageNotFoundComponent],
            imports: [RouterTestingModule]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(PageNotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        notFoundPage = fixture.nativeElement;
    });
    it('should create component', function () {
        expect(component).toBeTruthy();
    });
    it('should have <h2> with "Error 404"', function () {
        var h2 = notFoundPage.querySelector('.page-title');
        expect(h2.textContent).toEqual('Error 404');
    });
    it('should contain <p> with more details', function () {
        var p = notFoundPage.querySelector('.details > p');
        expect(p.textContent).toEqual('The page you\'re looking for isn\'t here :(');
    });
    it('should contain link back to home', function () {
        var href = notFoundPage.querySelector('.header > a').getAttribute('href');
        expect(href).toEqual('/');
    });
});
//# sourceMappingURL=page-not-found.component.spec.js.map