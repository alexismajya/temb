var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FELLOW_ROUTES_PER_PAGE } from 'src/app/app.constants';
import { FellowRouteService } from '../../../__services__/fellow-route.service';
import { AppEventService } from 'src/app/shared/app-events.service';
var FellowComponent = /** @class */ (function () {
    function FellowComponent(fellowRouteService, appEventsService, activatedRoute) {
        this.fellowRouteService = fellowRouteService;
        this.appEventsService = appEventsService;
        this.activatedRoute = activatedRoute;
        this.displayText = 'This engineer has no Routes yet 😒';
        this.pageNo = 1;
        this.pageSize = FELLOW_ROUTES_PER_PAGE;
        this.sort = 'name,asc,batch,asc';
        this.isLoading = true;
    }
    FellowComponent.prototype.ngOnInit = function () {
        this.getFellowsRoutes();
    };
    FellowComponent.prototype.getFellowsRoutes = function () {
        var _this = this;
        this.isLoading = true;
        this.userId = this.activatedRoute.snapshot.paramMap.get('id');
        this.fellowRouteService.getFellowRoutes(this.userId, this.pageSize, this.pageNo, this.sort)
            .subscribe(function (fellowsRoutesData) {
            var pageMeta = fellowsRoutesData.pageMeta, data = fellowsRoutesData.data;
            if (!Array.isArray(data)) {
                _this.isLoading = false;
                _this.displayText = 'Something went wrong';
            }
            else {
                _this.userDetails(data);
                _this.isLoading = false;
                _this.totalItems = pageMeta.totalItems;
                _this.fellowsData = _this.mapReturnedData(data);
                _this.appEventsService.broadcast({
                    name: 'updateHeaderTitle',
                    content: { badgeSize: _this.totalItems, headerTitle: _this.userName + " Trip History" }
                });
            }
        }, function () {
            _this.isLoading = false;
            _this.displayText = 'The network is doing you no good 😄';
        });
    };
    FellowComponent.prototype.userDetails = function (data) {
        try {
            var _a = data[0].user, name_1 = _a.name, routeBatchId = _a.routeBatchId;
            this.userName = name_1;
            this.firstName = name_1.split(' ')[0];
            this.routeBatchId = routeBatchId;
        }
        catch (err) {
            this.userName = '';
            this.isLoading = false;
            this.displayText = 'This engineer has no Routes yet 😒';
        }
    };
    FellowComponent.prototype.setPage = function (page) {
        this.pageNo = page;
        this.getFellowsRoutes();
    };
    FellowComponent.prototype.mapReturnedData = function (data) {
        var theData = data.map(function (entry) {
            var rating = entry.rating, userAttendStatus = entry.userAttendStatus, _a = entry.routeUseRecord, departureDate = _a.departureDate, _b = _a.cabDetails, driverName = _b.driverName, regNumber = _b.regNumber, _c = _a.route, name = _c.name, address = _c.destination.address;
            return { rating: rating, userAttendStatus: userAttendStatus, departureDate: departureDate, driverName: driverName, regNumber: regNumber, name: name, address: address };
        });
        return theData;
    };
    FellowComponent = __decorate([
        Component({
            selector: 'app-fellow-details',
            templateUrl: './fellow.component.html',
            styleUrls: [
                '../../../routes/routes-inventory/routes-inventory.component.scss',
                './fellow.component.scss',
            ]
        }),
        __metadata("design:paramtypes", [FellowRouteService,
            AppEventService,
            ActivatedRoute])
    ], FellowComponent);
    return FellowComponent;
}());
export { FellowComponent };
//# sourceMappingURL=fellow.component.js.map