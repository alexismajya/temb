var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { async, TestBed } from '@angular/core/testing';
import { AppPaginationComponent } from './app-pagination.component';
import { Component } from '@angular/core';
var AppWrapperComponent = /** @class */ (function () {
    function AppWrapperComponent() {
        this.totalItems = 25;
        this.pageSize = 3;
        this.btnGroup = 3;
    }
    AppWrapperComponent.prototype.pageChange = function () {
    };
    AppWrapperComponent = __decorate([
        Component({
            selector: 'app-wrapper-component',
            template: "\n    <app-pagination [btnGroupSize]=\"btnGroup\" (pageChange)=\"pageChange($event)\" [totalItems]=\"totalItems\" [pageSize]=\"pageSize\">\n    </app-pagination>"
        })
    ], AppWrapperComponent);
    return AppWrapperComponent;
}());
describe('AppPaginationComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [
                AppWrapperComponent,
                AppPaginationComponent
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(AppWrapperComponent);
        component = fixture.debugElement.children[0].componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    describe('ngOnInit', function () {
        it('should initialize pagination fields', function () {
            component.ngOnInit();
            expect(component.currPage).toEqual(1);
            expect(component.totalPages).toEqual(9);
            expect(component.btnGroup).toEqual([1, 2, 3]);
        });
    });
    describe('genBtnGroup', function () {
        it('should generate btnGroup array based on the current page', function () {
            var btnGroup = component.genBtnGroup(3, 1, 1);
            expect(btnGroup).toEqual([1]);
            btnGroup = component.genBtnGroup(3, 1, 2);
            expect(btnGroup).toEqual([1, 2]);
            btnGroup = component.genBtnGroup(3, 1, 4);
            expect(btnGroup).toEqual([1, 2, 3]);
            btnGroup = component.genBtnGroup(3, 4, 4);
            expect(btnGroup).toEqual([2, 3, 4]);
            btnGroup = component.genBtnGroup(3, 1, 3);
            expect(btnGroup).toEqual([1, 2, 3]);
        });
    });
    describe('changePage', function () {
        var emitter;
        beforeEach(function () {
            emitter = jest.spyOn(component.pageChange, 'emit');
        });
        afterEach(function () {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        describe('prev', function () {
            it('should not perform prev action', function () {
                // currPage = 1, therefore we should not be able to trigger prev action
                component.changePage(component.currPage - 1, 'prev');
                expect(emitter).not.toHaveBeenCalled();
            });
            it('should goto prev page not in the same button group', function () {
                // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
                component.currPage = 4;
                component.btnGroup = [4, 5, 6];
                component.changePage(component.currPage - 1, 'prev');
                expect(emitter).toHaveBeenCalledWith(3);
                // clicking on the prev button, the button group should be [1,2,3]
                expect([1, 2, 3]).toEqual(component.btnGroup);
            });
            it('should goto prev page in the same button group', function () {
                // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
                component.currPage = 2;
                component.changePage(component.currPage - 1, 'prev');
                expect(emitter).toHaveBeenCalledWith(1);
                // clicking on the prev button, the button group should be [1,2,3]
                expect([1, 2, 3]).toEqual(component.btnGroup);
            });
        });
        describe('next', function () {
            it('should not perform next action', function () {
                component.currPage = 9;
                component.btnGroup = [7, 8, 9];
                component.changePage(component.currPage + 1, 'next');
                expect(emitter).not.toHaveBeenCalled();
            });
            it('should goto next page not in the button group', function () {
                // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
                component.changePage(null, 'next-ellipse');
                component.currPage = 6;
                component.changePage(component.currPage + 1, 'next');
                // clicking on the next button, the button group should be [7,8,9]
                expect(emitter).toHaveBeenCalledWith(7);
                expect([7, 8, 9]).toEqual(component.btnGroup);
            });
            it('should goto next page in the same button group', function () {
                component.currPage = 2;
                component.changePage(component.currPage + 1, 'next');
                expect(emitter).toHaveBeenCalledWith(3);
                expect([1, 2, 3]).toEqual(component.btnGroup);
            });
        });
        describe('prev-ellipse', function () {
            it('should not perform prev-ellipse action', function () {
                // currPage = 1, therefore we should not be able to trigger prev action
                component.changePage(null, 'prev-ellipse');
                expect(emitter).not.toHaveBeenCalled();
            });
            it('should goto prev page not in the button group', function () {
                // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
                component.changePage(null, 'next-ellipse');
                component.changePage(null, 'prev-ellipse');
                // clicking on the prev button, the button group should be [1,2,3]
                expect(emitter).toHaveBeenCalledWith(4);
                expect(emitter).toHaveBeenCalledWith(3);
                expect([1, 2, 3]).toEqual(component.btnGroup);
            });
        });
        describe('next-ellipse', function () {
            it('should goto next page not in the button group', function () {
                // move to next button group [1,2,3] -> [4,5,6]; currPage = 4
                component.changePage(null, 'next-ellipse');
                expect(emitter).toHaveBeenCalledWith(4);
                expect([4, 5, 6]).toEqual(component.btnGroup);
                emitter.mockReset();
                // move to next button group [4,5,6] -> [7,8,9]; currPage = 7
                component.changePage(null, 'next-ellipse');
                expect(emitter).toHaveBeenCalledWith(7);
                expect([7, 8, 9]).toEqual(component.btnGroup);
                emitter.mockReset();
                // because totalPages = 9 then we shouldn't be able to trigger next-ellipse
                component.changePage(null, 'next-ellipse');
                expect(emitter).not.toHaveBeenCalled();
            });
        });
    });
    describe('Hide pagination button', function () {
        it('should hidden prev button', function () {
            expect(component.shouldHideBtn('prev')).toBeTruthy();
        });
        it('should show prev button', function () {
            // for totalItem = 25, pageSize = 3, then totalPages = 9
            // for btnGroupSize = 4,
            // then the prev button should show when the button group starts from page 5
            component.changePage(null, 'next-ellipse');
            expect(component.shouldHideBtn('prev')).not.toBeTruthy();
        });
        it('should hidden prev-ellipse button', function () {
            expect(component.shouldHideBtn('prev-ellipse')).toBeTruthy();
        });
        it('should show prev-ellipse button', function () {
            // for totalItem = 25, pageSize = 3, then totalPages = 9
            // for btnGroupSize = 4,
            // then the prev button should show when the button group starts from page 5
            component.changePage(null, 'next-ellipse');
            expect(component.shouldHideBtn('prev')).not.toBeTruthy();
        });
        it('should hidden next button', function () {
            // for totalItem = 25, pageSize = 3, then totalPages = 9
            // for btnGroupSize = 4,
            // update btnGroup -> [4, 5, 6]
            component.changePage(null, 'next-ellipse');
            // update btnGroup -> [7, 8, 9]
            component.changePage(null, 'next-ellipse');
            expect(component.shouldHideBtn('next')).toBeTruthy();
        });
        it('should show next button', function () {
            expect(component.shouldHideBtn('next')).not.toBeTruthy();
        });
        it('should hidden next-ellipse button', function () {
            // for totalItem = 25, pageSize = 3, then totalPages = 9
            // for btnGroupSize = 4,
            // update btnGroup -> [5, 6, 7, 8]
            component.changePage(null, 'next-ellipse');
            // update btnGroup -> [6, 7, 8, 9]
            component.changePage(null, 'next-ellipse');
            expect(component.shouldHideBtn('next')).toBeTruthy();
        });
        it('should show next-ellipse button', function () {
            expect(component.shouldHideBtn('next')).not.toBeTruthy();
        });
    });
});
//# sourceMappingURL=app-pagination.component.spec.js.map