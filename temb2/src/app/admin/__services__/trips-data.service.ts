import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { filterDateParameters } from 'src/app/utils/helpers';

@Injectable({
  providedIn: 'root'
})
export class TripsDataService {

  constructor(private http: HttpClient) { }

  getTripData(dateFilter, tripType = '', departments): Observable<any> {
    const queryParams = tripType ? `?tripType=${tripType}` : '';
    const { startDate, endDate } = filterDateParameters(dateFilter);
    const data: object = { startDate, endDate, departments };
    const results = this.http.post(`${environment.tembeaBackEndUrl}/api/v1/departments/trips${queryParams}`, { ...data });
    return results;
  }

  getTravelData(dateFilter): Observable<any> {
    const { startDate, endDate } = filterDateParameters(dateFilter);
    const data: object = { startDate, endDate };
    const results = this.http.post(`${environment.tembeaBackEndUrl}/api/v1/trips/travel`, { ...data });
    return results;
  }

}
