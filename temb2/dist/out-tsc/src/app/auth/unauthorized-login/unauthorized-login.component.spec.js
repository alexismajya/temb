import { async, TestBed } from '@angular/core/testing';
import { UnauthorizedLoginComponent } from './unauthorized-login.component';
describe('UnauthorizedLoginComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [UnauthorizedLoginComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(UnauthorizedLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should contain h1', function () {
        var compiled = fixture.debugElement.nativeElement;
        var h1 = compiled.querySelector('h1');
        expect(h1.textContent).toEqual('Hi There!');
    });
    it('should contain p', function () {
        var compiled = fixture.debugElement.nativeElement;
        var p = compiled.querySelector('p');
        expect(p.textContent).toEqual('Sorry, you\'re not authorized to Login to Tembea :(');
    });
});
//# sourceMappingURL=unauthorized-login.component.spec.js.map