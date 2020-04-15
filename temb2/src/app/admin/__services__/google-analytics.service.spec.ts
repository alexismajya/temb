import { TestBed } from '@angular/core/testing';
import { GoogleAnalyticsService } from './google-analytics.service';

describe('GoogleAnalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    (<any>window).ga = jest.fn();
  });

  afterEach(() => (<any>window).ga = undefined);

  it('should be created', () => {
    const service: GoogleAnalyticsService = TestBed.get(GoogleAnalyticsService);
    expect(service).toBeTruthy();
  });

  describe('send command', () => {
    let service;
    beforeEach(() => {
      service = new GoogleAnalyticsService();
    });

    it('should send page view command to google analytics', () => {
      service.sendPageView('tembea.andela.com');
      expect((<any>window).ga).toHaveBeenCalledTimes(2);
    });

    it('should send event command to google analytics', () => {
      service.sendEvent('routes', 'create-route');
      expect((<any>window).ga).toHaveBeenCalled();
      expect((<any>window).ga).toHaveBeenCalledWith('send', 'event', 'routes', 'create-route');
    });
  });
});
