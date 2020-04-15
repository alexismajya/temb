import { Component, Input, OnChanges } from '@angular/core';
import 'chart.piecelabel.js';

@Component({
  selector: 'app-trip-pie-chart',
  templateUrl: './trip-pie-chart.component.html',
  styleUrls: ['./trip-pie-chart.component.scss']
})
export class TripPieChartComponent implements OnChanges {
  @Input() normalTripCount: number;
  @Input() travelTripCount: number;
  incomingData: Array<number> = [0, 0];
  validData = false;
  title = 'Total Daily Trips';
  pieChartLabels: Array<string> = ['Normal trips', 'Travel trips'];
  pieChartDatasets: Array<any> = [
    {
      data: this.incomingData,
      borderWidth: 4,
    }
  ];
  pieChartType = 'pie';
  pieChartoptions: object = {
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
  pieChartColors: Array<any> =
  [
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

  constructor() {}

  setPiechartData(normalTrip, travelTrip) {
    if (normalTrip >= 1 || travelTrip >= 1) {
      this.validData = true;
    } else {
      this.validData = false;
    }
    this.incomingData = [normalTrip, travelTrip];
    this.pieChartDatasets[0].data = this.incomingData;
  }

  ngOnChanges() {
    this.setPiechartData(this.normalTripCount, this.travelTripCount);
  }
}
