import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { filterDateParameters, formatCurrentDate } from 'src/app/utils/helpers';
import { environment } from '../../../../environments/environment';
import { BaseHttpService } from '../../baseHttpService';

@Injectable({
  providedIn: 'root'
})
export class RiderService extends BaseHttpService {
  constructor(http: HttpClient) {
    super(http);
  }

  getRiders(dateRange): Observable<any> {
    const { startDate, endDate } = filterDateParameters(dateRange);
    const fromStr = startDate ? `from=${startDate}` : 'from=2016-01-01';
    const toStr = endDate ? `to=${endDate}` : `to=${formatCurrentDate()}`;
    return this.http.get(`${environment.tembeaBackEndUrl}/api/v1/routes/statistics/riders?${fromStr}&${toStr}`);
  }
}
