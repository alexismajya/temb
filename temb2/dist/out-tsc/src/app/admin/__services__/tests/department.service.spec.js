import { DepartmentsService } from '../departments.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { getDepartmentsMock } from '../../routes/routes-inventory/__mocks__/get-departments.mock';
import { DepartmentsModel } from 'src/app/shared/models/departments.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
describe('DepartmentsService', function () {
    var service;
    var httpMock;
    var deleteResponseMock = {
        success: true,
        message: 'department deleted successfully'
    };
    var getDepartmentsResponse = new DepartmentsModel()
        .deserialize(getDepartmentsMock);
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DepartmentsService]
        });
        service = TestBed.get(DepartmentsService);
        httpMock = TestBed.get(HttpTestingController);
    });
    afterEach(function () {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        httpMock.verify();
    });
    describe('getDepartments', function () {
        it('should be created', function () {
            expect(service).toBeTruthy();
        });
        it('should make http request to get Departments', function () {
            service.get(1, 2).subscribe(function (data) {
                var pageMeta = data.pageMeta;
                expect(pageMeta.page).toEqual(1);
                expect(pageMeta.pageSize).toEqual(2);
            });
            var url2 = environment.tembeaBackEndUrl + "/api/v1/departments?size=1&page=2";
            var mockDepartments = httpMock.expectOne(url2);
            expect(mockDepartments.request.method).toEqual('GET');
            mockDepartments.flush(getDepartmentsResponse);
        });
    });
    describe('Add Departments', function () {
        it('should http request to post Departments', function () {
            var department = {
                body: {
                    name: 'launchpad',
                    email: 'tembea@andela.com',
                    slackUrl: 'ASE32YL',
                    location: 'Nairobi'
                }
            };
            var spy = jest.spyOn(HttpClient.prototype, 'post');
            spy.mockReturnValue(of({ success: true }));
            var result = service.add(department);
            result.subscribe(function (data) {
                expect(data.success).toEqual(true);
            });
        });
    });
    describe('deleteDepartment', function () {
        it('should make http request to delete department by Id', function () {
            var spy = jest.spyOn(HttpClient.prototype, 'delete');
            spy.mockReturnValue(of(deleteResponseMock));
            var result = service.delete(1);
            result.subscribe(function (data) {
                expect(data).toEqual(deleteResponseMock);
            });
            expect(JSON.stringify(result)).toEqual(JSON.stringify(of(deleteResponseMock)));
        });
    });
    describe('updateDepartment', function () {
        it('should make http request to update department', function () {
            var spy = jest.spyOn(HttpClient.prototype, 'put');
            var updateResponseMock = {
                success: true
            };
            spy.mockReturnValue(of({ success: true }));
            var result = service.update('abc', 'Launchpad', 'barak', 'Lagos');
            result.subscribe(function (data) {
                expect(data).toEqual(updateResponseMock);
            });
            expect(JSON.stringify(result)).toEqual(JSON.stringify(of(updateResponseMock)));
        });
    });
});
//# sourceMappingURL=department.service.spec.js.map