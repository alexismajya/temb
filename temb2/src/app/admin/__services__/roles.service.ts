import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUserRoleModal } from '../../shared/models/roles.model';
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  rolesUrl = `${environment.tembeaBackEndUrl}/api/v1/roles`;
  usersUrl = `${ environment.tembeaBackEndUrl}/api/v1/users`;

  constructor(private http: HttpClient) {}


  getRoles(): Observable<any> {
    return this.http.get<any>(this.rolesUrl);
  }

  assignRoleToUser(data: IUserRoleModal): Observable<any> {
    return this.http.post<any>(`${this.rolesUrl}/user`, data);
  }

  deleteUserRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.rolesUrl}/user/${id}`);
  }

  getUsers(name): Observable<any> {
    if (name) {
      return this.http.get<any>(`${this.usersUrl}?name=${name}`);
    }
    return this.http.get<any>(this.usersUrl);
  }
}
