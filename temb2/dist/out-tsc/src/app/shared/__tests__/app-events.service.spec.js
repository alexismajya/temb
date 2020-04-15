import { inject, TestBed } from '@angular/core/testing';
import { AppEventService } from '../app-events.service';
var callback = function (spyService) {
    spyService.called = true;
};
describe('Event Manager Test', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [AppEventService]
        });
    });
    it('should not fail when no subscriber and broadcasting', inject([AppEventService], function (eventManager) {
        expect(eventManager.observer).toBeUndefined();
        eventManager.broadcast({ name: 'modifier', content: 'modified something' });
    }));
    it('should broadcast to a specify observer by name', inject([AppEventService], function (eventManager) {
        var spyServiceA = { called: false };
        var spyServiceB = { called: false };
        expect(spyServiceA.called).toBeFalsy();
        expect(spyServiceB.called).toBeFalsy();
        eventManager.subscribe('modifierA', function () { return callback(spyServiceA); });
        eventManager.subscribe('modifierB', function () { return callback(spyServiceB); });
        eventManager.broadcast({ name: 'modifierA', content: 'modified something' });
        expect(spyServiceA.called).toBeTruthy();
        expect(spyServiceB.called).toBeFalsy();
    }));
});
//# sourceMappingURL=app-events.service.spec.js.map