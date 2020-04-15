import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RouteInventoryModel } from 'src/app/shared/models/route-inventory.model';
import { IResponseModel } from '../../shared/models/driver.model';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root',
})
export class RoutesInventoryService {
  routesUrl = `${environment.tembeaBackEndUrl}/api/v1/routes`;
  routesV2Url = `${environment.tembeaBackEndUrl}/api/v2/routes`;
  teamUrl = environment.teamUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    body: { teamUrl: environment.teamUrl }
};

  constructor(
    private http: HttpClient,
  ) { }

  getRoutes(size: number, page: number, sort: string): Observable<IResponseModel<RouteInventoryModel>> {
    return this.http.get<IResponseModel<RouteInventoryModel>>(`${this.routesV2Url}?sort=${sort}&size=${size}&page=${page}`);
  }

  changeRouteStatus(id: number, data: Object): Observable<any> {
    return this.http.put(`${this.routesUrl}/${id}`, { ...data, teamUrl: this.teamUrl });
  }

  deleteRouteBatch(id: number) {
    return this.http.delete(`${environment.tembeaBackEndUrl}/api/v1/routes/${id}`, this.httpOptions);
  }

  createRoute(data, duplicate = false): any {
    const queryParams = `${duplicate ? `?batchId=${data}&action=duplicate` : ''}`;
    const body = duplicate ? {} : data;
    return this.http
      .post(`${this.routesUrl}${queryParams}`, { ...body, teamUrl: this.teamUrl }, this.httpOptions)
      .toPromise();
  }
}

