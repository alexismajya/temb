import { async, TestBed } from '@angular/core/testing';
import { AirportTransfersComponent } from './airport-transfers.component';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
describe('AirportTransfersComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [AirportTransfersComponent],
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
            .overrideTemplate(AirportTransfersComponent, "<div></div>")
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(AirportTransfersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create Airport Transfers component', function () {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=airport-transfers.component.spec.js.map