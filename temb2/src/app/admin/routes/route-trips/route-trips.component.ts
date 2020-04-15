import { BaseTableComponent } from '../../base-table/base-table.component';
import { Component, OnInit } from '@angular/core';
import { IRouteTrips } from '../../../shared/models/route-trips.model';
import { MatDialog } from '@angular/material';
import { RouteTripsService } from '../../__services__/route-trips.service';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  selector: 'app-route-trips',
  templateUrl: './route-trips.component.html',
  styleUrls: ['./route-trips.component.scss']
})
export class RouteTripsComponent extends BaseTableComponent implements OnInit {
  page: number;
  pageSize: number;
  totalItems: number;
  routeTrips: IRouteTrips[] = [];
  isLoading: boolean;
  dataContainer: IRouteTrips[] = [];

  constructor(
    private routeTripsService: RouteTripsService,
    private appEventsService: AppEventService,
    public dialog: MatDialog,
  ) {
    super(dialog);
    this.page = 1;
    this.pageSize = 10;
    this.rowType = 'routeRecord';
  }

  ngOnInit() {
    this.setPage(this.page);
  }

  getRouteTrips() {
    this.isLoading = true;
    const { page, pageSize } = this;
    this.routeTripsService.getBatchTripsRecords({ page, pageSize })
      .subscribe(data => {
        this.routeTrips = data.data;
        this.dataContainer = data.data;
        this.totalItems = this.routeTrips.length;
        this.appEventsService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: this.totalItems } });
        this.isLoading = false;
      });
  }

  setPage(page: number): void {
    this.page = page;
    this.getRouteTrips();
  }

  escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  getSuggestions = (value: string, data: Array<any>, isString: boolean) => {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');
    const suggestions = data.filter(string => {
      if (isString) { return regex.test(string.batch.route.name); } else { return regex.test(string.batch.batch); }
    });

    return suggestions;
  }

  searchForValue(value: string, isString: boolean): void {
    this.routeTrips = this.getSuggestions(value, this.routeTrips, isString);
    this.totalItems = this.routeTrips.length;
    this.routeTrips.length === 0 ? this.routeTrips = this.dataContainer : this.isLoading = false;
  }

  filterTableData(value: string): void {
    if (!parseInt(value, 10)) {
      this.searchForValue(value, true);
    } else {
      this.searchForValue(value, false);
    }
  }
}
