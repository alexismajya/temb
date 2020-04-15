import { AppEventService } from './../../../../shared/app-events.service';
import {Component, OnInit, Output, AfterViewInit} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-fellow-nav',
  templateUrl: './fellow-nav.component.html',
  styleUrls: ['./fellow-nav.component.scss']
})
export class FellowNavComponent implements OnInit, AfterViewInit {
  fellowsCount = {};
  @Output() selected = new Subject<boolean>();

  constructor(private appEventService: AppEventService) {}
  ngOnInit() { }

  ngAfterViewInit() {
   this.selected.next(true);
  }

  getSelectedTab(event) {
    const { textLabel } = event.tab;
    this.selected.next(textLabel === 'On Route');
  }

  fellowsOnRouteCount(event: {onRoute: string, totalItems: number}) {
    this.fellowsCount[event.onRoute] = event.totalItems;
    this.appEventService.broadcast({
      name: 'updateHeaderTitle',
      content: {
        badgeSize: event.totalItems,
        tooltipTitle: event.onRoute
      }
    });
  }
}
