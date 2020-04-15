import { TestBed } from '@angular/core/testing';
import { SocketioService } from './socketio.service';
describe('SocketioService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(SocketioService);
        service.setupSocketConnection();
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=socketio.service.spec.js.map