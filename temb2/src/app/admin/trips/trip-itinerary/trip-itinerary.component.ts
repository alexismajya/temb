import { Component, OnInit, Input, EventEmitter, Output, Inject } from '@angular/core';
import * as moment from 'moment';
import { TripRequestService } from '../../__services__/trip-request.service';
import { TripRequest } from 'src/app/shared/models/trip-request.model';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { AppEventService } from '../../../shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
import { MatDialog } from '@angular/material';
import { ProviderService } from '../../__services__/providers.service';
import { getStartAndEndDate } from '../../../utils/helpers';
import { BaseTableComponent } from '../../base-table/base-table.component';



@Component({
  selector: 'app-trip-itinerary',
  templateUrl: './trip-itinerary.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss',
    './trip-itinerary.component.scss',
    '../../travel/airport-transfers/airport-transfers.component.scss'
  ],
})
export class TripItineraryComponent extends BaseTableComponent implements OnInit {

  @Input() tripRequestType: string;
  tripRequests: TripRequest[] = [];
  departmentsRequest: any = [];
  page: number;
  pageSize: number;
  totalItems: number;
  dateFilters = {
    requestedOn: {},
    departureTime: {},
  };
  status = 'Confirmed';
  departmentName: string;
  rating: number;
  filterParams: any;
  passedParams = {};
  state = 'Approved/Confirmed';
  loading: boolean;
  @Output()
  tripTotalEventEmitter = new EventEmitter();
  noCab = false;
  startInitialDate: string;
  endInitialDate: string;
  startDateMax: string;
  endDateMax: string;

  constructor(
    private tripRequestService: TripRequestService,
    public appEventService: AppEventService,
    private alertService: AlertService,
    public providerService: ProviderService,
    public dialog: MatDialog ,
  ) {
    super(dialog);
    this.pageSize = ITEMS_PER_PAGE;
    this.page = 1;
    this.rowType = 'Regular Trip';
  }
  ngOnInit() {
    switch (this.tripRequestType) {
      case 'declinedTrips':
        this.state = 'Declined';
        this.status = 'DeclinedByOps';
        break;
      case 'pastTrips':
        this.status = null;
        break;
      case 'pending':
        this.status = 'Pending';
        break;
      case 'awaitingProvider':
        this.noCab = true;
        this.status = null;
        this.rowType = 'Regular Trip';
        break;
      case 'all':
        this.status = null;
        break;
      case 'awaitingApproval':
        this.status = 'Pending';
        break;
      default:
        this.status = 'Confirmed';
        break;
    }

    // populate date picker
    const [startDate, endDate] = getStartAndEndDate();
    this.startInitialDate = startDate;
    this.endInitialDate = endDate;
    this.startDateMax = moment().format('YYYY-MM-DD');
    this.endDateMax = moment().format('YYYY-MM-DD');

    this.getTrips(this.status);
    this.getDepartments();
  }

  getDepartments() {
    this.tripRequestService.getDepartments()
      .subscribe(departmentsData => this.departmentsRequest = departmentsData);
  }

  getPastTrips(trips: TripRequest[]): TripRequest[] {
    const removeStatus = ['Cancelled', 'DeclinedByOps', 'DeclinedByManager'];
    return trips.filter((trip) => {
      return ((moment(trip.departureTime) < moment()) && !removeStatus.some(v => v === trip.status)) || (trip.status === 'Completed');
    });
  }

  getTrips(status = 'Confirmed') {
    this.loading = true;
    const tripStatus = this.tripRequestType === 'pastTrips' ? null : status;
    const { page, pageSize: size, departmentName: department, dateFilters } = this;
    this.tripRequestService.query({ page, size, status: tripStatus, department, type: this.rowType, dateFilters, noCab: this.noCab })
      .subscribe(tripData => {
        const { pageInfo, trips } = tripData;
        let newTrips = trips;
        if (this.tripRequestType === 'pastTrips') {
          newTrips = this.getPastTrips(trips);
        }
        this.tripRequests = newTrips;
        this.totalItems = newTrips.length;
        if (this.tripRequestType === 'all' || this.tripRequestType === 'confirmed') {
          this.appEventService.broadcast({
            name: 'updateHeaderTitle',
            content: { badgeSize: pageInfo.totalResults, tooltipTitle: 'All Trips' }
          });
        }
        this.tripTotalEventEmitter.emit({ totalItems: this.totalItems, tripRequestType: this.tripRequestType });
        this.loading = false;
      }, () => {
        this.alertService.error('Error occured while retrieving data');
      });
  }

  updatePage(page) {
    this.page = page;
    this.getTrips(this.status);
  }

  setDateFilter(field: string, range: 'before' | 'after', date: string) {
    const currentDate = moment().format('YYYY-MM-DD');
    const fieldObject = this.dateFilters[field] || {};
    this.dateFilters[field] = { ...fieldObject, [range]: date };
    const timeOfDeparture = moment(date).format('YYYY-MM-DD');
    if (this.tripRequestType === 'upcomingTrips' && timeOfDeparture < currentDate) {
      this.dateFilters = {
        requestedOn: {},
        departureTime: {},
      };
    }

    this.getTrips(this.status);
  }

  departmentSelected($event) {
    this.departmentName = $event;
    this.getTrips(this.status);
  }

  setFilterParams() {
    const { dateFilters, departmentName } = this;
    this.filterParams = {
      dateFilters, department: departmentName
    };
  }

  checkTripRequestType(tripRequestType: string): boolean {
    return this.tripRequestType === tripRequestType;
  }
}
