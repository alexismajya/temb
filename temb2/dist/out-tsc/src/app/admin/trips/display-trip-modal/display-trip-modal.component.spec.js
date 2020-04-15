var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { async, TestBed } from '@angular/core/testing';
import { DisplayTripModalComponent } from './display-trip-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConvertNullValue } from '../../__pipes__/convert-nullValue.pipe';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import { CustomTitlecasePipe } from '../../__pipes__/custom-titlecase.pipe';
describe('DisplayTripModalComponent', function () {
    var component;
    var fixture;
    var extraRouteOptions = {
        route: {
            name: 'Town Route',
            imageUrl: 'url to image',
            destination: {
                address: ''
            }
        },
        homebase: {
            name: 'Mombasa',
            country: {
                name: 'Kenya'
            }
        },
        riders: []
    };
    var mockMatDialogData = {
        tripInfo: __assign({ distance: '12 km', requester: {
                name: 'sdfe'
            }, rider: {
                name: 'sfdddsa'
            }, provider: {
                name: 'Uber Kenya'
            }, driver: {
                driverName: 'Savali'
            }, cab: {
                model: 'Toyota',
                regNumber: 'KKKKK'
            }, pickup: 'asd', destination: 'afsd', department: 'safd' }, extraRouteOptions),
        tripType: 'routes'
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DisplayTripModalComponent, ConvertNullValue, ShortenNamePipe, CustomTitlecasePipe],
            imports: [AppTestModule, AngularMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(DisplayTripModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=display-trip-modal.component.spec.js.map