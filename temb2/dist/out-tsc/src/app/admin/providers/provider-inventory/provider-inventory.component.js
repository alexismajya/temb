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
import { Subject } from 'rxjs';
import { ProviderService } from '../../__services__/providers.service';
import { SearchService } from '../../__services__/search.service';
import { AppEventService } from 'src/app/shared/app-events.service';
import { AlertService } from 'src/app/shared/alert.service';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
var ProviderInventoryComponent = /** @class */ (function () {
    function ProviderInventoryComponent(appEventsService, alert, providerService) {
        var _this = this;
        this.appEventsService = appEventsService;
        this.alert = alert;
        this.providerService = providerService;
        this.providers = [];
        this.currentOptions = -1;
        this.searchTerm$ = new Subject();
        this.getSearchResults = function (searchItem) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (searchItem) {
                    this.isLoading = true;
                    this.providers = this.providers.filter(function (provider) {
                        return provider.name.toLowerCase().includes(searchItem.toLowerCase());
                    });
                    this.isLoading = false;
                }
                else {
                    this.getProvidersData();
                }
                return [2 /*return*/];
            });
        }); };
        this.getProvidersData = function () {
            _this.isLoading = true;
            _this.providerService.getProviders(_this.pageSize, _this.pageNo).subscribe(function (providerData) {
                var _a = providerData.data, providers = _a.providers, totalResults = _a.pageMeta.totalResults;
                _this.totalItems = totalResults;
                _this.providers = providers;
                _this.appEventsService.broadcast({
                    name: 'updateHeaderTitle',
                    content: { badgeSize: _this.totalItems, actionButton: 'Add Provider' }
                });
                _this.isLoading = false;
            }, function () {
                _this.isLoading = false;
                _this.displayText = "Oops! We're having connection problems.";
            });
            _this.currentOptions = -1;
        };
        this.pageNo = 1;
        this.pageSize = ITEMS_PER_PAGE;
        this.isLoading = true;
        this.getSearchResults(this.searchTerm$);
    }
    ProviderInventoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getProvidersData();
        this.updateSubscription = this.appEventsService.subscribe('updatedProvidersEvent', function () { return _this.getProvidersData(); });
        this.deleteSubscription = this.appEventsService.subscribe('providerDeletedEvent', function () { return _this.getProvidersData(); });
        this.updateListSubscription = this.appEventsService.subscribe('newProvider', function () { return _this.getProvidersData(); });
    };
    ProviderInventoryComponent.prototype.setPage = function (page) {
        this.pageNo = page;
        this.getProvidersData();
    };
    ProviderInventoryComponent.prototype.showOptions = function (providerId) {
        this.currentOptions = this.currentOptions === providerId ? -1 : providerId;
    };
    ProviderInventoryComponent.prototype.ngOnDestroy = function () {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
        if (this.deleteSubscription) {
            this.deleteSubscription.unsubscribe();
            if (this.updateListSubscription) {
                this.updateListSubscription.unsubscribe();
            }
        }
    };
    ProviderInventoryComponent = __decorate([
        Component({
            selector: 'app-providers',
            templateUrl: './provider-inventory.component.html',
            styleUrls: [
                '../../cabs/cab-inventory/cab-inventory.component.scss',
                '../../../auth/login-redirect/login-redirect.component.scss'
            ],
            providers: [SearchService]
        }),
        __metadata("design:paramtypes", [AppEventService,
            AlertService,
            ProviderService])
    ], ProviderInventoryComponent);
    return ProviderInventoryComponent;
}());
export { ProviderInventoryComponent };
//# sourceMappingURL=provider-inventory.component.js.map