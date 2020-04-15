import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/__services__/auth.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  baseUrl = `${environment.tembeaBackEndUrl}/api/v2/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.auth.tembeaToken,
    }),
  };

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) { }

  searchData(terms: Observable<string>, status: string, defaultTerm?: string) {
    return terms.debounceTime(1000)
      .distinctUntilChanged()
      .switchMap(term => {
        const trimmedTerm = term.trim();
        const [routesQuery, searchTerm] = this.getQueryAndTerm(status, trimmedTerm, defaultTerm);
        return this.searchItems(routesQuery, searchTerm);
      })
      .map(items => {
        return items.data;
      });
  }

  getQueryAndTerm(status: string, trimmedTerm: string, defaultTerm?: string) {
    if (/^[A-Z0-9]/ig.test(trimmedTerm)) {
      return [`${status}?name=`, trimmedTerm];
    }
    return [`${status}?`, defaultTerm];
  }

  searchItems(resourceEndpoint, term): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${resourceEndpoint}${term}`, this.httpOptions);
  }

}
