import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-trips-line-chart',
  templateUrl: './trips-line-chart.component.html',
  styleUrls: ['./trips-line-chart.component.scss']
})
export class TripsLineChartComponent {
  @Input() chartLabels: Label[] = [];
  @Input() chartData: ChartDataSets[];

  public currency = 'Ksh';
  public title = 'Travel Trips - Trends';
  public chartOptions = {
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
      custom: (tooltip) => {
        if (!tooltip) { return; }
        tooltip.displayColors = true;
      },
      callbacks: {
        title: (tooltipItem, data) => {
          return `${data.datasets[tooltipItem[0].datasetIndex].label}`;
        },
        label: (tooltipItem) => {
          return `${tooltipItem.yLabel} Trip(s)`;
        },
        footer: (tooltipItem, data) => {
          const { index, datasetIndex } = tooltipItem[0];
          return `${this.currency} ${data.datasets[datasetIndex].tripsCost[index]}`;
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
  public chartColors: Color[] = [
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
  public chartLegend = false;
  public chartType = 'line';

  constructor() {}

}
