import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DepartmentsModel } from 'src/app/shared/models/departments.model';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  departmentsUrl: string;
  teamUrl = environment.teamUrl;
  constructor(private http: HttpClient) {
    this.departmentsUrl = `${environment.tembeaBackEndUrl}/api/v1/departments`;
  }
  get(size: number, page: number): Observable<DepartmentsModel> {
    return this.http.get<any>(`${this.departmentsUrl}?size=${size}&page=${page}`).map(departments => {
      return new DepartmentsModel().deserialize(departments);
    });
  }

  add(data: Object): Observable<any> {
    const homebaseId = localStorage.getItem('HOMEBASE_ID');
    return this.http.post<any>(this.departmentsUrl, { ...data, slackUrl: this.teamUrl, homebaseId });
  }

  delete(id: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id, }
    };

    return this.http.delete(`${environment.tembeaBackEndUrl}/api/v1/departments`, httpOptions);
  }

  update(id: number, name: string, email: string) {

    const content = {
      name,
      headEmail: email
    };
    return this.http.put(`${environment.tembeaBackEndUrl}/api/v1/departments/${id}`, content);
  }
}
