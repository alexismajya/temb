import { TestBed } from '@angular/core/testing';
import { UpdatePageContentService } from './update-page-content.service';
import { AlertService } from './alert.service';
import { AppEventService } from './app-events.service';
describe('UpdatePageContentService', function () {
    var updatePageService;
    var alertService;
    var appEventService;
    var alertServiceMock = { success: jest.fn() };
    var appEventServiceMock = { broadcast: jest.fn() };
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [
                UpdatePageContentService,
                { provide: AlertService, useValue: alertServiceMock },
                { provide: AppEventService, useValue: appEventServiceMock }
            ],
        });
        updatePageService = TestBed.get(UpdatePageContentService);
        alertService = TestBed.get(AlertService);
        appEventService = TestBed.get(AppEventService);
    });
    afterAll(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create service', function () {
        expect(updatePageService).toBeTruthy();
    });
    it('should trigger a success alert', function () {
        var message = 'Trip was fetched successfully';
        updatePageService.triggerSuccessUpdateActions('updateTrips', message);
        expect(alertService.success).toBeCalledWith(message);
    });
    it('should trigger a page content update', function () {
        updatePageService.triggerSuccessUpdateActions('updateTrips', 'Trip was fetched successfully');
        expect(appEventService.broadcast).toBeCalledWith({
            name: 'updateTrips'
        });
    });
});
//# sourceMappingURL=update-page-content.service.spec.js.map