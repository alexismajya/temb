var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
var TripBarChartComponent = /** @class */ (function () {
    function TripBarChartComponent() {
        var _this = this;
        this.title = 'Trips by Department';
        this.barChartOptions = {
            responsive: true,
            plugins: {
                datalabels: {
                    display: false,
                }
            },
            tooltips: {
                backgroundColor: '#fff',
                bodyFontColor: '#000',
                bodyFontFamily: 'DIN Pro',
                titleFontColor: '#000',
                titleFontFamily: 'DIN Pro',
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                xPadding: 10,
                yPadding: 10,
                callbacks: {
                    title: function (tooltipItem) {
                        if (tooltipItem[0].datasetIndex === 0) {
                            return '';
                        }
                        return tooltipItem[0].value + (tooltipItem[0].value === '1' ? ' trip' : ' trips');
                    },
                    beforeBody: function (tooltipItem) {
                        return "$" + _this.tripCost[tooltipItem[0].index];
                    },
                    label: function (tooltip) {
                        return '';
                    },
                },
            },
            scales: {
                xAxes: [{
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            fontFamily: 'DIN Pro',
                            fontSize: 11,
                        }
                    }],
                yAxes: [{
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            fontFamily: 'DIN Pro',
                            beginAtZero: true,
                            fontSize: 11,
                            min: 0,
                            max: 30
                        }
                    }]
            }
        };
        this.barChartType = 'bar';
        this.barChartLegend = false;
        this.barChartPlugins = [pluginDataLabels];
        this.chartColors = [
            {
                borderColor: '#3359DB',
                backgroundColor: 'rgba(0,0,0,0)',
                pointBorderWidth: 2,
                pointBackgroundColor: '#3359DB',
                borderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 8,
                pointHoverBorderColor: 'white',
                hoverBackgroundColor: '#3359DB',
                hoverBorderColor: 'rgba(0,0,0,0)',
            },
            {
                pointBorderWidth: 2,
                pointBackgroundColor: '#3359DB',
                borderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 8,
                pointHoverBorderColor: 'white',
                hoverBorderColor: 'rgba(0,0,0,0)',
                backgroundColor: '#E0E8EA',
                hoverBackgroundColor: '#7E8EA2',
            }
        ];
    }
    TripBarChartComponent.prototype.ngOnInit = function () {
    };
    TripBarChartComponent.prototype.ngOnChanges = function () { };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TripBarChartComponent.prototype, "pluginDataLabels", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TripBarChartComponent.prototype, "labels", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TripBarChartComponent.prototype, "data", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TripBarChartComponent.prototype, "tripCost", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TripBarChartComponent.prototype, "dept", void 0);
    TripBarChartComponent = __decorate([
        Component({
            selector: 'app-trip-bar-chart',
            templateUrl: './trip-bar-chart.component.html',
            styleUrls: ['./trip-bar-chart.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], TripBarChartComponent);
    return TripBarChartComponent;
}());
export { TripBarChartComponent };
//# sourceMappingURL=trip-bar-chart.component.js.map