import { async, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FellowNavComponent } from './fellow-nav.component';
import { FellowsComponent } from '../fellows.component';
import { ShortenNamePipe } from '../../../__pipes__/shorten-name.pipe';
import { AppTestModule } from '../../../../__tests__/testing.module';
import { AppEventService } from 'src/app/shared/app-events.service';
describe('FellowNavComponent', function () {
    var component;
    var fixture;
    var appEventsMock = {
        broadcast: jest.fn()
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [FellowNavComponent, ShortenNamePipe, FellowsComponent],
            imports: [HttpClientTestingModule, AppTestModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: AppEventService, useValue: appEventsMock }
            ]
        })
            .overrideTemplate(FellowNavComponent, "<div></div>")
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(FellowNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    var event = {
        index: 1,
        tripRequestType: 'onRoute',
        tab: {
            textLabel: 'On Route'
        },
        onRoute: true,
        totalItems: 4
    };
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should be broadcast updateHeaderTitle event', async(function () {
        component.fellowsOnRouteCount({
            onRoute: 'on Route',
            totalItems: 4
        });
        component.fellowsCount = { 'On Route': 2, 'Off Route': 4 };
        var broadcastPayload = {
            badgeSize: 4,
            tooltipTitle: 'on Route'
        };
        component.getSelectedTab(event);
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    }));
    it('should mutate the value on fellowsCount', async(function () {
        component.fellowsOnRouteCount(event);
        expect(component.fellowsCount[event.onRoute]).toEqual(event.totalItems);
    }));
});
//# sourceMappingURL=fellow-nav.component.spec.js.map