import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { async, TestBed } from '@angular/core/testing';
import { TripAwaitManagerApprovalComponent } from './trip-await-manager-approval.component';
import { MatDialog } from '@angular/material';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
describe('TripAwaitManagerApprovalComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TripAwaitManagerApprovalComponent,
                ShortenTextPipe,
                ShortenNamePipe
            ],
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
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TripAwaitManagerApprovalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=trip-await-manager-approval.component.spec.js.map