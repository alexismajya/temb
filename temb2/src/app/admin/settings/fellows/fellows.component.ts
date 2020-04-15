import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FellowsService } from '../../__services__/fellows.service';
import { ISerializedFellowDetail } from 'src/app/shared/models/fellows.model';
import {Observable} from 'rxjs/Observable';
@Component({
  selector: 'app-fellows',
  templateUrl: './fellows.component.html',
  styleUrls: [
    './fellows.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ]
})
export class FellowsComponent implements OnInit {
  @Input() onRoute: boolean;
  @Input() showRemoveIcon: boolean;
  @Input() showAddIcon: boolean;
  @Input() activeTab: Observable<boolean>;
  @Output() fellowsOnRouteEventEmitter = new EventEmitter();
  isLoading: boolean;
  fellows: ISerializedFellowDetail[];
  totalItems: number;
  pageSize: number;
  pageNumber: number;
  displayText = 'No engineers currently on routes';
  constructor(
    private fellowService: FellowsService
  ) {
    this.pageNumber = 1;
    this.pageSize = 9;
    this.isLoading = true;
  }
  ngOnInit() {
    this.activeTab.subscribe(e => {
      if (e === this.onRoute) { this.loadFellows(this.onRoute); }
    });
  }

  loadFellows(onRoute) {
    this.isLoading = true;
    this.fellowService.getFellows(onRoute, this.pageSize, this.pageNumber).subscribe(
      data => {
        const { data: { fellows, pageMeta } } = data;
        if (!Array.isArray(fellows)) {
          this.isLoading = false;
          return (this.displayText = 'Something went wrong');
        }
        this.fellows = fellows.length && fellows.map(this.serializeFellow);
        this.totalItems = pageMeta.totalItems;
        this.isLoading = false;
        this.fellowsOnRouteEventEmitter.emit({
          totalItems: this.totalItems,
          onRoute: onRoute ? 'On Route' : 'Off Route'
        });
      },
      error => {
        this.isLoading = false;
        this.displayText =
          error.status === 404
            ? this.displayText
            : 'There was an error fetching this data';
      }
    );
  }

  serializeFellow(fellow: any): ISerializedFellowDetail {
    return {
      id: fellow.userId,
      name: fellow.name,
      image: fellow.picture,
      partner: fellow.placement ? fellow.placement.client : 'N/A',
      tripsTaken: `${fellow.tripsTaken} / ${fellow.totalTrips}`,
      startDate: fellow.placement && fellow.placement.created_at,
      endDate: fellow.placement && fellow.placement.next_available_date
    };
  }
  setPage(page: number): void {
    this.pageNumber = page;
    this.loadFellows(this.onRoute);
  }
}
