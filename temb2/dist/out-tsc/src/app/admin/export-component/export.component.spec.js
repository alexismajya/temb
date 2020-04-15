import { ExportComponent } from './export.component';
import { TestBed, async } from '@angular/core/testing';
import { AlertService } from 'src/app/shared/alert.service';
import { of, throwError } from 'rxjs';
import { MatMenuModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
describe('ExportComponent', function () {
    var component;
    var fixture;
    var alertMock = {
        success: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn(),
        clear: jest.fn()
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ExportComponent],
            providers: [
                { provide: AlertService, useValue: alertMock },
            ],
            imports: [MatMenuModule, HttpClientModule]
        }).compileComponents();
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create export component', function () {
        expect(component).toBeTruthy();
    });
    describe('exportToPDFOrCSV', function () {
        it('should call exportService', async(function () {
            var exportSpy = jest.spyOn(component.exportService, 'exportData').mockReturnValue(of(new ArrayBuffer(16)));
            var toastInfoSpy = jest.spyOn(component.toastr, 'info');
            var clearToastSpy = jest.spyOn(component.toastr, 'clear');
            fixture.detectChanges();
            component.exportToPDFOrCSV('pdf');
            expect(exportSpy).toBeCalledTimes(1);
            expect(clearToastSpy).toBeCalledTimes(1);
            expect(toastInfoSpy).toBeCalledWith('Hold on tight, we\'re getting your document ready.');
        }));
        it('should call toastr with an error if error is caught in subscribe', function () {
            jest.spyOn(component.exportService, 'exportData')
                .mockReturnValue(throwError(new Error()));
            var toastSpy = jest.spyOn(component.toastr, 'error');
            component.exportToPDFOrCSV('pdf');
            expect(toastSpy).toBeCalledWith('Failed to download. Try Again!');
        });
    });
    describe('exportToPDFOrCSV', function () {
        it('should call exportService', async(function () {
            var exportSpy = jest.spyOn(component.exportService, 'exportData').mockReturnValue(of(''));
            var toastInfoSpy = jest.spyOn(component.toastr, 'info');
            var clearToastSpy = jest.spyOn(component.toastr, 'clear');
            fixture.detectChanges();
            component.exportToPDFOrCSV('csv');
            expect(exportSpy).toBeCalledTimes(1);
            expect(clearToastSpy).toBeCalledTimes(1);
            expect(toastInfoSpy).toBeCalledWith('Hold on tight, we\'re getting your document ready.');
        }));
        it('should call toastr with an error if error is caught in subscribe', function () {
            jest.spyOn(component.exportService, 'exportData')
                .mockReturnValue(throwError(new Error()));
            var toastSpy = jest.spyOn(component.toastr, 'error');
            component.exportToPDFOrCSV('csv');
            expect(toastSpy).toBeCalledWith('Failed to download. Try Again!');
        });
        it('should not call exportService when on the awaiting providers page', async(function () {
            var exportSpy = jest.spyOn(component.exportService, 'exportData').mockReturnValue(of(''));
            var toastInfoSpy = jest.spyOn(component.toastr, 'info');
            var clearToastSpy = jest.spyOn(component.toastr, 'clear');
            component.tableName = 'awaitingProvider';
            fixture.detectChanges();
            component.exportToPDFOrCSV('pdf');
            expect(exportSpy).toBeCalledTimes(0);
            expect(clearToastSpy).toBeCalledTimes(1);
            expect(toastInfoSpy).toBeCalledWith('Ooops! This feature has not been implemented for this table yet. Check back soon!');
        }));
    });
});
//# sourceMappingURL=export.component.spec.js.map