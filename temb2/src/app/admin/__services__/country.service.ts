import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CountryService {
  countryUrl = `${environment.tembeaBackEndUrl}/api/v1/countries`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any> {
    return this.http.get<any>(this.countryUrl, this.httpOptions);
  }
}
