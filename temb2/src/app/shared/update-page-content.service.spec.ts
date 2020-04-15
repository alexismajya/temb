import { TestBed } from '@angular/core/testing';
import { UpdatePageContentService } from './update-page-content.service';
import { AlertService } from './alert.service';
import { AppEventService } from './app-events.service';

describe('UpdatePageContentService', () => {
  let updatePageService: UpdatePageContentService;
  let alertService: AlertService;
  let appEventService: AppEventService;

  const alertServiceMock = { success: jest.fn() };
  const appEventServiceMock = { broadcast: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UpdatePageContentService,
        { provide: AlertService, useValue: alertServiceMock},
        { provide: AppEventService, useValue: appEventServiceMock }
      ],
    });

    updatePageService = TestBed.get(UpdatePageContentService);
    alertService = TestBed.get(AlertService);
    appEventService = TestBed.get(AppEventService);
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create service', () => {
    expect(updatePageService).toBeTruthy();
  });

  it('should trigger a success alert', () => {
    const message = 'Trip was fetched successfully';
    updatePageService.triggerSuccessUpdateActions('updateTrips', message);
    expect(alertService.success).toBeCalledWith(message);
  });

  it('should trigger a page content update', () => {
    updatePageService.triggerSuccessUpdateActions('updateTrips', 'Trip was fetched successfully');
    expect(appEventService.broadcast).toBeCalledWith({
      name: 'updateTrips'
    });
  });
});
