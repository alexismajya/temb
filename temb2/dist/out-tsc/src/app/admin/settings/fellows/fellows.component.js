var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FellowsService } from '../../__services__/fellows.service';
import { Observable } from 'rxjs/Observable';
var FellowsComponent = /** @class */ (function () {
    function FellowsComponent(fellowService) {
        this.fellowService = fellowService;
        this.fellowsOnRouteEventEmitter = new EventEmitter();
        this.displayText = 'No engineers currently on routes';
        this.pageNumber = 1;
        this.pageSize = 9;
        this.isLoading = true;
    }
    FellowsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activeTab.subscribe(function (e) {
            if (e === _this.onRoute) {
                _this.loadFellows(_this.onRoute);
            }
        });
    };
    FellowsComponent.prototype.loadFellows = function (onRoute) {
        var _this = this;
        this.isLoading = true;
        this.fellowService.getFellows(onRoute, this.pageSize, this.pageNumber).subscribe(function (data) {
            var _a = data.data, fellows = _a.fellows, pageMeta = _a.pageMeta;
            if (!Array.isArray(fellows)) {
                _this.isLoading = false;
                return (_this.displayText = 'Something went wrong');
            }
            _this.fellows = fellows.length && fellows.map(_this.serializeFellow);
            _this.totalItems = pageMeta.totalItems;
            _this.isLoading = false;
            _this.fellowsOnRouteEventEmitter.emit({
                totalItems: _this.totalItems,
                onRoute: onRoute ? 'On Route' : 'Off Route'
            });
        }, function (error) {
            _this.isLoading = false;
            _this.displayText =
                error.status === 404
                    ? _this.displayText
                    : 'There was an error fetching this data';
        });
    };
    FellowsComponent.prototype.serializeFellow = function (fellow) {
        return {
            id: fellow.userId,
            name: fellow.name,
            image: fellow.picture,
            partner: fellow.placement ? fellow.placement.client : 'N/A',
            tripsTaken: fellow.tripsTaken + " / " + fellow.totalTrips,
            startDate: fellow.placement && fellow.placement.created_at,
            endDate: fellow.placement && fellow.placement.next_available_date
        };
    };
    FellowsComponent.prototype.setPage = function (page) {
        this.pageNumber = page;
        this.loadFellows(this.onRoute);
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FellowsComponent.prototype, "onRoute", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FellowsComponent.prototype, "showRemoveIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FellowsComponent.prototype, "showAddIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], FellowsComponent.prototype, "activeTab", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], FellowsComponent.prototype, "fellowsOnRouteEventEmitter", void 0);
    FellowsComponent = __decorate([
        Component({
            selector: 'app-fellows',
            templateUrl: './fellows.component.html',
            styleUrls: [
                './fellows.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss'
            ]
        }),
        __metadata("design:paramtypes", [FellowsService])
    ], FellowsComponent);
    return FellowsComponent;
}());
export { FellowsComponent };
//# sourceMappingURL=fellows.component.js.map