import { async, TestBed } from '@angular/core/testing';
import { ProviderFilterComponent } from './provider-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import providersMock from '../../../__mocks__/providers.mock';
import { ProviderService } from '../../__services__/providers.service';
import { Router } from '@angular/router';
describe('ProviderFilterComponent', function () {
    var component;
    var fixture;
    var injector;
    var providerService;
    var providerMockInfo = {
        'id': 1,
        'name': 'Ronald',
        'providerUserId': 15,
        'user': {
            'name': 'Ronald Okello',
            'phoneNo': null,
            'email': 'ronald.okello@andela.com'
        }
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ProviderFilterComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ProviderFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        injector = fixture.debugElement.injector;
        providerService = injector.get(ProviderService);
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    describe('getProvidersData', function () {
        it('should return all providers data', function () {
            jest.spyOn(providerService, 'getProviders').mockReturnValue(of(providersMock));
            component.getProvidersData();
            expect(providerService.getProviders).toHaveBeenCalledTimes(1);
            expect(component.providers).toEqual([providerMockInfo]);
        });
    });
    describe('onProviderSelected', function () {
        it('should trigger navigation when provider is selected', function () {
            var routerSpy = jest.spyOn(Router.prototype, 'navigateByUrl');
            component.onProviderSelected(providerMockInfo);
            expect(routerSpy).toHaveBeenCalledWith('admin/providers/Ronald/1');
        });
    });
});
//# sourceMappingURL=provider-filter.component.spec.js.map