import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IRouteTrips } from '../../shared/models/route-trips.model';
import {IPageMeta} from '../../shared/models/page-meta.model';
import { AlertService } from '../../shared/alert.service';

export interface IRouteTripsData {
  pageMeta: IPageMeta;
  data: IRouteTrips[];
}

@Injectable({
  providedIn: 'root'
})
export class RouteTripsService {
  routeTripsUrl: string;
  routeTripsV2Url: string;
  constructor(private http: HttpClient, public toastr: AlertService) {
    this.routeTripsUrl = `${environment.tembeaBackEndUrl}/api/v1/trips/routetrips`;
    this.routeTripsV2Url = `${environment.tembeaBackEndUrl}/api/v2/trips/routetrips`;
  }

  getBatchTripsRecords({ page, pageSize }: { page: number; pageSize: number; }): Observable<IRouteTripsData> {
    return this.http.get<any>(`${this.routeTripsV2Url}?page=${page}&size=${pageSize}`)
      .pipe(map(res => res), catchError(err => this.handleError(err)));
  }

  handleError(err: any): Observable<any> {
    this.toastr.error('There was an error while getting route trips.');
    return throwError(err.message);
  }
}
