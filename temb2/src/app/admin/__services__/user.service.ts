import { IUserInfo } from './../../shared/models/user.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUserEdit } from '../../shared/models/user.model';

export interface UserObject {
  success: boolean;
  message: string;
  user: {
    name: string;
    email: string;
    phoneNo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = `${environment.tembeaBackEndUrl}/api/v1/users`;

  constructor(private http: HttpClient) {}

  addUser(data: IUserInfo): Observable<UserObject> {
    return this.http.post<UserObject>(this.userUrl, data);
  }

  deleteUser(email: string): Observable<any> {
    return this.http.delete<any>(`${this.userUrl}/${email}`);
  }

  editUser(user: IUserEdit): Observable<any> {
    return this.http.put<any>(`${this.userUrl}`, user);
  }
}
