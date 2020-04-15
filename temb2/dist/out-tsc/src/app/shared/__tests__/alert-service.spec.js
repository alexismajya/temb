import { AlertService } from '../alert.service';
describe('test AlertService', function () {
    var alert;
    var mockToastr = {
        success: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
        clear: jest.fn()
    };
    var options = {
        positionClass: 'toast-top-center',
        preventDuplicates: true
    };
    beforeEach(function () {
        alert = new AlertService(mockToastr);
    });
    it('test success toastr', function () {
        expect(alert.options).toEqual(options);
        alert.success('success');
        expect(mockToastr.success).toHaveBeenCalledWith('success', undefined, options);
    });
    it('test error toastr', function () {
        alert.error('an error');
        expect(mockToastr.error).toHaveBeenCalledWith('an error', undefined, options);
    });
    it('test info toast', function () {
        alert.info('hold on tight');
        expect(mockToastr.info).toHaveBeenCalledWith('hold on tight', undefined, options);
    });
    it('test warning toast', function () {
        alert.warning('warning');
        expect(mockToastr.warning).toHaveBeenCalledWith('warning', undefined, options);
    });
    it('test clear toast', function () {
        alert.clear(mockToastr.error);
        expect(mockToastr.clear).toHaveBeenCalledWith(mockToastr.error);
    });
});
//# sourceMappingURL=alert-service.spec.js.map