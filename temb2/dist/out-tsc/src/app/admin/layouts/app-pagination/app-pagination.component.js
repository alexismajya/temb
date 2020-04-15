var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
var AppPaginationComponent = /** @class */ (function () {
    function AppPaginationComponent() {
        var _this = this;
        this.pTotalItems = null;
        this.position = 'right';
        this.btnGroupSize = 3;
        this.pageChange = new EventEmitter();
        this.btnGroup = [];
        this.genBtnGroup = function (btnGroupSize, pageVal, totalPages) {
            var numArray = Array.from(Array(totalPages + 1).keys()).slice();
            var normalizePage = Math.min(pageVal, totalPages);
            var normalizeBtnGroupSize = Math.min(btnGroupSize, totalPages);
            var start = Math.max(numArray.indexOf(normalizePage), 1);
            var end = start + normalizeBtnGroupSize;
            if (end > numArray.length) {
                start -= (end - numArray.length);
                end = start + normalizeBtnGroupSize;
            }
            return numArray.slice(start, end);
        };
        /* Private fields */
        this.updatePageInfo = function (page) {
            var validPage = page >= 1 && page <= _this.totalPages;
            if (validPage && _this.currPage !== page) {
                _this.currPage = page;
                _this.pageChange.emit(page);
            }
        };
        this.goto = function (page, direction) {
            if (_this.btnGroup.includes(page)) {
                _this.updatePageInfo(page);
            }
            else {
                var val = direction + "-ellipse";
                _this.changePage(null, val);
            }
        };
        this.gotoNextBtnGroup = function () {
            var validGroup = _this.shouldHideBtn('next-ellipse');
            if (validGroup) {
                return;
            }
            _this.btnGroup = _this.calcNextBtnGroup(_this.btnGroup, _this.totalPages);
            _this.updatePageInfo(_this.btnGroup[0]);
        };
        this.gotoPrevBtnGroup = function () {
            var validGroup = _this.shouldHideBtn('prev-ellipse');
            if (validGroup) {
                return;
            }
            _this.btnGroup = _this.calcPrevBtnGroup(_this.btnGroup);
            var lastIndex = _this.btnGroup.length - 1;
            _this.updatePageInfo(_this.btnGroup[lastIndex]);
        };
        this.calcPrevBtnGroup = function (btnGroup) {
            var numberGrp = btnGroup.slice();
            var size = numberGrp.length;
            var first = numberGrp[0];
            var decrement = size;
            if (first - size < 1) {
                decrement = first - 1;
            }
            return numberGrp.map(function (val) {
                return val - decrement;
            });
        };
        this.calcNextBtnGroup = function (btnGroup, totalPages) {
            var numberGrp = btnGroup.slice();
            var size = numberGrp.length;
            var last = numberGrp[size - 1];
            var increment = size;
            if (last > totalPages - size) {
                increment = totalPages - last;
            }
            return numberGrp.map(function (val) {
                return val + increment;
            });
        };
    }
    Object.defineProperty(AppPaginationComponent.prototype, "pageSize", {
        get: function () {
            if (this.pPageSize == null) {
                throw new Error('pageSize must be provided.');
            }
            return this.pPageSize;
        },
        set: function (value) {
            this.pPageSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppPaginationComponent.prototype, "totalItems", {
        get: function () {
            if (this.pTotalItems == null) {
                throw new Error('totalItems must be provided.');
            }
            return this.pTotalItems;
        },
        set: function (page) {
            this.pTotalItems = page;
        },
        enumerable: true,
        configurable: true
    });
    AppPaginationComponent.prototype.ngOnInit = function () {
        this.initPagination();
    };
    AppPaginationComponent.prototype.ngOnChanges = function (changes) {
        if (changes.totalItems) {
            this.initPagination();
        }
    };
    AppPaginationComponent.prototype.initPagination = function () {
        this.currPage = this.page || 1;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
        this.btnGroup = this.genBtnGroup(this.btnGroupSize, this.page, this.totalPages);
    };
    AppPaginationComponent.prototype.changePage = function (page, direction) {
        var handles = {
            'prev': this.goto,
            'next': this.goto,
            'prev-ellipse': this.gotoPrevBtnGroup,
            'next-ellipse': this.gotoNextBtnGroup
        };
        var handle = handles[direction] || this.updatePageInfo;
        handle(page, direction);
    };
    AppPaginationComponent.prototype.shouldHideBtn = function (direction) {
        var btnGroup = this.btnGroup.slice();
        var first = btnGroup[0];
        var last = btnGroup.pop();
        var prevEl = this.btnGroup.includes(1) && first === 1;
        var nextEl = this.btnGroup.includes(this.totalPages) && last === this.totalPages;
        var show = {
            'prev': this.currPage <= 1 || this.btnGroup.includes(1),
            'next': this.currPage >= this.totalPages || this.btnGroup.includes(this.totalPages),
            'prev-ellipse': prevEl,
            'next-ellipse': nextEl,
        };
        return show[direction];
    };
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], AppPaginationComponent.prototype, "pageSize", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AppPaginationComponent.prototype, "totalItems", null);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AppPaginationComponent.prototype, "position", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AppPaginationComponent.prototype, "page", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AppPaginationComponent.prototype, "btnGroupSize", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], AppPaginationComponent.prototype, "pageChange", void 0);
    AppPaginationComponent = __decorate([
        Component({
            selector: 'app-pagination',
            templateUrl: './app-pagination.component.html',
            styleUrls: ['./app-pagination.component.scss']
        })
    ], AppPaginationComponent);
    return AppPaginationComponent;
}());
export { AppPaginationComponent };
//# sourceMappingURL=app-pagination.component.js.map