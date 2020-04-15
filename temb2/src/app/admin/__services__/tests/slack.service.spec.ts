import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,  HttpTestingController } from '@angular/common/http/testing';
import { HttpClient} from '@angular/common/http';
import { of } from 'rxjs';
import { SlackService } from '../slack.service';


describe('SlackService', () => {
  let service: SlackService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SlackService]
    });
    service = TestBed.get(SlackService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getChannels', () => {
    let httpSpy: any;
    beforeEach(() => {
      httpSpy = jest.spyOn(HttpClient.prototype, 'get');
    });

    it('should call HttpClient.getProviders', () => {
      service.getChannels();
      expect(httpSpy).toBeCalled();
    });
    it('return all the providers', () => {
      const mockChannel = {
        id: 'XXXXXXX',
        name: 'success-ops',
        description: 'some description',
      };
      httpSpy.mockReturnValue(of([mockChannel]));
      const result = service.getChannels();
      result.subscribe(data => {
        expect(data).toEqual([mockChannel]);
      });
    });
  });
});
