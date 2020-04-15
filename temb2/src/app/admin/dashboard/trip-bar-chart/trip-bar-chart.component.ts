import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-trip-bar-chart',
  templateUrl: './trip-bar-chart.component.html',
  styleUrls: ['./trip-bar-chart.component.scss']
})

export class TripBarChartComponent implements OnInit, OnChanges {
  title = 'Trips by Department';
  @Input() pluginDataLabels;
  @Input() labels;
  @Input() data;
  @Input() tripCost;
  @Input() dept;

  public barChartOptions: ChartOptions = {
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
        title: (tooltipItem) => {
          if (tooltipItem[0].datasetIndex === 0) {
            return '';
          }
          return tooltipItem[0].value + (tooltipItem[0].value === '1' ? ' trip' : ' trips');
        },
        beforeBody: (tooltipItem) => {
          return `$${this.tripCost[tooltipItem[0].index]}`;
        },
        label: (tooltip) => {
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
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [pluginDataLabels];
  public chartColors: Color[] = [
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

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() { }
}
