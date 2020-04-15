import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-total-cost-view',
  templateUrl: './total-cost-view.component.html',
  styleUrls: ['./total-cost-view.component.scss']
})
export class TotalCostViewComponent implements OnInit {

  @Input() totalCost: number;
  title: String = 'Total Trip Cost';

  constructor() { }

  ngOnInit() {
  }
}
