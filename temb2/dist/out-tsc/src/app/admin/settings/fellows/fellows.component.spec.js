import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { FellowsComponent } from './fellows.component';
import { FellowsService } from '../../__services__/fellows.service';
import { FellowCardComponent } from './fellow-card/fellow-card.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { of, Observable } from 'rxjs';
import { fellowsMockResponse, fellowsArrayMockResponse } from '../../__services__/__mocks__/fellows.mock';
import { RouterTestingModule } from '@angular/router/testing';
describe('FellowsComponent no fellow Array', function () {
    var component;
    var fixture;
    var fellowService;
    var mockFellowsService = {
        getFellows: jest.fn().mockReturnValue(of(fellowsArrayMockResponse))
    };
    var matDialogMock = {
        open: jest.fn().mockReturnValue({
            componentInstance: {
                removeUser: {
                    subscribe: function () { return jest.fn(); }
                }
            }
        })
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [
                FellowsComponent,
                FellowCardComponent,
                AppPaginationComponent,
                EmptyPageComponent
            ],
            imports: [RouterTestingModule.withRoutes([])],
            providers: [
                { provide: FellowsService, useValue: mockFellowsService },
                { provide: MatDialog, useValue: matDialogMock }
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(FellowsComponent);
        component = fixture.componentInstance;
        component.activeTab = new Observable(function (observer) {
            observer.next(true);
        });
        component.onRoute = true;
        fellowService = fixture.debugElement.injector.get(FellowsService);
        fixture.detectChanges();
    });
    it('should fetch fellows when component instantiates', function () {
        expect(mockFellowsService.getFellows).toHaveBeenCalled();
        expect(component.isLoading).toEqual(false);
        expect(component.displayText).toEqual('Something went wrong');
    });
});
describe('FellowsComponent', function () {
    var component;
    var fixture;
    var fellowService;
    var mockFellowsService = {
        getFellows: jest.fn().mockReturnValue(of(fellowsMockResponse))
    };
    var matDialogMock = {
        open: jest.fn().mockReturnValue({
            componentInstance: {
                removeUser: {
                    subscribe: function () { return jest.fn(); }
                }
            }
        })
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [
                FellowsComponent,
                FellowCardComponent,
                AppPaginationComponent,
                EmptyPageComponent
            ],
            imports: [RouterTestingModule.withRoutes([])],
            providers: [
                { provide: FellowsService, useValue: mockFellowsService },
                { provide: MatDialog, useValue: matDialogMock }
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(FellowsComponent);
        component = fixture.componentInstance;
        component.activeTab = new Observable(function (observer) {
            observer.next(true);
        });
        component.onRoute = true;
        fellowService = fixture.debugElement.injector.get(FellowsService);
        fixture.detectChanges();
        jest.spyOn(FellowsComponent.prototype, 'loadFellows').mockReturnValue({});
    });
    it('should create fellows component', function () {
        expect(component).toBeTruthy();
    });
    it('should get next page when pagination is clicked', function () {
        component.setPage(1);
        expect(mockFellowsService.getFellows).toHaveBeenCalledWith(true, 9, 1);
    });
    describe('ngOnInit', function () {
        it('should get fellows onRoute', function () {
            component.onRoute = true;
            component.ngOnInit();
            expect(fellowService.getFellows).toHaveBeenCalled();
        });
        it('shold get fellows offRoute', function () {
            component.onRoute = false;
            component.ngOnInit();
            expect(fellowService.getFellows).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=fellows.component.spec.js.map