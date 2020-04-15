var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HomeBaseService } from './homebase.service';
import { AppEventService } from './app-events.service';
var HomeBaseManager = /** @class */ (function () {
    function HomeBaseManager(homebaseService, appEventService) {
        this.homebaseService = homebaseService;
        this.appEventService = appEventService;
        this.store = localStorage;
    }
    HomeBaseManager.prototype.setHomebase = function (homebase) {
        var _this = this;
        this.homebaseService.getByName(homebase)
            .subscribe(function (h) {
            _this.store.setItem('HOMEBASE_NAME', h.homebase[0].homebaseName);
            _this.store.setItem('HOMEBASE_ID', h.homebase[0].id.toString());
            _this.appEventService.broadcast({ name: 'setHomebase' });
        });
    };
    HomeBaseManager.prototype.storeHomebase = function (homebase) {
        this.store.setItem('HOMEBASE_NAME', homebase.name);
        this.store.setItem('HOMEBASE_ID', homebase.id.toString());
    };
    HomeBaseManager.prototype.getHomebaseId = function () {
        var id = this.store.getItem('HOMEBASE_ID');
        if (!id) {
            throw new Error('User did not specify any homebase');
        }
        return id;
    };
    HomeBaseManager.prototype.getHomeBase = function () {
        try {
            var homebaseName = this.store.getItem('HOMEBASE_NAME');
            var id = parseInt(this.store.getItem('HOMEBASE_ID'), 10);
            if (!id || !homebaseName) {
                throw new Error('User did not specify any homebase');
            }
            return ({ id: id, homebaseName: homebaseName });
        }
        catch (error) {
            throw new Error('User did not specify any homebase');
        }
    };
    HomeBaseManager = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HomeBaseService, AppEventService])
    ], HomeBaseManager);
    return HomeBaseManager;
}());
export { HomeBaseManager };
//# sourceMappingURL=homebase.manager.js.map