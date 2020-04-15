var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AppEventService } from './../../../../shared/app-events.service';
import { Component, Output } from '@angular/core';
import { Subject } from 'rxjs';
var FellowNavComponent = /** @class */ (function () {
    function FellowNavComponent(appEventService) {
        this.appEventService = appEventService;
        this.fellowsCount = {};
        this.selected = new Subject();
    }
    FellowNavComponent.prototype.ngOnInit = function () { };
    FellowNavComponent.prototype.ngAfterViewInit = function () {
        this.selected.next(true);
    };
    FellowNavComponent.prototype.getSelectedTab = function (event) {
        var textLabel = event.tab.textLabel;
        this.selected.next(textLabel === 'On Route');
    };
    FellowNavComponent.prototype.fellowsOnRouteCount = function (event) {
        this.fellowsCount[event.onRoute] = event.totalItems;
        this.appEventService.broadcast({
            name: 'updateHeaderTitle',
            content: {
                badgeSize: event.totalItems,
                tooltipTitle: event.onRoute
            }
        });
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], FellowNavComponent.prototype, "selected", void 0);
    FellowNavComponent = __decorate([
        Component({
            selector: 'app-fellow-nav',
            templateUrl: './fellow-nav.component.html',
            styleUrls: ['./fellow-nav.component.scss']
        }),
        __metadata("design:paramtypes", [AppEventService])
    ], FellowNavComponent);
    return FellowNavComponent;
}());
export { FellowNavComponent };
//# sourceMappingURL=fellow-nav.component.js.map