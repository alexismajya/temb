import { async, TestBed } from '@angular/core/testing';
import { EmbassyVisitsComponent } from './embassy-visits.component';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
describe('EmbassyVisitsComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [EmbassyVisitsComponent],
            imports: [AppTestModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {
                    provide: MatDialog, useValue: {
                        data: {
                            tripInfo: {},
                            closeText: 'close'
                        }
                    }
                },
            ]
        })
            .overrideTemplate(EmbassyVisitsComponent, "<div></div>")
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(EmbassyVisitsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create Embassy Visits component', function () {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=embassy-visits.component.spec.js.map