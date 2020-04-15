import { async, TestBed } from '@angular/core/testing';
import { PastTripsComponent } from './past-trips.component';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
describe('PastTripsComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [PastTripsComponent],
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
            .overrideTemplate(PastTripsComponent, "<div></div>")
            .compileComponents();
        fixture = TestBed.createComponent(PastTripsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create past trips component', function () {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=past-trips.component.spec.js.map