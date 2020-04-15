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
import 'chart.piecelabel.js';
var TripPieChartComponent = /** @class */ (function () {
    function TripPieChartComponent() {
        this.incomingData = [0, 0];
        this.validData = false;
        this.title = 'Total Daily Trips';
        this.pieChartLabels = ['Normal trips', 'Travel trips'];
        this.pieChartDatasets = [
            {
                data: this.incomingData,
                borderWidth: 4,
            }
        ];
        this.pieChartType = 'pie';
        this.pieChartoptions = {
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            responsive: true,
            pieceLabel: {
                render: 'value',
                fontColor: '#FFFFFF',
                fontSize: 16,
                fontStyle: 'bold',
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 0,
                    bottom: 60
                }
            }
        };
        this.pieChartColors = [
            {
                backgroundColor: [
                    '#3359DB',
                    '#7A94EB'
                ],
                hoverBackgroundColor: [
                    '#3359DB',
                    '#7A94EB'
                ],
            }
        ];
    }
    TripPieChartComponent.prototype.setPiechartData = function (normalTrip, travelTrip) {
        if (normalTrip >= 1 || travelTrip >= 1) {
            this.validData = true;
        }
        else {
            this.validData = false;
        }
        this.incomingData = [normalTrip, travelTrip];
        this.pieChartDatasets[0].data = this.incomingData;
    };
    TripPieChartComponent.prototype.ngOnChanges = function () {
        this.setPiechartData(this.normalTripCount, this.travelTripCount);
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], TripPieChartComponent.prototype, "normalTripCount", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], TripPieChartComponent.prototype, "travelTripCount", void 0);
    TripPieChartComponent = __decorate([
        Component({
            selector: 'app-trip-pie-chart',
            templateUrl: './trip-pie-chart.component.html',
            styleUrls: ['./trip-pie-chart.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], TripPieChartComponent);
    return TripPieChartComponent;
}());
export { TripPieChartComponent };
//# sourceMappingURL=trip-pie-chart.component.js.map