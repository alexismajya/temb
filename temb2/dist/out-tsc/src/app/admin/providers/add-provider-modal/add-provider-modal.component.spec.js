import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ProviderService } from '../../__services__/providers.service';
import { AddProviderModalComponent } from './add-provider-modal.component';
import { AlertService } from '../../../shared/alert.service';
import { of, throwError } from 'rxjs';
import { providerResponseMock, ProviderNotificationChannels, createProviderMock } from './__mocks__/add-provider.mocks';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SlackService } from '../../__services__/slack.service';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { MatSelectModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
describe('AddProviderModalComponent', function () {
    var component;
    var fixture;
    var mockProviderService = {
        add: jest.fn()
    };
    var mockSlackService = {
        getChannels: jest.fn().mockReturnValue(of({
            success: true,
            data: []
        }))
    };
    var mockMatDialogRef = {
        close: function () { },
    };
    var mockAlert = {
        success: jest.fn(),
        error: jest.fn()
    };
    var analyticsMock = {
        sendEvent: jest.fn()
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [AddProviderModalComponent],
            imports: [FormsModule, HttpClientModule, MatSelectModule],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: ProviderService, useValue: mockProviderService },
                { provide: AlertService, useValue: mockAlert },
                { provide: SlackService, useValue: mockSlackService },
                { provide: GoogleAnalyticsService, useValue: analyticsMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(AddProviderModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    describe('closeDialog', function () {
        it('should close the dialog', function () {
            jest.spyOn(component.dialogRef, 'close');
            component.closeDialog();
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
        });
    });
    describe('addProvider', function () {
        it('should call providerService.add', function () {
            mockProviderService.add.mockReturnValue(of(providerResponseMock));
            jest.spyOn(component.alert, 'success').mockReturnValue();
            component.addProvider(createProviderMock);
            expect(component.providerService.add).toHaveBeenCalledTimes(1);
            expect(component.alert.success).toHaveBeenCalledTimes(1);
        });
        it('should call alert.error when request fails with 409 conflict', function () {
            var message = 'User with that name or email already exists';
            var error = new MockError(409, message);
            mockProviderService.add.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.addProvider(createProviderMock);
            expect(component.alert.error).toHaveBeenCalledTimes(1);
            expect(component.alert.error).toHaveBeenCalledWith(message);
        });
        it('should call alert.error when request fails with 404', function () {
            var message = 'Provider user not found';
            var error = new MockError(404, message);
            mockProviderService.add.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.addProvider(createProviderMock);
            expect(component.alert.error).toHaveBeenCalledWith('Provider user email entered does not exist');
        });
        it('should call alert.error for unknown errors', function () {
            var message = 'TypeError: just another error';
            var error = new MockError(500, message);
            mockProviderService.add.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.addProvider(createProviderMock);
            expect(component.alert.error).toHaveBeenCalledWith('Something went wrong, please try again');
        });
    });
    describe('toggleNotificationChannel', function () {
        it('keeps the channelId value', function () {
            component.provider.channelId = '3';
            component.toggleNotificationChannel(ProviderNotificationChannels['Slack Channel']);
            expect(component.provider.notificationChannel).toEqual(ProviderNotificationChannels['Slack Channel']);
            expect(component.provider.channelId).toEqual('3');
        });
    });
});
//# sourceMappingURL=add-provider-modal.component.spec.js.map