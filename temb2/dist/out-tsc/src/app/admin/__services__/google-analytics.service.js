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
import { environment } from '../../../environments/environment';
var GoogleAnalyticsService = /** @class */ (function () {
    function GoogleAnalyticsService() {
        this.trackingId = environment.googleAnalyticsId;
    }
    GoogleAnalyticsService.prototype.init = function () {
        var script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.google-analytics.com/analytics.js';
        document.head.appendChild(script1);
        var script2 = document.createElement('script');
        script2.innerHTML = "\n    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;\n    ga('create', '" + this.trackingId + "', 'auto');\n    ";
        document.head.appendChild(script2);
    };
    GoogleAnalyticsService.prototype.sendPageView = function (url) {
        ga('set', 'page', url);
        ga('send', 'pageview');
    };
    GoogleAnalyticsService.prototype.sendEvent = function (category, action) {
        ga('send', 'event', category, action);
    };
    GoogleAnalyticsService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], GoogleAnalyticsService);
    return GoogleAnalyticsService;
}());
export { GoogleAnalyticsService };
//# sourceMappingURL=google-analytics.service.js.map