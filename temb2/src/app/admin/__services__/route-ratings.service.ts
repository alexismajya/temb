import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { filterDateParameters, formatCurrentDate } from 'src/app/utils/helpers';
import { BaseHttpService } from '../baseHttpService';



@Injectable({
  providedIn: 'root'
})
export class RouteRatingsService extends BaseHttpService {
  constructor(http: HttpClient) {
    super(http);
  }

  getRouteAverages(dateFilter): Observable<any> {
    const { startDate, endDate } = filterDateParameters(dateFilter);
    const fromStr = startDate ? `from=${startDate}` : 'from=2016-01-01';
    const toStr = endDate ? `to=${endDate}` : `to=${formatCurrentDate()}`;
    return this.http.get(`${environment.tembeaBackEndUrl}/api/v1/routes/ratings?${fromStr}&${toStr}`);
  }
}
