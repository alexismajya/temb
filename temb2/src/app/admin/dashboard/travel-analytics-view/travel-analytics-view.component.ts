import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-travel-analytics-view',
  templateUrl: './travel-analytics-view.component.html',
  styleUrls: ['./travel-analytics-view.component.scss']
})
export class TravelAnalyticsViewComponent implements OnInit {

  @Input() rating;
  @Input() totalCount;
  @Input() title;
  constructor() { }

  ngOnInit() {
  }

}
