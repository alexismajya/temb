import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-average-trip-ratings',
  templateUrl: './average-trip-ratings.component.html',
  styleUrls: ['./average-trip-ratings.component.scss']
})
export class AverageTripRatingsComponent implements OnInit {
  title = 'Average Trip Rating';
  @Input() avgRatings;

  ngOnInit() {
  }
}

