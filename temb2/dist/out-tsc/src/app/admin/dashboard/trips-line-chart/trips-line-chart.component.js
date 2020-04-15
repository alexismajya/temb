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
var TripsLineChartComponent = /** @class */ (function () {
    function TripsLineChartComponent() {
        var _this = this;
        this.chartLabels = [];
        this.currency = 'Ksh';
        this.title = 'Travel Trips - Trends';
        this.chartOptions = {
            responsive: true,
            scales: {
                xAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            fontFamily: 'DIN Pro',
                            fontSize: 13,
                        },
                    }],
                yAxes: [
                    {
                        position: 'left',
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            beginAtZero: true,
                            fontFamily: 'DIN Pro',
                            fontSize: 13,
                            min: 0,
                            max: 30,
                        },
                    },
                ],
            },
            tooltips: {
                custom: function (tooltip) {
                    if (!tooltip) {
                        return;
                    }
                    tooltip.displayColors = true;
                },
                callbacks: {
                    title: function (tooltipItem, data) {
                        return "" + data.datasets[tooltipItem[0].datasetIndex].label;
                    },
                    label: function (tooltipItem) {
                        return tooltipItem.yLabel + " Trip(s)";
                    },
                    footer: function (tooltipItem, data) {
                        var _a = tooltipItem[0], index = _a.index, datasetIndex = _a.datasetIndex;
                        return _this.currency + " " + data.datasets[datasetIndex].tripsCost[index];
                    },
                },
                titleFontFamily: 'DIN Pro',
                titleFontStyle: 'normal',
                titleFontColor: '#3359DB',
                bodyFontFamily: 'DIN Pro',
                bodyFontStyle: 'bold',
                bodyFontColor: '#000000',
                footerFontFamily: 'DIN Pro',
                footerFontStyle: 'normal',
                footerFontColor: '#000000',
                xPadding: 10,
                yPadding: 15,
                backgroundColor: '#FFFFFF',
                borderColor: '#DDDDDD',
                borderWidth: 1,
            },
        };
        this.chartColors = [
            {
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: '#3359DB',
                borderWidth: 2,
                pointBorderWidth: 2,
                pointBackgroundColor: '#3359DB',
                pointHoverRadius: 8,
                pointHoverBorderWidth: 8,
                pointHoverBorderColor: 'white',
                hoverBackgroundColor: '#3359DB',
                hoverBorderColor: 'rgba(0,0,0,0)',
            },
            {
                borderColor: '#E0E8EA',
                borderWidth: 2,
                backgroundColor: 'rgba(0,0,0,0)',
                pointBorderWidth: 1,
                pointBackgroundColor: '#E0E8EA',
            }
        ];
        this.chartLegend = false;
        this.chartType = 'line';
    }
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], TripsLineChartComponent.prototype, "chartLabels", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], TripsLineChartComponent.prototype, "chartData", void 0);
    TripsLineChartComponent = __decorate([
        Component({
            selector: 'app-trips-line-chart',
            templateUrl: './trips-line-chart.component.html',
            styleUrls: ['./trips-line-chart.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], TripsLineChartComponent);
    return TripsLineChartComponent;
}());
export { TripsLineChartComponent };
//# sourceMappingURL=trips-line-chart.component.js.map