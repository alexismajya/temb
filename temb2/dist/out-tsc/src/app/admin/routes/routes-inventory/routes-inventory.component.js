var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import { BaseTableComponent } from '../../base-table/base-table.component';
import { AlertService } from '../../../shared/alert.service';
import { ITEMS_PER_PAGE } from '../../../app.constants';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import RenameRouteBatch from './routes-inventory.helper';
import { RoutesInventoryEditModalComponent } from './routes-inventory-edit-modal/routes-inventory-edit-modal.component';
import { AppEventService } from 'src/app/shared/app-events.service';
import { CreateRouteHelper } from '../create-route/create-route.helper';
import { Subject } from 'rxjs';
import { SearchService } from '../../__services__/search.service';
import { getDialogProps } from 'src/app/utils/generic-helpers';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';
var RoutesInventoryComponent = /** @class */ (function (_super) {
    __extends(RoutesInventoryComponent, _super);
    function RoutesInventoryComponent(searchService, analytics, alert, appEventsService, dialog, createRouteHelper, router, routeService) {
        var _this = _super.call(this, dialog) || this;
        _this.searchService = searchService;
        _this.analytics = analytics;
        _this.alert = alert;
        _this.appEventsService = appEventsService;
        _this.dialog = dialog;
        _this.createRouteHelper = createRouteHelper;
        _this.router = router;
        _this.routeService = routeService;
        _this.routes = [];
        _this.duplicate = true;
        _this.displayText = 'No Routes Found.';
        _this.searchTerm$ = new Subject();
        _this.subscriptions = new Array();
        _this.getRoutesInventory = function () {
            _this.isLoading = true;
            _this.routeService.getRoutes(_this.pageSize, _this.pageNo, _this.sort).subscribe(function (routesData) {
                var _a = routesData.data, routes = _a.routes, pageMeta = _a.pageMeta;
                _this.routes = _this.renameRouteBatches(routes);
                _this.totalItems = pageMeta.totalResults;
                _this.appEventsService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: pageMeta.totalResults } });
                _this.isLoading = false;
            }, function () {
                _this.isLoading = false;
                _this.displayText = "Oops! We're having connection problems.";
            });
        };
        _this.getSearchResults = function () {
            _this.isLoading = true;
            var _a = _this, sort = _a.sort, pageSize = _a.pageSize, pageNo = _a.pageNo;
            var defaultTerm = "sort=" + sort + "&size=" + pageSize + "&page=" + pageNo;
            _this.searchService.searchData(_this.searchTerm$, 'routes', defaultTerm).subscribe(function (routesData) {
                var routes = routesData.routes, pageMeta = routesData.pageMeta;
                _this.routes = routes;
                _this.totalItems = pageMeta.totalResults;
                _this.appEventsService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: pageMeta.totalResults } });
                _this.isLoading = false;
            }, function () {
                _this.isLoading = false;
                _this.displayText = "Oops! We're having connection problems.";
            });
        };
        _this.pageNo = 1;
        _this.sort = 'name,asc,batch,asc';
        _this.rowType = 'routeBatch';
        _this.pageSize = ITEMS_PER_PAGE;
        _this.getSearchResults();
        return _this;
    }
    RoutesInventoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getRoutesInventory();
        var updateSubscription = this.appEventsService.subscribe('updateRouteInventory', function () {
            _this.getRoutesInventory();
        });
        this.subscriptions.push(updateSubscription);
    };
    RoutesInventoryComponent.prototype.renameRouteBatches = function (routes) {
        var renamedBatches = routes;
        if (routes.length > 0) {
            var renameBatchesObject = new RenameRouteBatch(routes, this.lastRoute);
            renamedBatches = renameBatchesObject.renameRouteBatches();
            this.lastRoute = renamedBatches[renamedBatches.length - 1];
        }
        return renamedBatches;
    };
    RoutesInventoryComponent.prototype.copyRouteBatch = function (routeId) {
        return this.sendRequestToServer(routeId);
    };
    RoutesInventoryComponent.prototype.showDialog = function (displayText, func, value) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmModalComponent, getDialogProps(displayText));
        var sub = dialogRef.componentInstance.executeFunction.subscribe(function () { return func.call(_this, value); });
        this.subscriptions.push(sub);
    };
    RoutesInventoryComponent.prototype.showCopyConfirmModal = function (routeBatch) {
        this.showDialog('copy this route', this.copyRouteBatch, routeBatch.id);
    };
    RoutesInventoryComponent.prototype.sendRequestToServer = function (routeBatchId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.routeService.createRoute(routeBatchId, this.duplicate)];
                    case 1:
                        response = _a.sent();
                        this.createRouteHelper.notifyUser([response.message], 'success');
                        this.analytics.sendEvent(eventsModel.Routes, modelActions.CREATE);
                        this.router.navigate(['/admin/routes/inventory']);
                        this.getRoutesInventory();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.createRouteHelper.notifyUser([error_1.error.message || 'An error occurred.']);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoutesInventoryComponent.prototype.setPage = function (page) {
        this.pageNo = page;
        this.getRoutesInventory();
    };
    RoutesInventoryComponent.prototype.changeRouteStatus = function (id, status) {
        var _this = this;
        this.routeService.changeRouteStatus(id, { status: status })
            .subscribe(function (response) {
            if (response.success) {
                _this.updateRoutesData(id, status);
                _this.analytics.sendEvent(eventsModel.Routes, modelActions.UPDATE);
            }
        }, function () { return _this.alert.error('Something went wrong! try again'); });
    };
    RoutesInventoryComponent.prototype.updateRoutesData = function (id, status) {
        this.routes = this.routes.map(function (route) {
            if (route.id === id) {
                route = __assign({}, route, { status: status });
            }
            return route;
        });
    };
    RoutesInventoryComponent.prototype.deleteRoute = function (routeBatchId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.routeService.deleteRouteBatch(routeBatchId)
                    .subscribe(function (response) {
                    var success = response.success, message = response.message;
                    if (success) {
                        _this.alert.success(message);
                        _this.analytics.sendEvent(eventsModel.Routes, modelActions.DELETE);
                        _this.getRoutesInventory();
                    }
                    else {
                        _this.alert.error(message);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    RoutesInventoryComponent.prototype.showDeleteModal = function (routeBatchId) {
        this.showDialog('delete this batch', this.deleteRoute, routeBatchId);
    };
    RoutesInventoryComponent.prototype.editRoute = function (routeBatch) {
        var id = routeBatch.id, status = routeBatch.status, takeOff = routeBatch.takeOff, capacity = routeBatch.capacity, batch = routeBatch.batch, inUse = routeBatch.inUse, name = routeBatch.route.name;
        this.dialog.open(RoutesInventoryEditModalComponent, {
            data: {
                id: id, status: status, takeOff: takeOff, capacity: capacity, batch: batch, inUse: inUse, name: name
            }
        });
    };
    RoutesInventoryComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    RoutesInventoryComponent = __decorate([
        Component({
            selector: 'app-inventory',
            templateUrl: './routes-inventory.component.html',
            styleUrls: [
                './routes-inventory.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss'
            ],
            providers: [SearchService]
        }),
        __metadata("design:paramtypes", [SearchService,
            GoogleAnalyticsService,
            AlertService,
            AppEventService,
            MatDialog,
            CreateRouteHelper,
            Router,
            RoutesInventoryService])
    ], RoutesInventoryComponent);
    return RoutesInventoryComponent;
}(BaseTableComponent));
export { RoutesInventoryComponent };
//# sourceMappingURL=routes-inventory.component.js.map