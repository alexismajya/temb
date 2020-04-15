import { TestBed } from '@angular/core/testing';

import { SocketioService } from './socketio.service';
import socketIomock from './__mocks__/socket.ioMock';

describe('SocketioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketioService = TestBed.get(SocketioService);
    service.setupSocketConnection();
    expect(service).toBeTruthy();
  });
});
