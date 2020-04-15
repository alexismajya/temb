import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';

@Injectable()
export class LocationService {
  baseUrl: string;

  constructor(private readonly http: HttpClient, private cookie: CookieService) {
    this.baseUrl = `${environment.tembeaBackEndUrl}/api/v1/locations`;
  }

  getById(id: number): Observable<any> {
    const token = this.cookie.get('tembea_token');
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': token }),
    };
    return this.http.get<any>(`${this.baseUrl}/${id}`, httpOptions);
  }
}
